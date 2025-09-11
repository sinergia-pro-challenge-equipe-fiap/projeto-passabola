import React from "react";

const fmtDate = (d) => new Date(d).toLocaleDateString();
const fmtTime = (d) => new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function MatchCard({ m, toggleFav, favTeams }) {
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
    </div>
  );
}