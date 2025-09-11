import React, { useMemo, useState } from "react";
import MatchCard from "../components/MatchCard";
import { matches, leagues } from "../data/matches";

const tabs = [
  { key: "live", label: "Ao vivo" },
  { key: "upcoming", label: "Próximas" },
  { key: "finished", label: "Encerradas" },
];

export default function Partidas() {
  const [tab, setTab] = useState("live");
  const [q, setQ] = useState("");
  const [league, setLeague] = useState("Todas");
  const [date, setDate] = useState("");

  const filtered = useMemo(() => {
    return matches
      .filter(m => m.status === tab)
      .filter(m => (league === "Todas" ? true : m.league === league))
      .filter(m => {
        if (!q) return true;
        const term = q.toLowerCase();
        return (
          m.team1.toLowerCase().includes(term) ||
          m.team2.toLowerCase().includes(term) ||
          (m.city?.toLowerCase().includes(term))
        );
      })
      .filter(m => {
        if (!date) return true;
        const d = new Date(m.datetime);
        const iso = d.toISOString().split("T")[0];
        return iso === date;
      });
  }, [tab, q, league, date]);

  return (
    <div className="space-y-6">
      {/* Título + Tabs */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Partidas</h2>
          <p className="text-gray-600 dark:text-gray-400">Acompanhe ao vivo, confira as próximas e veja os confrontos encerrados.</p>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-full md:w-auto">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition
                ${tab === t.key
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          placeholder="Buscar por time ou cidade..."
          className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
        <button
          onClick={()=>{ setQ(""); setLeague("Todas"); setDate(""); }}
          className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:opacity-90"
        >
          Limpar filtros
        </button>
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 py-16 bg-white dark:bg-gray-800 rounded-2xl">
          Nenhuma partida encontrada para os filtros selecionados.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      )}
    </div>
  );
}