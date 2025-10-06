// src/pages/Partidas.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function Partidas() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("todas"); // todas | ao-vivo | encerrado | agendado

  // Dados mock locais para evitar que a página quebre por causa de fetch
  const partidas = useMemo(
    () => [
      { id: 1, casa: "Corinthians", fora: "Grêmio", placar: "2 : 1", status: "encerrado", data: "10/10 16:00" },
      { id: 2, casa: "Flamengo", fora: "Palmeiras", placar: "0 : 0", status: "ao-vivo", data: "10/10 18:00" },
      { id: 3, casa: "São Paulo", fora: "Santos", placar: "- : -", status: "agendado", data: "12/10 20:00" },
      { id: 4, casa: "Palmeiras", fora: "Grêmio", placar: "1 : 3", status: "encerrado", data: "08/10 19:00" },
    ],
    []
  );

  const filtradas = useMemo(() => {
    const texto = q.trim().toLowerCase();
    return partidas
      .filter(p => (status === "todas" ? true : p.status === status))
      .filter(p =>
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
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
              Partidas
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pesquise por time e filtre por status.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por time..."
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500"
            />
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

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg divide-y divide-gray-200 dark:divide-gray-700">
          {filtradas.length === 0 && (
            <div className="p-6 text-center text-gray-600 dark:text-gray-400">
              Nenhuma partida encontrada.
            </div>
          )}

          {filtradas.map((p) => (
            <div
              key={p.id}
              className="p-4 flex items-center gap-3 sm:gap-6"
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