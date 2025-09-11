import React from "react";

export default function MatchCard({ match }) {
  const {
    status,  // "live" | "upcoming" | "finished"
    team1, team2, league, datetime, city,
    score, stats, round
  } = match;

  const badge =
    status === "live" ? "bg-red-500/10 text-red-400"
    : status === "upcoming" ? "bg-yellow-500/10 text-yellow-400"
    : "bg-emerald-500/10 text-emerald-400";

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow hover:shadow-xl transition border border-transparent hover:border-purple-500/20">
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 text-xs rounded-full ${badge}`}>{status === "live" ? "AO VIVO" : status === "upcoming" ? "EM BREVE" : "ENCERRADO"}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{league} • {round}</span>
      </div>

      <div className="mt-3 grid grid-cols-3 items-center">
        <div className="flex flex-col">
          <span className="font-semibold dark:text-gray-100">{team1}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{city}</span>
        </div>

        <div className="text-center">
          {status === "upcoming" ? (
            <div className="inline-block px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold">
              {new Date(datetime).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
            </div>
          ) : (
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{score}</div>
          )}
          <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(datetime).toLocaleDateString()}</div>
        </div>

        <div className="flex flex-col items-end">
          <span className="font-semibold dark:text-gray-100">{team2}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{city}</span>
        </div>
      </div>

      {stats && (
        <div className="mt-3 grid grid-cols-3 text-sm text-gray-600 dark:text-gray-300 gap-2">
          <span>Posse: {stats.posse}</span>
          <span>Finalizações: {stats.finalizacoes}</span>
          <span>Escanteios: {stats.escanteios}</span>
        </div>
      )}
    </div>
  );
}