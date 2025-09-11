// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

/* =========================================================
   Helpers simples
========================================================= */
const fmtDate = (d) => new Date(d).toLocaleDateString();
const fmtTime = (d) => new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const toISO = (d) => new Date(d).toISOString().split("T")[0];
const isSameISO = (a, b) => toISO(a) === toISO(b);

/* =========================================================
   App
========================================================= */
export default function App() {
  /* ---------- Tema ---------- */
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);
  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  /* ---------- Navegação simples (sem router) ---------- */
  const [page, setPage] = useState("home"); // "home" | "partidas"

  /* ---------- Dados Home (os seus) ---------- */
  const timesFemininos = [
    { name: "Corinthians", pontos: 30 },
    { name: "Santos", pontos: 28 },
    { name: "Flamengo", pontos: 25 },
    { name: "Palmeiras", pontos: 27 },
    { name: "São Paulo", pontos: 22 },
    { name: "Grêmio", pontos: 20 },
  ];
  const jogosAoVivo = [
    { team1: "Corinthians", team2: "Santos", score: "2 : 1", posse: "55%", finalizacoes: "8-5" },
    { team1: "Flamengo", team2: "Palmeiras", score: "0 : 0", posse: "48%", finalizacoes: "3-4" },
    { team1: "São Paulo", team2: "Grêmio", score: "1 : 3", posse: "45%", finalizacoes: "5-9" },
  ];
  const ultimosJogos = [
    { team1: "Corinthians", team2: "Palmeiras", time: "19:00", loc: "São Paulo", score: "3:2", posse: "60%", finalizacoes: "10-6" },
    { team1: "Santos", team2: "Flamengo", time: "21:00", loc: "Rio de Janeiro", score: "1:1", posse: "52%", finalizacoes: "7-7" },
    { team1: "Grêmio", team2: "São Paulo", time: "18:00", loc: "Porto Alegre", score: "0:2", posse: "40%", finalizacoes: "4-8" },
  ];
  const proximosJogos = [
    { team1: "Palmeiras", team2: "Santos", time: "20:00", loc: "São Paulo" },
    { team1: "Corinthians", team2: "Flamengo", time: "21:00", loc: "Rio de Janeiro" },
  ];
  const melhoresJogadoras = [
    { name: "Alexia", gols: 20 },
    { name: "Bia", gols: 18 },
    { name: "Carla", gols: 15 },
    { name: "Daniela", gols: 14 },
    { name: "Elisa", gols: 12 },
  ];
  const [filter, setFilter] = useState("Todos");
  const filteredJogos = filter === "Todos" ? ultimosJogos : ultimosJogos.filter(j => j.team1 === filter || j.team2 === filter);

  /* =========================================================
     PARTIDAS — dados e estado
  ========================================================= */
  // partidas mock profissionais
  const base = Date.now();
  const partidas = [
    // LIVE
    { id: 1,  status: "live", league: "Brasileirão Fem.", round: "Rodada 14", team1: "Corinthians", team2: "Santos", city: "São Paulo",   datetime: base,                     score: "2 : 1", stats: { posse: "55%", finalizacoes: "8-5", escanteios: "4" } },
    { id: 2,  status: "live", league: "Copa do Brasil Fem.", round: "Quartas", team1: "Internacional", team2: "Athletico-PR", city: "Porto Alegre", datetime: base, score: "0 : 0", stats: { posse: "48%", finalizacoes: "4-4", escanteios: "2" } },
    // UPCOMING
    { id: 3,  status: "upcoming", league: "Brasileirão Fem.", round: "Rodada 15", team1: "Palmeiras", team2: "São Paulo", city: "São Paulo",   datetime: base + 1000*60*60*3 },
    { id: 4,  status: "upcoming", league: "Amistoso", round: "—", team1: "Flamengo", team2: "Grêmio", city: "Rio de Janeiro", datetime: base + 1000*60*60*26 },
    { id: 5,  status: "upcoming", league: "Copa do Brasil Fem.", round: "Quartas", team1: "Santos", team2: "Botafogo", city: "Santos", datetime: base + 1000*60*60*50 },
    // FINISHED
    { id: 6,  status: "finished", league: "Brasileirão Fem.", round: "Rodada 13", team1: "São Paulo", team2: "Grêmio", city: "Porto Alegre", datetime: base - 1000*60*60*20, score: "1 : 3", stats: { posse: "45%", finalizacoes: "5-9", escanteios: "2" } },
    { id: 7,  status: "finished", league: "Amistoso", round: "—", team1: "Cruzeiro", team2: "Corinthians", city: "Belo Horizonte", datetime: base - 1000*60*60*48, score: "1 : 1", stats: { posse: "51%", finalizacoes: "6-6", escanteios: "3" } },
    { id: 8,  status: "finished", league: "Copa do Brasil Fem.", round: "Oitavas", team1: "Palmeiras", team2: "Flamengo", city: "São Paulo", datetime: base - 1000*60*60*75, score: "0 : 2", stats: { posse: "57%", finalizacoes: "9-7", escanteios: "7" } },
    // Mais alguns…
    { id: 9,  status: "upcoming", league: "Brasileirão Fem.", round: "Rodada 15", team1: "Bahia", team2: "Ceará", city: "Salvador", datetime: base + 1000*60*60*75 },
    { id: 10, status: "finished", league: "Brasileirão Fem.", round: "Rodada 12", team1: "Santos", team2: "Fluminense", city: "Santos", datetime: base - 1000*60*60*120, score: "3 : 0", stats: { posse: "62%", finalizacoes: "14-5", escanteios: "6" } },
    { id: 11, status: "upcoming", league: "Amistoso", round: "—", team1: "Fortaleza", team2: "Vitória", city: "Fortaleza", datetime: base + 1000*60*60*3.5 },
    { id: 12, status: "live", league: "Brasileirão Fem.", round: "Rodada 14", team1: "Fluminense", team2: "Botafogo", city: "Rio de Janeiro", datetime: base, score: "1 : 0", stats: { posse: "61%", finalizacoes: "7-3", escanteios: "5" } },
  ];

  // estado de UI
  const [tab, setTab] = useState("live");                // live | upcoming | finished
  const [q, setQ] = useState("");                        // busca
  const [league, setLeague] = useState("Todas");         // liga
  const [date, setDate] = useState("");                  // yyyy-mm-dd
  const [sort, setSort] = useState("timeAsc");           // ordenação
  const [view, setView] = useState("cards");             // cards | list
  const [onlyFav, setOnlyFav] = useState(false);         // mostrar só favoritos
  const [pageSize, setPageSize] = useState(6);           // paginação simples

  // favoritos persistidos (times)
  const [favTeams, setFavTeams] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favTeams") || "[]");
    } catch { return []; }
  });
  const toggleFav = (t) => {
    setFavTeams(prev => {
      const s = new Set(prev);
      s.has(t) ? s.delete(t) : s.add(t);
      const arr = [...s];
      localStorage.setItem("favTeams", JSON.stringify(arr));
      return arr;
    });
  };

  const leagues = ["Brasileirão Fem.", "Copa do Brasil Fem.", "Amistoso"];
  const quickDates = [
    { key: "today", label: "Hoje", fn: () => setDate(toISO(Date.now())) },
    { key: "tomorrow", label: "Amanhã", fn: () => setDate(toISO(Date.now() + 86400000)) },
    { key: "weekend", label: "Fim de semana", fn: () => {
        const d = new Date();
        const day = d.getDay(); // 0 dom … 6 sáb
        const sat = new Date(d); sat.setDate(d.getDate() + ((6 - day + 7) % 7));
        setDate(toISO(sat));
      }
    },
  ];

  // filtros + ordenação + favoritos + busca
  const partidasFiltradas = useMemo(() => {
    let arr = partidas
      .filter(p => p.status === tab)
      .filter(p => league === "Todas" ? true : p.league === league)
      .filter(p => {
        if (!q) return true;
        const t = q.toLowerCase();
        return p.team1.toLowerCase().includes(t) || p.team2.toLowerCase().includes(t) || (p.city?.toLowerCase().includes(t));
      })
      .filter(p => date ? isSameISO(p.datetime, date) : true)
      .filter(p => onlyFav ? (favTeams.includes(p.team1) || favTeams.includes(p.team2)) : true);

    // sort
    arr.sort((a, b) => {
      if (sort === "timeAsc")   return a.datetime - b.datetime;
      if (sort === "timeDesc")  return b.datetime - a.datetime;
      if (sort === "league")    return a.league.localeCompare(b.league);
      if (sort === "alpha")     return (a.team1 + a.team2).localeCompare(b.team1 + b.team2);
      return 0;
    });

    return arr;
  }, [partidas, tab, league, q, date, sort, onlyFav, favTeams]);

  const visible = partidasFiltradas.slice(0, pageSize);
  const hasMore = partidasFiltradas.length > visible.length;

  /* =========================================================
     Componente: MatchCard
  ========================================================= */
  const MatchCard = ({ m }) => {
    const statusBadge =
      m.status === "live" ? "bg-red-500/10 text-red-400 animate-pulse"
      : m.status === "upcoming" ? "bg-yellow-500/10 text-yellow-400"
      : "bg-emerald-500/10 text-emerald-400";

    const fav1 = favTeams.includes(m.team1);
    const fav2 = favTeams.includes(m.team2);

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow hover:shadow-xl transition border border-transparent hover:border-purple-500/20">
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 text-xs rounded-full ${statusBadge}`}>
            {m.status === "live" ? "AO VIVO" : m.status === "upcoming" ? "EM BREVE" : "ENCERRADO"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{m.league} • {m.round}</span>
        </div>

        <div className="mt-3 grid grid-cols-3 items-center gap-1">
          <div className="flex items-center gap-2">
            <button
              aria-label={`Favoritar ${m.team1}`}
              onClick={() => toggleFav(m.team1)}
              className={`w-6 h-6 rounded-lg border flex items-center justify-center text-xs
                ${fav1 ? "border-yellow-400 text-yellow-400" : "border-gray-300 dark:border-gray-600 text-gray-400 hover:text-yellow-400"}`}
              title="Favoritar"
            >★</button>
            <div className="flex flex-col">
              <span className="font-semibold dark:text-gray-100">{m.team1}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{m.city}</span>
            </div>
          </div>

          <div className="text-center">
            {m.status === "upcoming" ? (
              <div className="inline-block px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold">
                {fmtTime(m.datetime)}
              </div>
            ) : (
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{m.score}</div>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-400">{fmtDate(m.datetime)}</div>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <div className="flex flex-col items-end">
              <span className="font-semibold dark:text-gray-100">{m.team2}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{m.city}</span>
            </div>
            <button
              aria-label={`Favoritar ${m.team2}`}
              onClick={() => toggleFav(m.team2)}
              className={`w-6 h-6 rounded-lg border flex items-center justify-center text-xs
                ${fav2 ? "border-yellow-400 text-yellow-400" : "border-gray-300 dark:border-gray-600 text-gray-400 hover:text-yellow-400"}`}
              title="Favoritar"
            >★</button>
          </div>
        </div>

        {m.stats && (
          <div className="mt-3 grid grid-cols-3 text-sm text-gray-600 dark:text-gray-300 gap-2">
            <span>Posse: {m.stats.posse}</span>
            <span>Finalizações: {m.stats.finalizacoes}</span>
            <span>Escanteios: {m.stats.escanteios}</span>
          </div>
        )}

        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            onClick={() => navigator.clipboard?.writeText(`${m.team1} ${m.score ?? "vs"} ${m.team2} — ${m.league} (${fmtDate(m.datetime)} ${fmtTime(m.datetime)})`)}
            className="text-xs px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:opacity-90"
            title="Copiar resumo"
          >
            Compartilhar
          </button>
        </div>
      </div>
    );
  };

  /* =========================================================
     Layout
  ========================================================= */
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-500">
      {/* NAV */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg px-6 py-4 flex flex-col md:flex-row justify-between items-center transition-all duration-500 space-y-3 md:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-400">PassaBola</h1>
        </div>
        <div className="flex items-center space-x-6 text-gray-700 dark:text-gray-200 font-semibold">
          <button onClick={() => setPage("home")} className={`hover:text-purple-600 dark:hover:text-purple-400 transition ${page==="home"?"text-purple-700 dark:text-purple-300":""}`}>Home</button>
          <button onClick={() => setPage("partidas")} className={`hover:text-purple-600 dark:hover:text-purple-400 transition ${page==="partidas"?"text-purple-700 dark:text-purple-300":""}`}>Partidas</button>
          <span className="opacity-50">Estatísticas</span>
          <span className="opacity-50">Inscrições</span>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <input type="text" placeholder="Pesquisar..." className="px-3 py-2 border rounded-md hidden md:block w-full md:w-56 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <span className="text-gray-600 dark:text-gray-200">Maria Silva</span>
          <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
        </div>
      </nav>

      {/* CONTEÚDO */}
      <main className="flex-1 p-6">
        {page === "home" ? (
          /* ----------------------------- HOME ----------------------------- */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* ESQUERDA */}
            <div className="space-y-6 lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg transition-all duration-500">
                <h3 className="font-bold text-lg mb-4 dark:text-white">Jogos Ao Vivo</h3>
                {jogosAoVivo.map((j, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b dark:border-gray-600 last:border-0">
                    <span className="dark:text-gray-200">{j.team1}</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{j.score}</span>
                    <span className="dark:text-gray-200">{j.team2}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
                <h3 className="font-bold text-lg mb-3 dark:text-white">Melhores Jogadoras</h3>
                {melhoresJogadoras.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center mb-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                    <span className="dark:text-gray-200">{p.name}</span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">{p.gols} ⚡</span>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
                <h3 className="font-bold text-lg mb-3 dark:text-white">Filtrar Times</h3>
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full p-2 rounded-md border dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                  <option>Todos</option>
                  {timesFemininos.map((t, idx) => <option key={idx} value={t.name}>{t.name}</option>)}
                </select>
              </div>
            </div>

            {/* CENTRO */}
            <div className="space-y-6 lg:col-span-2">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-xl space-y-4 md:space-y-0">
                <div className="md:w-2/3">
                  <h2 className="text-3xl font-bold">Desafio Semanal de Futebol Feminino</h2>
                  <p className="mt-2 text-lg">Participe e mostre suas habilidades! Local: London • 5:00 PM</p>
                  <div className="mt-4 px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition inline-block">Inscreva-se</div>
                </div>
                <div className="w-48 h-48 bg-gray-300 rounded-xl"></div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
                <h3 className="font-bold text-lg mb-4 dark:text-white">Últimos Jogos</h3>
                {filteredJogos.map((j, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-xl mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="dark:text-gray-200 font-medium">{j.team1}</span>
                      <span className="text-purple-600 dark:text-purple-400 font-bold">vs</span>
                      <span className="dark:text-gray-200">{j.team2}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:space-x-4 mt-2 sm:mt-0 text-gray-600 dark:text-gray-300">
                      <span>Placar: {j.score}</span>
                      <span>Posse: {j.posse}</span>
                      <span>Finalizações: {j.finalizacoes}</span>
                      <span>Local: {j.loc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DIREITA */}
            <div className="space-y-6 lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
                <h3 className="font-bold text-lg mb-3 dark:text-white">Tendências agora</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-semibold dark:text-gray-200">Julia</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">⚡ 300 Gols</p>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold dark:text-white mb-2">Ranking de Times</h4>
                  {timesFemininos.map((t, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded-lg mb-2">
                      <span className="dark:text-gray-200">{t.name}</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">{t.pontos} pts</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold dark:text-white mb-2">Próximos Jogos</h4>
                  {proximosJogos.map((j, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded-lg mb-2">
                      <span className="dark:text-gray-200">{j.team1} vs {j.team2}</span>
                      <span className="dark:text-gray-300">{j.time} • {j.loc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* --------------------------- PARTIDAS --------------------------- */
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* header + tabs */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Partidas</h2>
                <p className="text-gray-600 dark:text-gray-400">Acompanhe ao vivo, confira as próximas e veja os confrontos encerrados.</p>
              </div>
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-full lg:w-auto">
                {[
                  {key:"live",label:"Ao vivo"},
                  {key:"upcoming",label:"Próximas"},
                  {key:"finished",label:"Encerradas"},
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => { setTab(t.key); setPageSize(6); }}
                    className={`flex-1 lg:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition
                      ${tab === t.key
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* filtros */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <input
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                placeholder="Buscar por time ou cidade..."
                className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white md:col-span-2"
              />
              <select
                value={league}
                onChange={(e)=>setLeague(e.target.value)}
                className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option>Todas</option>
                {leagues.map(l => <option key={l}>{l}</option>)}
              </select>
              <input
                type="date"
                value={date}
                onChange={(e)=>setDate(e.target.value)}
                className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <select
                value={sort}
                onChange={(e)=>setSort(e.target.value)}
                className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="timeAsc">Horário ↑</option>
                <option value="timeDesc">Horário ↓</option>
                <option value="league">Liga</option>
                <option value="alpha">A–Z</option>
              </select>
              <div className="flex items-center gap-2 justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" checked={onlyFav} onChange={(e)=>setOnlyFav(e.target.checked)} />
                  Só favoritos
                </label>
                <div className="flex gap-2">
                  <button onClick={()=>setView("cards")} className={`px-3 py-2 rounded-lg text-sm ${view==="cards"?"bg-gray-200 dark:bg-gray-700": "bg-gray-100 dark:bg-gray-800"}`}>Cards</button>
                  <button onClick={()=>setView("list")}  className={`px-3 py-2 rounded-lg text-sm ${view==="list" ?"bg-gray-200 dark:bg-gray-700": "bg-gray-100 dark:bg-gray-800"}`}>Lista</button>
                </div>
              </div>
            </div>

            {/* chips rápidas */}
            <div className="flex flex-wrap gap-2">
              {quickDates.map(c => (
                <button key={c.key} onClick={c.fn}
                  className="px-3 py-1 rounded-full text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-300">
                  {c.label}
                </button>
              ))}
              <button onClick={()=>{ setQ(""); setLeague("Todas"); setDate(""); setOnlyFav(false); setSort("timeAsc"); }}
                className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700">
                Limpar filtros
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                {partidasFiltradas.length} resultado(s)
              </span>
            </div>

            {/* resultados */}
            {partidasFiltradas.length === 0 ? (
              <div className="text-center text-gray-600 dark:text-gray-400 py-16 bg-white dark:bg-gray-800 rounded-2xl">
                Nenhuma partida encontrada para os filtros selecionados.
              </div>
            ) : view === "cards" ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visible.map(m => <MatchCard key={m.id} m={m} />)}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
                    <tr>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Partida</th>
                      <th className="text-left p-3">Liga/Rodada</th>
                      <th className="text-left p-3">Cidade</th>
                      <th className="text-left p-3">Data</th>
                      <th className="text-left p-3">Hora</th>
                      <th className="text-left p-3">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map(m => (
                      <tr key={m.id} className="border-t dark:border-gray-700">
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            m.status==="live"?"bg-red-500/10 text-red-400 animate-pulse":
                            m.status==="upcoming"?"bg-yellow-500/10 text-yellow-400":"bg-emerald-500/10 text-emerald-400"}`}>
                            {m.status==="live"?"AO VIVO":m.status==="upcoming"?"EM BREVE":"ENCERRADO"}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-gray-800 dark:text-gray-100">{m.team1} <span className="text-purple-500">vs</span> {m.team2}</td>
                        <td className="p-3 text-gray-600 dark:text-gray-300">{m.league} • {m.round}</td>
                        <td className="p-3 text-gray-600 dark:text-gray-300">{m.city}</td>
                        <td className="p-3 text-gray-600 dark:text-gray-300">{fmtDate(m.datetime)}</td>
                        <td className="p-3 text-gray-600 dark:text-gray-300">{fmtTime(m.datetime)}</td>
                        <td className="p-3">
                          <button onClick={()=>toggleFav(m.team1)} className={`px-2 py-1 rounded border text-xs mr-1 ${favTeams.includes(m.team1)?"border-yellow-400 text-yellow-400":"border-gray-300 dark:border-gray-600 text-gray-500"}`}>★ {m.team1}</button>
                          <button onClick={()=>toggleFav(m.team2)} className={`px-2 py-1 rounded border text-xs ${favTeams.includes(m.team2)?"border-yellow-400 text-yellow-400":"border-gray-300 dark:border-gray-600 text-gray-500"}`}>★ {m.team2}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* paginação / carregar mais */}
            {hasMore && (
              <div className="flex justify-center">
                <button
                  onClick={()=>setPageSize(s => s + 6)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:opacity-90">
                  Carregar mais
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-6 px-6 text-gray-600 dark:text-gray-300 transition-all">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="font-bold text-purple-700 dark:text-purple-400">PassaBola</h3>
            <p className="text-sm">Acompanhe seus jogos favoritos e fique por dentro do futebol feminino.</p>
          </div>
          <div className="flex space-x-4 text-xl">
            <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          © {new Date().getFullYear()} PassaBola. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}