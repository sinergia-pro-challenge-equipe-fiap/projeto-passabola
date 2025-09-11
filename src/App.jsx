// src/App.jsx
import React, { useState, useEffect, useMemo } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

function App() {
  // ====== TEMA ======
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
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

  // ====== ABA ATUAL (Home | Partidas) — sem router ======
  const [page, setPage] = useState("home"); // "home" | "partidas"

  // ====== DADOS (os mesmos que você já usa) ======
  const timesFemininos = [
    { name: "Corinthians", escudo: "", pontos: 30 },
    { name: "Santos", escudo: "", pontos: 28 },
    { name: "Flamengo", escudo: "", pontos: 25 },
    { name: "Palmeiras", escudo: "", pontos: 27 },
    { name: "São Paulo", escudo: "", pontos: 22 },
    { name: "Grêmio", escudo: "", pontos: 20 },
  ];

  const jogosAoVivo = [
    { team1: "Corinthians", team2: "Santos", score: "2 : 1", escudo1: "", escudo2: "", posse: "55%", finalizacoes: "8-5" },
    { team1: "Flamengo", team2: "Palmeiras", score: "0 : 0", escudo1: "", escudo2: "", posse: "48%", finalizacoes: "3-4" },
    { team1: "São Paulo", team2: "Grêmio", score: "1 : 3", escudo1: "", escudo2: "", posse: "45%", finalizacoes: "5-9" },
  ];

  const ultimosJogos = [
    { team1: "Corinthians", team2: "Palmeiras", time: "19:00", loc: "São Paulo", escudo1: "", escudo2: "", score: "3:2", posse: "60%", finalizacoes: "10-6" },
    { team1: "Santos", team2: "Flamengo", time: "21:00", loc: "Rio de Janeiro", escudo1: "", escudo2: "", score: "1:1", posse: "52%", finalizacoes: "7-7" },
    { team1: "Grêmio", team2: "São Paulo", time: "18:00", loc: "Porto Alegre", escudo1: "", escudo2: "", score: "0:2", posse: "40%", finalizacoes: "4-8" },
  ];

  const proximosJogos = [
    { team1: "Palmeiras", team2: "Santos", time: "20:00", loc: "São Paulo", escudo1: "", escudo2: "" },
    { team1: "Corinthians", team2: "Flamengo", time: "21:00", loc: "Rio de Janeiro", escudo1: "", escudo2: "" },
  ];

  const melhoresJogadoras = [
    { name: "Alexia", gols: 20, img: "" },
    { name: "Bia", gols: 18, img: "" },
    { name: "Carla", gols: 15, img: "" },
    { name: "Daniela", gols: 14, img: "" },
    { name: "Elisa", gols: 12, img: "" },
  ];

  // ====== HOME: filtro que você já tinha ======
  const [filter, setFilter] = useState("Todos");
  const filteredJogos = filter === "Todos" ? ultimosJogos : ultimosJogos.filter(j => j.team1 === filter || j.team2 === filter);

  // ====== PARTIDAS: filtros locais da página ======
  const [tab, setTab] = useState("live"); // "live" | "upcoming" | "finished"
  const [q, setQ] = useState("");
  const [date, setDate] = useState("");
  const [league, setLeague] = useState("Todas");

  // mock de partidas para a página Partidas
  const partidas = [
    {
      id: 1, status: "live", league: "Brasileirão Fem.", round: "Rodada 14",
      team1: "Corinthians", team2: "Santos", city: "São Paulo",
      datetime: new Date(), score: "2 : 1",
      stats: { posse: "55%", finalizacoes: "8-5", escanteios: "4" },
    },
    {
      id: 2, status: "upcoming", league: "Copa do Brasil Fem.", round: "Quartas",
      team1: "Flamengo", team2: "Palmeiras", city: "Rio de Janeiro",
      datetime: new Date(Date.now() + 1000 * 60 * 60 * 3),
    },
    {
      id: 3, status: "finished", league: "Brasileirão Fem.", round: "Rodada 13",
      team1: "São Paulo", team2: "Grêmio", city: "Porto Alegre",
      datetime: new Date(Date.now() - 1000 * 60 * 60 * 24), score: "1 : 3",
      stats: { posse: "45%", finalizacoes: "5-9", escanteios: "2" },
    },
  ];
  const leagues = ["Brasileirão Fem.", "Copa do Brasil Fem.", "Amistoso"];

  const partidasFiltradas = useMemo(() => {
    return partidas
      .filter(p => p.status === tab)
      .filter(p => league === "Todas" ? true : p.league === league)
      .filter(p => {
        if (!q) return true;
        const t = q.toLowerCase();
        return p.team1.toLowerCase().includes(t) || p.team2.toLowerCase().includes(t) || (p.city?.toLowerCase().includes(t));
      })
      .filter(p => {
        if (!date) return true;
        const iso = new Date(p.datetime).toISOString().split("T")[0];
        return iso === date;
      });
  }, [partidas, tab, league, q, date]);

  // ====== COMPONENTE CARD (reutilizado em Partidas) ======
  const MatchCard = ({ match }) => {
    const { status, team1, team2, league, round, city, datetime, score, stats } = match;
    const badge =
      status === "live" ? "bg-red-500/10 text-red-400" :
      status === "upcoming" ? "bg-yellow-500/10 text-yellow-400" :
      "bg-emerald-500/10 text-emerald-400";
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow hover:shadow-xl transition border border-transparent hover:border-purple-500/20">
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 text-xs rounded-full ${badge}`}>
            {status === "live" ? "AO VIVO" : status === "upcoming" ? "EM BREVE" : "ENCERRADO"}
          </span>
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
                {new Date(datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
  };

  // ====== NAVBAR (troca de aba por estado) ======
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-500">
      <nav className="bg-white dark:bg-gray-800 shadow-lg px-6 py-4 flex flex-col md:flex-row justify-between items-center transition-all duration-500 space-y-3 md:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full" />
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
          <div className="w-10 h-10 bg-gray-400 rounded-full" />
        </div>
      </nav>

      {/* CONTEÚDO */}
      <main className="flex-1 p-6">
        {page === "home" ? (
          // ========================== HOME (igual a sua) ==========================
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
          // ========================== PARTIDAS ==========================
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Partidas</h2>
                <p className="text-gray-600 dark:text-gray-400">Acompanhe ao vivo, confira as próximas e veja os confrontos encerrados.</p>
              </div>

              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-full md:w-auto">
                {[
                  {key:"live",label:"Ao vivo"},
                  {key:"upcoming",label:"Próximas"},
                  {key:"finished",label:"Encerradas"},
                ].map(t => (
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

            {/* Lista de partidas */}
            {partidasFiltradas.length === 0 ? (
              <div className="text-center text-gray-600 dark:text-gray-400 py-16 bg-white dark:bg-gray-800 rounded-2xl">
                Nenhuma partida encontrada para os filtros selecionados.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {partidasFiltradas.map(m => <MatchCard key={m.id} match={m} />)}
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

export default App;