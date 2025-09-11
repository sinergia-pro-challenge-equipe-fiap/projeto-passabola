import React, { useMemo, useState } from "react";
import { matches } from "../components/data/matches"; // << caminho correto

// helpers
const iso = (t) => new Date(t).toISOString().split("T")[0];
const toNum = (x) => Number(String(x || 0).replace(/[^\d.-]/g, "")) || 0;
const parseScore = (score) => {
  if (!score) return [null, null];
  const [a, b] = score.split(":").map((s) => toNum(s));
  return [a, b];
};

export default function Estatisticas() {
  // filtros
  const leagues = useMemo(() => {
    const s = new Set(matches.map((m) => m.league));
    return ["Todas", ...Array.from(s)];
  }, []);
  const [league, setLeague] = useState("Todas");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // dataset filtrado
  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (league !== "Todas" && m.league !== league) return false;
      if (from && iso(m.datetime) < from) return false;
      if (to && iso(m.datetime) > to) return false;
      return true;
    });
  }, [league, from, to]);

  // somente jogos com placar
  const withScore = filtered.filter((m) => m.score);
  const finished = filtered.filter((m) => m.status === "finished");

  // times
  const teams = useMemo(() => {
    const s = new Set();
    filtered.forEach((m) => { s.add(m.team1); s.add(m.team2); });
    return Array.from(s);
  }, [filtered]);

  // tabela de classificação
  const table = useMemo(() => {
    const map = new Map();
    const blank = () => ({ j: 0, v: 0, e: 0, d: 0, gf: 0, ga: 0, sg: 0, pts: 0 });
    teams.forEach((t) => map.set(t, blank()));

    finished.forEach((m) => {
      const [a, b] = parseScore(m.score);
      if (a == null || b == null) return;
      const A = map.get(m.team1) || blank();
      const B = map.get(m.team2) || blank();
      A.j++; B.j++; A.gf += a; A.ga += b; B.gf += b; B.ga += a;
      if (a > b) { A.v++; B.d++; A.pts += 3; }
      else if (a < b) { B.v++; A.d++; B.pts += 3; }
      else { A.e++; B.e++; A.pts += 1; B.pts += 1; }
      A.sg = A.gf - A.ga; B.sg = B.gf - B.ga;
      map.set(m.team1, A); map.set(m.team2, B);
    });

    return Array.from(map.entries())
      .map(([team, s]) => ({ team, ...s }))
      .sort((x, y) =>
        y.pts - x.pts || y.sg - x.sg || y.gf - x.gf || x.team.localeCompare(y.team)
      );
  }, [teams, finished]);

  // KPIs
  const kpis = useMemo(() => {
    const jogos = withScore.length;
    let gols = 0;
    let mandWins = 0, empates = 0, visWins = 0;
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

    return {
      jogos,
      gols,
      media: jogos ? (gols / jogos).toFixed(2) : "0.00",
      pctMand: (mandWins + visWins + empates) ? Math.round((mandWins / (mandWins + visWins + empates)) * 100) : 0,
      maiorPlacar: maxMatch ? `${maxMatch.team1} ${maxMatch.score} ${maxMatch.team2}` : "—",
    };
  }, [withScore]);

  // Top ataques e defesas
  const topAtaque = useMemo(() => {
    return table.slice(0).sort((a, b) => b.gf - a.gf).slice(0, 5);
  }, [table]);
  const topDefesa = useMemo(() => {
    return table.slice(0).sort((a, b) => a.ga - b.ga).slice(0, 5);
  }, [table]);

  // Gols por dia
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

  // Heatmap por horário
  const byHour = useMemo(() => {
    const counts = Array.from({ length: 24 }, () => 0);
    filtered.forEach((m) => {
      const h = new Date(m.datetime).getHours();
      counts[h] += 1;
    });
    const max = counts.reduce((a, b) => Math.max(a, b), 1);
    return { counts, max };
  }, [filtered]);

  // componente de barra
  const Bar = ({ value, max, label, right }) => (
    <div className="flex items-center gap-3">
      <span className="w-28 text-sm text-gray-600 dark:text-gray-300 truncate">{label}</span>
      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg h-3 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-600 to-pink-500" style={{ width: `${(value / max) * 100 || 0}%` }} />
      </div>
      <span className="w-10 text-right text-sm text-gray-700 dark:text-gray-200">{right ?? value}</span>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Título + filtros */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Estatísticas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 w-full lg:w-auto">
          <select value={league} onChange={(e)=>setLeague(e.target.value)} className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            {leagues.map((l) => <option key={l}>{l}</option>)}
          </select>
          <input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white"/>
          <input type="date" value={to}   onChange={(e)=>setTo(e.target.value)}   className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white"/>
          <button onClick={()=>{ setLeague("Todas"); setFrom(""); setTo(""); }} className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm">
            Limpar
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Jogos com placar</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{kpis.jogos}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Gols marcados</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{kpis.gols}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Média gols/jogo</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{kpis.media}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">% vitórias mandante</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{kpis.pctMand}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow md:col-span-2 xl:col-span-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">Maior placar</p>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{kpis.maiorPlacar}</p>
        </div>
      </div>

      {/* Classificação */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
        <div className="px-4 py-3 border-b dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold dark:text-white">Tabela (jogos encerrados)</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">{table.length} times</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
            <tr>
              <th className="text-left p-3">#</th>
              <th className="text-left p-3">Time</th>
              <th className="text-center p-3">J</th>
              <th className="text-center p-3">V</th>
              <th className="text-center p-3">E</th>
              <th className="text-center p-3">D</th>
              <th className="text-center p-3">GF</th>
              <th className="text-center p-3">GA</th>
              <th className="text-center p-3">SG</th>
              <th className="text-center p-3">Pts</th>
            </tr>
          </thead>
          <tbody>
            {table.map((t, i) => (
              <tr key={t.team} className="border-t dark:border-gray-700">
                <td className="p-3">{i + 1}</td>
                <td className="p-3 font-medium text-gray-800 dark:text-gray-100">{t.team}</td>
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
          </tbody>
        </table>
      </div>

      {/* Top ataques / defesas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
          <h3 className="font-semibold mb-3 dark:text-white">Top ataques (GF)</h3>
          {topAtaque.map((t) => (
            <Bar key={t.team} value={t.gf} max={topAtaque[0]?.gf || 1} label={t.team} />
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
          <h3 className="font-semibold mb-3 dark:text-white">Melhores defesas (GA ↓)</h3>
          {topDefesa.map((t) => (
            <Bar key={t.team} value={(topDefesa[4]?.ga ?? t.ga) - t.ga + (topDefesa[0]?.ga ?? 0)} max={(topDefesa[4]?.ga ?? 1)} label={t.team} right={t.ga} />
          ))}
        </div>
      </div>

      {/* Gols por dia */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
        <h3 className="font-semibold mb-3 dark:text-white">Gols por dia</h3>
        {goalsByDay.arr.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Sem jogos com placar no período.</p>
        ) : (
          <div className="flex items-end gap-2 h-40">
            {goalsByDay.arr.map(([d, v]) => (
              <div key={d} className="flex flex-col items-center gap-1">
                <div className="w-6 bg-gradient-to-t from-purple-600 to-pink-500 rounded"
                     style={{ height: `${(v / goalsByDay.max) * 100 || 0}%` }} />
                <span className="text-[10px] text-gray-500 dark:text-gray-400 rotate-[-45deg] origin-top-left">{d.slice(5)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Heatmap por horário */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
        <h3 className="font-semibold mb-4 dark:text-white">Distribuição de partidas por horário</h3>
        <div className="grid grid-cols-6 gap-2">
          {byHour.counts.map((c, h) => {
            const pct = c / byHour.max;
            const bg = pct === 0 ? "bg-gray-100 dark:bg-gray-700"
              : "bg-gradient-to-br from-purple-600 to-pink-500";
            return (
              <div key={h} className="rounded-lg p-3 text-center text-xs text-white"
                   style={{ opacity: 0.25 + pct * 0.75 }}
                   title={`${c} partida(s) às ${String(h).padStart(2,"0")}:00`}>
                <div className={`rounded ${bg}`}>
                  <div className="py-3" />
                </div>
                <div className="mt-1 text-gray-600 dark:text-gray-300">{String(h).padStart(2,"0")}h</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}