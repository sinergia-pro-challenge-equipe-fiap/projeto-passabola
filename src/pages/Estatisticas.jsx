import React, { useMemo, useState } from "react";
import { matches } from "../components/data/matches";

/** Helpers gerais **/
const iso = (t) => new Date(t).toISOString().split("T")[0];
const toNum = (x) => Number(String(x || 0).replace(/[^\d.-]/g, "")) || 0;
const parseScore = (score) => {
  if (!score) return [null, null];
  const [a, b] = score.split(":").map((s) => toNum(s));
  return [a, b];
};
const fmtDateTime = (ms) => {
  const d = new Date(ms);
  return `${d.toLocaleDateString()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};
const downloadText = (filename, text) => {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
};

/** Componente principal **/
export default function Estatisticas() {
  /** Filtros básicos **/
  const leagues = useMemo(() => {
    const s = new Set(matches.map((m) => m.league));
    return ["Todas", ...Array.from(s)];
  }, []);
  const teamsAll = useMemo(() => {
    const s = new Set();
    matches.forEach((m) => { s.add(m.team1); s.add(m.team2); });
    return Array.from(s).sort();
  }, []);
  const [league, setLeague] = useState("Todas");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [teamFilter, setTeamFilter] = useState("Todos");
  const [search, setSearch] = useState("");

  /** Dataset filtrado de partidas **/
  const filteredMatches = useMemo(() => {
    const q = search.trim().toLowerCase();
    return matches.filter((m) => {
      if (league !== "Todas" && m.league !== league) return false;
      if (from && iso(m.datetime) < from) return false;
      if (to && iso(m.datetime) > to) return false;
      if (teamFilter !== "Todos" && !(m.team1 === teamFilter || m.team2 === teamFilter)) return false;
      if (q) {
        const hay = `${m.team1} ${m.team2} ${m.city} ${m.league} ${m.round}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [league, from, to, teamFilter, search]);

  const withScore = filteredMatches.filter((m) => m.score);
  const finished = filteredMatches.filter((m) => m.status === "finished");

  /** Times presentes no dataset filtrado (pra tabela) **/
  const teamsFiltered = useMemo(() => {
    const s = new Set();
    filteredMatches.forEach((m) => { s.add(m.team1); s.add(m.team2); });
    return Array.from(s);
  }, [filteredMatches]);

  /** Tabela de classificação com ordenação **/
  const [sortBy, setSortBy] = useState({ col: "pts", dir: "desc" }); // col: 'pts' | 'j' | 'v' | ...
  const table = useMemo(() => {
    const map = new Map();
    const blank = () => ({ j: 0, v: 0, e: 0, d: 0, gf: 0, ga: 0, sg: 0, pts: 0 });
    teamsFiltered.forEach((t) => map.set(t, blank()));

    finished.forEach((m) => {
      const [a, b] = parseScore(m.score);
      if (a == null || b == null) return;
      const A = { ...map.get(m.team1) };
      const B = { ...map.get(m.team2) };
      A.j++; B.j++; A.gf += a; A.ga += b; B.gf += b; B.ga += a;
      if (a > b) { A.v++; B.d++; A.pts += 3; }
      else if (a < b) { B.v++; A.d++; B.pts += 3; }
      else { A.e++; B.e++; A.pts++; B.pts++; }
      A.sg = A.gf - A.ga; B.sg = B.gf - B.ga;
      map.set(m.team1, A); map.set(m.team2, B);
    });

    const arr = Array.from(map.entries()).map(([team, s]) => ({ team, ...s }));
    const { col, dir } = sortBy;
    const mult = dir === "asc" ? 1 : -1;
    arr.sort((x, y) => {
      if (col === "team") return mult * x.team.localeCompare(y.team);
      return mult * ((y[col] ?? 0) - (x[col] ?? 0) || (y.sg - x.sg) || (y.gf - x.gf) || x.team.localeCompare(y.team));
    });
    return arr;
  }, [teamsFiltered, finished, sortBy]);

  const toggleSort = (col) => {
    setSortBy((s) => s.col === col ? { col, dir: s.dir === "asc" ? "desc" : "asc" } : { col, dir: "desc" });
  };

  /** KPIs **/
  const kpis = useMemo(() => {
    const jogos = withScore.length;
    let gols = 0, mandWins = 0, empates = 0, visWins = 0;
    let maxScore = null, maxMatch = null;

    withScore.forEach((m) => {
      const [a, b] = parseScore(m.score);
      if (a == null || b == null) return;
      gols += a + b;
      if (m.status === "finished") {
        if (a > b) mandWins++; else if (a < b) visWins++; else empates++;
      }
      if (!maxScore || a + b > maxScore) { maxScore = a + b; maxMatch = m; }
    });

    const porLiga = {};
    filteredMatches.forEach((m) => { porLiga[m.league] = (porLiga[m.league] || 0) + 1; });

    return {
      jogos,
      gols,
      media: jogos ? (gols / jogos).toFixed(2) : "0.00",
      pctMand: (mandWins + visWins + empates) ? Math.round((mandWins / (mandWins + visWins + empates)) * 100) : 0,
      maiorPlacar: maxMatch ? `${maxMatch.team1} ${maxMatch.score} ${maxMatch.team2}` : "—",
      porLiga,
    };
  }, [withScore, filteredMatches]);

  /** Tops **/
  const topAtaque = useMemo(() => table.slice(0).sort((a, b) => b.gf - a.gf).slice(0, 5), [table]);
  const topDefesa = useMemo(() => table.slice(0).sort((a, b) => a.ga - b.ga).slice(0, 5), [table]);

  /** Gols por dia **/
  const goalsByDay = useMemo(() => {
    const d = {};
    withScore.forEach((m) => {
      const key = iso(m.datetime);
      const [a, b] = parseScore(m.score);
      if (a == null || b == null) return;
      d[key] = (d[key] || 0) + a + b;
    });
    const arr = Object.entries(d).sort((x, y) => x[0].localeCompare(y[0]));
    const max = arr.reduce((acc, [, v]) => Math.max(acc, v), 1);
    return { arr, max };
  }, [withScore]);

  /** Heatmap horário **/
  const byHour = useMemo(() => {
    const counts = Array.from({ length: 24 }, () => 0);
    filteredMatches.forEach((m) => counts[new Date(m.datetime).getHours()]++);
    const max = counts.reduce((a, b) => Math.max(a, b), 1);
    return { counts, max };
  }, [filteredMatches]);

  /** Painel de detalhes do time **/
  const [teamOpen, setTeamOpen] = useState(null);
  const teamDetail = useMemo(() => {
    if (!teamOpen) return null;
    const jogos = filteredMatches.filter((m) => m.team1 === teamOpen || m.team2 === teamOpen);
    const encerrados = jogos.filter((m) => m.status === "finished");
    let v = 0, e = 0, d = 0, gf = 0, ga = 0;
    const ultimos = [];
    encerrados.forEach((m) => {
      const [a, b] = parseScore(m.score);
      if (a == null || b == null) return;
      const isHome = m.team1 === teamOpen;
      const me = isHome ? a : b;
      const op = isHome ? b : a;
      gf += me; ga += op;
      if (me > op) v++; else if (me < op) d++; else e++;
      ultimos.push({ ...m, res: me > op ? "V" : me < op ? "D" : "E" });
    });
    ultimos.sort((x, y) => y.datetime - x.datetime);
    return {
      jogos, encerrados, v, e, d, gf, ga, sg: gf - ga,
      form: ultimos.slice(0, 5).map((j) => j.res),
      proximo: jogos.filter((m) => m.status === "upcoming").sort((a, b) => a.datetime - b.datetime)[0] || null,
      recentes: ultimos.slice(0, 6),
    };
  }, [teamOpen, filteredMatches]);

  /** Head-to-Head **/
  const [h2hA, setH2hA] = useState("CORINTHIANS");
  const [h2hB, setH2hB] = useState("PALMEIRAS");
  const headToHead = useMemo(() => {
    if (!h2hA || !h2hB || h2hA === h2hB) return { jogos: [], saldoA: 0, saldoB: 0, vA: 0, vB: 0, e: 0 };
    const jogos = matches
      .filter((m) =>
        (m.team1 === h2hA && m.team2 === h2hB) || (m.team1 === h2hB && m.team2 === h2hA)
      )
      .slice(0)
      .sort((a, b) => b.datetime - a.datetime)
      .slice(0, 10);
    let saldoA = 0, saldoB = 0, vA = 0, vB = 0, e = 0;
    jogos.forEach((m) => {
      const [a, b] = parseScore(m.score || "");
      if (a == null || b == null) return;
      const sA = m.team1 === h2hA ? a - b : b - a;
      saldoA += sA;
      saldoB -= sA;
      if (sA > 0) vA++; else if (sA < 0) vB++; else e++;
    });
    return { jogos, saldoA, saldoB, vA, vB, e };
  }, [h2hA, h2hB]);

  /** Exportações **/
  const exportClassificacaoCSV = () => {
    const header = "Time;J;V;E;D;GF;GA;SG;Pts";
    const lines = table.map((t) => `${t.team};${t.j};${t.v};${t.e};${t.d};${t.gf};${t.ga};${t.sg};${t.pts}`);
    downloadText(`classificacao_${Date.now()}.csv`, [header, ...lines].join("\n"));
  };
  const exportPartidasCSV = () => {
    const header = "Data;Liga;Fase;Status;Time1;Time2;Cidade;Placar";
    const lines = filteredMatches
      .slice(0)
      .sort((a, b) => a.datetime - b.datetime)
      .map((m) => `${fmtDateTime(m.datetime)};${m.league};${m.round};${m.status};${m.team1};${m.team2};${m.city};${m.score || "-"}`);
    downloadText(`partidas_${Date.now()}.csv`, [header, ...lines].join("\n"));
  };

  /** Componentes visuais auxiliares **/
  const Card = ({ children, className = "" }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow ${className}`}>{children}</div>
  );
  const Bar = ({ value, max, label, right }) => (
    <div className="flex items-center gap-3">
      <span className="w-32 text-sm text-gray-600 dark:text-gray-300 truncate">{label}</span>
      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg h-3 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-600 to-pink-500" style={{ width: `${(value / max) * 100 || 0}%` }} />
      </div>
      <span className="w-10 text-right text-sm text-gray-700 dark:text-gray-200">{right ?? value}</span>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Cabeçalho e filtros */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Estatísticas</h2>
          <p className="text-gray-600 dark:text-gray-400">Explore resultados, desempenho por time e comparações head-to-head.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 w-full lg:w-auto">
          <select value={league} onChange={(e)=>setLeague(e.target.value)} className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            {leagues.map((l) => <option key={l}>{l}</option>)}
          </select>
          <select value={teamFilter} onChange={(e)=>setTeamFilter(e.target.value)} className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option>Todos</option>
            {teamsAll.map((t) => <option key={t}>{t}</option>)}
          </select>
          <input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white"/>
          <input type="date" value={to}   onChange={(e)=>setTo(e.target.value)}   className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white"/>
          <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Buscar…" className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white"/>
          <button onClick={()=>{ setLeague("Todas"); setFrom(""); setTo(""); setTeamFilter("Todos"); setSearch(""); }} className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm">
            Limpar
          </button>
        </div>
      </div>

      {/* KPIs + Resumo por liga */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card><p className="text-sm text-gray-500 dark:text-gray-400">Jogos com placar</p><p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{kpis.jogos}</p></Card>
        <Card><p className="text-sm text-gray-500 dark:text-gray-400">Gols marcados</p><p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{kpis.gols}</p></Card>
        <Card><p className="text-sm text-gray-500 dark:text-gray-400">Média gols/jogo</p><p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{kpis.media}</p></Card>
        <Card><p className="text-sm text-gray-500 dark:text-gray-400">% vitórias mandante</p><p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{kpis.pctMand}%</p></Card>
        <Card className="xl:col-span-2"><p className="text-sm text-gray-500 dark:text-gray-400">Maior placar</p><p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{kpis.maiorPlacar}</p></Card>
      </div>

      <Card>
        <h3 className="font-semibold mb-3 dark:text-white">Resumo por liga</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(kpis.porLiga).map(([liga, qt]) => (
            <div key={liga} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
              <span className="text-sm dark:text-gray-200">{liga}</span>
              <span className="text-purple-600 dark:text-purple-400 font-semibold">{qt} jogos</span>
            </div>
          ))}
          {Object.keys(kpis.porLiga).length === 0 && <span className="text-sm text-gray-500 dark:text-gray-400">Nenhuma partida no filtro atual.</span>}
        </div>
      </Card>

      {/* Classificação + Export + Painel do time */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
          <div className="px-4 py-3 border-b dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold dark:text-white">Tabela (jogos encerrados)</h3>
            <div className="flex gap-2">
              <button onClick={exportClassificacaoCSV} className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm">Exportar CSV</button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 select-none">
              <tr>
                {["#", "team", "j", "v", "e", "d", "gf", "ga", "sg", "pts"].map((c, i) => (
                  <th key={c} className={`p-3 ${i<=1 ? "text-left" : "text-center"} cursor-pointer`} onClick={()=>toggleSort(c==="#"?"pts":c)}>
                    {c === "#" ? sortBy.col==="pts" ? `Pts (${sortBy.dir==="asc"?"↑":"↓"})` : "Pts" : c.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.map((t, i) => (
                <tr key={t.team} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/60">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-medium">
                    <button onClick={()=>setTeamOpen(t.team)} className="text-left text-gray-800 dark:text-gray-100 hover:underline">{t.team}</button>
                  </td>
                  <td className="p-3 text-center">{t.j}</td>
                  <td className="p-3 text-center">{t.v}</td>
                  <td className="p-3 text-center">{t.e}</td>
                  <td className="p-3 text-center">{t.d}</td>
                  <td className="p-3 text-center">{t.gf}</td>
                  <td className="p-3 text-center">{t.ga}</td>
                  <td className="p-3 text-center">{t.sg}</td>
                  <td className="p-3 text-center font-semibold text-purple-600 dark:text-purple-400">{t.pts}</td>
                </tr>
              ))}
              {table.length === 0 && (
                <tr><td colSpan={10} className="p-4 text-center text-gray-500 dark:text-gray-400">Nenhum time no filtro atual.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Painel do time selecionado */}
        <div>
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold dark:text-white">Detalhes do time</h3>
              {teamOpen && <button className="text-sm opacity-70 hover:opacity-100" onClick={()=>setTeamOpen(null)}>Limpar</button>}
            </div>
            {!teamOpen && <p className="text-sm text-gray-500 dark:text-gray-400">Clique em um time na tabela para ver detalhes.</p>}
            {teamOpen && teamDetail && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold dark:text-white">{teamOpen}</span>
                  <div className="flex gap-1">
                    {teamDetail.form.map((f, i) => (
                      <span key={i} className={`px-2 py-0.5 rounded text-xs font-semibold ${f==="V"?"bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-200":f==="D"?"bg-red-100 text-red-700 dark:bg-red-800/40 dark:text-red-200":"bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"}`}>{f}</span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-xl text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-300">V/E/D</div>
                    <div className="font-semibold dark:text-white">{teamDetail.v}/{teamDetail.e}/{teamDetail.d}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-xl text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-300">GF / GA</div>
                    <div className="font-semibold dark:text-white">{teamDetail.gf}/{teamDetail.ga}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-xl text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-300">Saldo</div>
                    <div className="font-semibold dark:text-white">{teamDetail.sg}</div>
                  </div>
                </div>
                {teamDetail.proximo && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                    <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">Próximo jogo</div>
                    <div className="text-sm dark:text-gray-100">
                      {teamDetail.proximo.team1} vs {teamDetail.proximo.team2} • {fmtDateTime(teamDetail.proximo.datetime)} • {teamDetail.proximo.city}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">Recentes</div>
                  <div className="space-y-1">
                    {teamDetail.recentes.map((m) => (
                      <div key={m.id} className="flex justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <span className="text-sm dark:text-gray-100">{m.team1} {m.score} {m.team2}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-300">{fmtDateTime(m.datetime)}</span>
                      </div>
                    ))}
                    {teamDetail.recentes.length === 0 && <div className="text-sm text-gray-500 dark:text-gray-400">Sem jogos encerrados.</div>}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Tops */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold mb-3 dark:text-white">Top ataques (GF)</h3>
          {topAtaque.map((t) => <Bar key={t.team} value={t.gf} max={topAtaque[0]?.gf || 1} label={t.team} />)}
        </Card>
        <Card>
          <h3 className="font-semibold mb-3 dark:text-white">Melhores defesas (GA ↓)</h3>
          {topDefesa.map((t) => <Bar key={t.team} value={(topDefesa[4]?.ga ?? t.ga) - t.ga + (topDefesa[0]?.ga ?? 0)} max={(topDefesa[4]?.ga ?? 1)} label={t.team} right={t.ga} />)}
        </Card>
      </div>

      {/* Gráficos simples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold dark:text-white">Gols por dia</h3>
            <button onClick={exportPartidasCSV} className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm">Exportar jogos CSV</button>
          </div>
          {goalsByDay.arr.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Sem jogos com placar no período.</p>
          ) : (
            <div className="flex items-end gap-2 h-40">
              {goalsByDay.arr.map(([d, v]) => (
                <div key={d} className="flex flex-col items-center gap-1">
                  <div className="w-6 bg-gradient-to-t from-purple-600 to-pink-500 rounded" style={{ height: `${(v / goalsByDay.max) * 100 || 0}%` }} />
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 rotate-[-45deg] origin-top-left">{d.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-semibold mb-3 dark:text-white">Distribuição de partidas por horário</h3>
          <div className="grid grid-cols-6 gap-2">
            {byHour.counts.map((c, h) => {
              const pct = c / byHour.max;
              const bg = pct === 0 ? "bg-gray-100 dark:bg-gray-700" : "bg-gradient-to-br from-purple-600 to-pink-500";
              return (
                <div key={h} className="rounded-lg p-3 text-center text-xs text-white" style={{ opacity: 0.25 + pct * 0.75 }}>
                  <div className={`rounded ${bg}`}><div className="py-3" /></div>
                  <div className="mt-1 text-gray-600 dark:text-gray-300">{String(h).padStart(2,"0")}h</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Head-to-Head */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold dark:text-white">Head-to-Head</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
          <select value={h2hA} onChange={(e)=>setH2hA(e.target.value)} className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white md:col-span-2">
            {teamsAll.map((t) => <option key={`A-${t}`}>{t}</option>)}
          </select>
          <select value={h2hB} onChange={(e)=>setH2hB(e.target.value)} className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white md:col-span-2">
            {teamsAll.map((t) => <option key={`B-${t}`}>{t}</option>)}
          </select>
          <div className="md:col-span-2 flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-300">{h2hA}</span>
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs">V {headToHead.vA}</span>
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs">E {headToHead.e}</span>
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs">D {headToHead.vB}</span>
            <span className="ml-auto text-sm text-gray-600 dark:text-gray-300">{h2hB}</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
          {headToHead.jogos.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">Sem confrontos recentes.</div>
          ) : headToHead.jogos.map((m) => (
            <div key={m.id} className="flex justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <span className="text-sm dark:text-gray-100">{m.team1} {m.score || "-"} {m.team2}</span>
              <span className="text-xs text-gray-500 dark:text-gray-300">{fmtDateTime(m.datetime)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}