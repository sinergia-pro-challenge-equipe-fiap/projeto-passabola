import React, { useMemo, useState } from "react";
import MatchCard from "../components/MatchCard";
import  { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Footer from "../components/Footer"

const fmtDateISO = (d) => new Date(d).toISOString().split("T")[0];
const isSameISO = (a, b) => fmtDateISO(a) === b;

export default function Partidas() {
  const base = Date.now();
  const partidas = [
    { id: 1, status: "live", league: "Brasileirão Fem.", round: "Rodada 14", team1: "Corinthians", team2: "Santos", city: "São Paulo", datetime: base, score: "2 : 1", stats: { posse: "55%", finalizacoes: "8-5", escanteios: "4" } },
    { id: 2, status: "live", league: "Copa do Brasil Fem.", round: "Quartas", team1: "Internacional", team2: "Athletico-PR", city: "Porto Alegre", datetime: base, score: "0 : 0", stats: { posse: "48%", finalizacoes: "4-4", escanteios: "2" } },
    { id: 3, status: "upcoming", league: "Brasileirão Fem.", round: "Rodada 15", team1: "Palmeiras", team2: "São Paulo", city: "São Paulo", datetime: base + 1000*60*60*3 },
    { id: 4, status: "upcoming", league: "Amistoso", round: "—", team1: "Flamengo", team2: "Grêmio", city: "Rio de Janeiro", datetime: base + 1000*60*60*26 },
    { id: 5, status: "upcoming", league: "Copa do Brasil Fem.", round: "Quartas", team1: "Santos", team2: "Botafogo", city: "Santos", datetime: base + 1000*60*60*50 },
    { id: 6, status: "finished", league: "Brasileirão Fem.", round: "Rodada 13", team1: "São Paulo", team2: "Grêmio", city: "Porto Alegre", datetime: base - 1000*60*60*20, score: "1 : 3", stats: { posse: "45%", finalizacoes: "5-9", escanteios: "2" } },
    { id: 7, status: "finished", league: "Amistoso", round: "—", team1: "Cruzeiro", team2: "Corinthians", city: "Belo Horizonte", datetime: base - 1000*60*60*48, score: "1 : 1", stats: { posse: "51%", finalizacoes: "6-6", escanteios: "3" } },
    { id: 8, status: "finished", league: "Copa do Brasil Fem.", round: "Oitavas", team1: "Palmeiras", team2: "Flamengo", city: "São Paulo", datetime: base - 1000*60*60*75, score: "0 : 2", stats: { posse: "57%", finalizacoes: "9-7", escanteios: "7" } },
  ];
  const leagues = ["Brasileirão Fem.", "Copa do Brasil Fem.", "Amistoso"];

  // estado
  const [tab, setTab] = useState("live");
  const [q, setQ] = useState("");
  const [league, setLeague] = useState("Todas");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState("timeAsc");
  const [view, setView] = useState("cards");
  const [onlyFav, setOnlyFav] = useState(false);
  const [pageSize, setPageSize] = useState(6);

  // favoritos (localStorage)
  const [favTeams, setFavTeams] = useState(() => {
    try { return JSON.parse(localStorage.getItem("favTeams") || "[]"); } catch { return []; }
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

  // filtros
  const filtered = useMemo(() => {
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

    // ordenação
    arr.sort((a,b)=>{
      if (sort==="timeAsc") return a.datetime - b.datetime;
      if (sort==="timeDesc") return b.datetime - a.datetime;
      if (sort==="league") return a.league.localeCompare(b.league);
      if (sort==="alpha") return (a.team1+a.team2).localeCompare(b.team1+b.team2);
      return 0;
    });

    return arr;
  }, [partidas, tab, league, q, date, onlyFav, favTeams, sort]);

  const visible = filtered.slice(0, pageSize);
  const hasMore = filtered.length > visible.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* título + tabs */}
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
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Buscar por time ou cidade..." className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white md:col-span-2" />
        <select value={league} onChange={(e)=>setLeague(e.target.value)} className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white">
          <option>Todas</option>
          {leagues.map(l => <option key={l}>{l}</option>)}
        </select>
        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
        <select value={sort} onChange={(e)=>setSort(e.target.value)} className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white">
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

      {/* resultados */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 py-16 bg-white dark:bg-gray-800 rounded-2xl">
          Nenhuma partida encontrada para os filtros selecionados.
        </div>
      ) : view === "cards" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map(m => <MatchCard key={m.id} m={m} toggleFav={toggleFav} favTeams={favTeams} />)}
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
                  <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(m.datetime).toLocaleDateString()}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(m.datetime).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* carregar mais */}
      {hasMore && (
        <div className="flex justify-center">
          <button onClick={()=>setPageSize(s=>s+6)} className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:opacity-90">
            Carregar mais
          </button>
        </div>
      )}
<Footer/>
    </div>
  );
}