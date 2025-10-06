// src/pages/Partidas.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { getBrasileiraoFemininoMatches } from "../../api/footballapi";

export default function Partidas() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("todas");
  const [season, setSeason] = useState(2023);
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Buscar partidas ao alterar a temporada
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const results = await getBrasileiraoFemininoMatches(season);
        setPartidas(results);
      } catch (error) {
        console.error("Erro ao carregar partidas:", error);
        setPartidas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [season]);

  // Filtragem por status e pesquisa
  const filtradas = useMemo(() => {
    const texto = q.trim().toLowerCase();
    return partidas
      .filter((p) => (status === "todas" ? true : p.status === status))
      .filter((p) =>
        texto
          ? p.casa.toLowerCase().includes(texto) ||
            p.fora.toLowerCase().includes(texto)
          : true
      );
  }, [partidas, q, status]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-6 lg:px-12 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Cabeçalho */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
              Partidas
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pesquise por time, filtre por status ou selecione uma temporada.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Busca por nome */}
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por time..."
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* Seleção de temporada */}
            <select
              value={season}
              onChange={(e) => setSeason(Number(e.target.value))}
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={2023}>Temporada 2023</option>
              <option value={2022}>Temporada 2022</option>
              <option value={2021}>Temporada 2021</option>
            </select>

            {/* Filtros de status */}
            <div className="flex gap-2">
              {[
                { key: "todas", label: "Todas" },
                { key: "ao-vivo", label: "Ao vivo" },
                { key: "encerrado", label: "Encerradas" },
                { key: "agendado", label: "Agendadas" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setStatus(f.key)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                    status === f.key
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Lista de partidas */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg divide-y divide-gray-200 dark:divide-gray-700">
          {loading && (
            <div className="p-6 text-center text-gray-600 dark:text-gray-400">
              Carregando partidas...
            </div>
          )}

          {!loading && filtradas.length === 0 && (
            <div className="p-6 text-center text-gray-600 dark:text-gray-400">
              Nenhuma partida encontrada para essa temporada ou filtros.
            </div>
          )}

          {!loading &&
            filtradas.map((p) => (
              <div
                key={p.id}
                className="p-4 flex items-center gap-3 sm:gap-6 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition"
              >
                <span
                  className={`text-xs px-2 py-1 rounded-lg font-semibold uppercase tracking-wide ${
                    p.status === "ao-vivo"
                      ? "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300"
                      : p.status === "encerrado"
                      ? "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                  }`}
                >
                  {p.status}
                </span>

                <div className="flex-1 grid grid-cols-3 items-center">
                  <div className="text-right pr-2 font-medium truncate">
                    {p.casa}
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-extrabold text-pink-600 dark:text-pink-400">
                      {p.placar}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {p.data}
                    </div>
                  </div>
                  <div className="text-left pl-2 font-medium truncate">
                    {p.fora}
                  </div>
                </div>
              </div>
            ))}
        </section>
      </motion.div>
    </div>
  );
}