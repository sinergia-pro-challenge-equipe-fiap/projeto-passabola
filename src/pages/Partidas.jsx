import React, { useMemo, useState, useEffect } from "react";
import MatchCard from "../components/MatchCard";
import Footer from "../components/Footer";
import { getBrasileiraoFemininoMatches } from "../api";

// Funções auxiliares para datas
const fmtDateISO = (d) => new Date(d).toISOString().split("T")[0];
const isSameISO = (a, b) => fmtDateISO(a) === b;
const getTime = (d) => new Date(d).getTime();

// Constantes de view (evita erro de digitação)
const VIEW_CARDS = "cards";
const VIEW_TABLE = "table";

export default function Partidas() {
  const [partidas, setPartidas] = useState([]);
  const [tab, setTab] = useState("live");
  const [q, setQ] = useState("");
  const [league, setLeague] = useState("Todas");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState("timeAsc");
  const [view, setView] = useState(VIEW_CARDS); // cards ou tabela
  const [onlyFav, setOnlyFav] = useState(false);
  const [pageSize, setPageSize] = useState(6);
  const [favTeams, setFavTeams] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favTeams") || "[]");
    } catch {
      return [];
    }
  });

  // Toggle de favoritos
  const toggleFav = (t) => {
    setFavTeams((prev) => {
      const s = new Set(prev);
      s.has(t) ? s.delete(t) : s.add(t);
      const arr = [...s];
      localStorage.setItem("favTeams", JSON.stringify(arr));
      return arr;
    });
  };

  // Fetch das partidas
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const matches = await getBrasileiraoFemininoMatches();
        setPartidas(matches);
      } catch (error) {
        console.error("Erro ao carregar as partidas:", error);
      }
    };
    fetchMatches();
  }, []);

  // Filtro + ordenação
  const filtered = useMemo(() => {
    let arr = partidas
      .filter((p) => p.status === tab)
      .filter((p) => (league === "Todas" ? true : p.league === league))
      .filter((p) => {
        if (!q) return true;
        const t = q.toLowerCase();
        return (
          p.team1.toLowerCase().includes(t) ||
          p.team2.toLowerCase().includes(t) ||
          p.city?.toLowerCase().includes(t)
        );
      })
      .filter((p) => (date ? isSameISO(p.datetime, date) : true))
      .filter((p) =>
        onlyFav ? favTeams.includes(p.team1) || favTeams.includes(p.team2) : true
      );

    // Ordenação
    arr.sort((a, b) => {
      if (sort === "timeAsc") return getTime(a.datetime) - getTime(b.datetime);
      if (sort === "timeDesc") return getTime(b.datetime) - getTime(a.datetime);
      if (sort === "league") return a.league.localeCompare(b.league);
      if (sort === "alpha")
        return (a.team1 + a.team2).localeCompare(b.team1 + b.team2);
      return 0;
    });

    return arr;
  }, [partidas, tab, league, q, date, onlyFav, favTeams, sort]);

  const visible = filtered.slice(0, pageSize);
  const hasMore = filtered.length > visible.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Título + tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Partidas
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe ao vivo, confira as próximas e veja os confrontos
            encerrados.
          </p>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-full lg:w-auto">
          {[
            { key: "live", label: "Ao vivo" },
            { key: "upcoming", label: "Próximas" },
            { key: "finished", label: "Encerradas" },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                setTab(t.key);
                setPageSize(6);
              }}
              className={`flex-1 lg:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition
                ${
                  tab === t.key
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros + toggle de visualização */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por time ou cidade..."
          className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white md:col-span-2"
        />
        <select
          value={league}
          onChange={(e) => setLeague(e.target.value)}
          className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option>Todas</option>
          {["Brasileirão Fem.", "Copa do Brasil Fem.", "Amistoso"].map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="timeAsc">Horário ↑</option>
          <option value="timeDesc">Horário ↓</option>
          <option value="league">Liga</option>
          <option value="alpha">A–Z</option>
        </select>
        <div className="flex items-center gap-2 justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={onlyFav}
              onChange={(e) => setOnlyFav(e.target.checked)}
            />
            Só favoritos
          </label>
        </div>

        {/* Toggle de Cards / Lista */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setView(VIEW_CARDS)}
            className={`px-3 py-1 rounded-lg text-sm font-semibold ${
              view === VIEW_CARDS
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            Cards
          </button>
          <button
            type="button"
            onClick={() => setView(VIEW_TABLE)}
            className={`px-3 py-1 rounded-lg text-sm font-semibold ${
              view === VIEW_TABLE
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            Lista
          </button>
        </div>
      </div>

      {/* Exibição de partidas */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 py-16 bg-white dark:bg-gray-800 rounded-2xl">
          Nenhuma partida encontrada para os filtros selecionados.
        </div>
      ) : view === VIEW_CARDS ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((m) => (
            <MatchCard
              key={m.id}
              m={m}
              toggleFav={toggleFav}
              favTeams={favTeams}
            />
          ))}
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
              {visible.map((m) => (
                <tr key={m.id} className="border-t dark:border-gray-700">
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        m.status === "live"
                          ? "bg-red-500/10 text-red-400 animate-pulse"
                          : m.status === "upcoming"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {m.status === "live"
                        ? "AO VIVO"
                        : m.status === "upcoming"
                        ? "EM BREVE"
                        : "ENCERRADO"}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-gray-800 dark:text-gray-100">
                    {m.team1} <span className="text-purple-500">vs</span>{" "}
                    {m.team2}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">
                    {m.league} • {m.round}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">
                    {m.city}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">
                    {new Date(m.datetime).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">
                    {new Date(m.datetime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Carregar mais */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setPageSize((s) => s + 6)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:opacity-90"
          >
            Carregar mais
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}