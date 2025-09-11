import React, { useState } from "react";

export default function Home() {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* ESQUERDA */}
      <div className="space-y-6 lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
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
  );
}