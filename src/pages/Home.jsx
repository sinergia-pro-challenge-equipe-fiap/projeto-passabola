// src/pages/Home.jsx
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

// Imagens
import ImgNav from "../assets/logonav.jpg";
import ImgTrend from "../assets/jogadora-tendencia.jpg";
import ImgTrend2 from "../assets/campeas.avif";

// Escudos
import Corinthians from "../assets/escudos/corinthians.jpg";
import Santos from "../assets/escudos/santos.webp";
import Flamengo from "../assets/escudos/flamengo.jpg";
import Palmeiras from "../assets/escudos/palmeiras.jpg";
import SaoPaulo from "../assets/escudos/saopaulo.png";
import Gremio from "../assets/escudos/gremio.jpg";

export default function Home() {
  const [filter, setFilter] = useState("Todos");
  const [trendIndex, setTrendIndex] = useState(0);
  const [formData, setFormData] = useState({ nome: "", email: "" });
  const [success, setSuccess] = useState(false);

  const tendencias = useMemo(
    () => [
      {
        img: ImgTrend,
        desc: "Destaque para a jogadora mais comentada da semana no cenário do futebol feminino.",
      },
      {
        img: ImgTrend2,
        desc: "Corinthians conquista o 7º título do Brasileirão Feminino.",
      },
    ],
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTrendIndex((prev) => (prev + 1) % tendencias.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [tendencias.length]);

  const timesFemininos = useMemo(
    () => [
      { name: "Corinthians", escudo: Corinthians, pontos: 30 },
      { name: "Santos", escudo: Santos, pontos: 28 },
      { name: "Flamengo", escudo: Flamengo, pontos: 25 },
      { name: "Palmeiras", escudo: Palmeiras, pontos: 27 },
      { name: "São Paulo", escudo: SaoPaulo, pontos: 22 },
      { name: "Grêmio", escudo: Gremio, pontos: 20 },
    ],
    []
  );

  const jogosAoVivo = useMemo(
    () => [
      { team1: "Corinthians", team2: "Grêmio", score: "2 : 1" },
      { team1: "Flamengo", team2: "Palmeiras", score: "0 : 0" },
      { team1: "São Paulo", team2: "Santos", score: "1 : 3" },
    ],
    []
  );

  const ultimosJogos = useMemo(
    () => [
      { team1: "Corinthians", team2: "Palmeiras", score: "3:2", loc: "São Paulo" },
      { team1: "Santos", team2: "Flamengo", score: "1:1", loc: "Rio de Janeiro" },
      { team1: "Grêmio", team2: "São Paulo", score: "0:2", loc: "Porto Alegre" },
    ],
    []
  );

  const proximosJogos = useMemo(
    () => [
      { team1: "Corinthians", team2: "Flamengo", date: "20/10 16:00" },
      { team1: "Santos", team2: "Palmeiras", date: "21/10 18:00" },
      { team1: "São Paulo", team2: "Grêmio", date: "22/10 20:00" },
    ],
    []
  );

  const melhoresJogadoras = useMemo(
    () => [
      { name: "Alexia", gols: 20 },
      { name: "Bia", gols: 18 },
      { name: "Carla", gols: 15 },
      { name: "Daniela", gols: 14 },
      { name: "Elisa", gols: 12 },
    ],
    []
  );

  const getEscudo = (time) => {
    const t = timesFemininos.find((x) => x.name === time);
    return t ? t.escudo : "";
  };

  const filteredJogos =
    filter === "Todos"
      ? ultimosJogos
      : ultimosJogos.filter((j) => j.team1 === filter || j.team2 === filter);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const okEmail = /\S+@\S+\.\S+/.test(formData.email);
    if (!formData.nome || !okEmail) {
      alert("Preencha um nome e e-mail válidos.");
      return;
    }
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) throw new Error(data.error || "Falha ao enviar.");
      setSuccess(true);
      setFormData({ nome: "", email: "" });
    } catch (err) {
      console.error(err);
      alert("Não foi possível concluir sua inscrição. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-8 bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* NAV MOBILE */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg px-6 py-4 rounded-2xl flex items-center justify-between md:hidden sticky top-0 z-50"
      >
        <div className="flex items-center space-x-3">
          <img
            src={ImgNav}
            alt="Logo PassaBola"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-400"
          />
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            PassaBola
          </h1>
        </div>
      </motion.div>

      <main className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-6 lg:px-12">
        {/* COLUNA ESQUERDA */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="space-y-8 lg:col-span-1"
        >
          {/* Jogos ao vivo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5"
          >
            <h3 className="font-bold text-xl mb-3 text-purple-600 dark:text-purple-400">
              ⚽ Jogos ao Vivo
            </h3>
            {jogosAoVivo.map((j, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-xl mb-2"
              >
                <div className="flex items-center space-x-2 w-1/3">
                  <img src={getEscudo(j.team1)} alt={j.team1} className="w-7 h-7 rounded-full" />
                  <span className="font-medium dark:text-gray-200 truncate">{j.team1}</span>
                </div>

                <div className="w-1/3 flex justify-center">
                  <span className="font-bold text-pink-600 dark:text-pink-400 text-center">{j.score}</span>
                </div>

                <div className="flex items-center space-x-2 w-1/3 justify-end">
                  <span className="font-medium dark:text-gray-200 truncate">{j.team2}</span>
                  <img src={getEscudo(j.team2)} alt={j.team2} className="w-7 h-7 rounded-full" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Artilheiras */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5"
          >
            <h3 className="font-bold text-xl mb-4 text-purple-600 dark:text-purple-400">
              🌟 Artilheiras
            </h3>
            {melhoresJogadoras.map((j, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-xl mb-2"
              >
                <span className="font-medium dark:text-gray-200">{j.name}</span>
                <span className="font-bold text-pink-600 dark:text-pink-400">{j.gols} gols</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* COLUNA CENTRAL */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Newsletter */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-purple-700 to-pink-700 rounded-3xl shadow-2xl p-8 text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">📧 Assine nossa Newsletter</h2>
            <p className="mb-5 text-lg">
              Receba as últimas novidades, estatísticas e tendências do futebol feminino.
            </p>
            {success ? (
              <p className="font-bold text-green-200">✅ Inscrição realizada com sucesso!</p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col md:flex-row gap-3 justify-center"
              >
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  className="px-4 py-2 rounded-xl text-white w-full md:w-1/3 border border-white placeholder-gray-300 bg-transparent"
                />
                <input
                  type="email"
                  placeholder="Seu email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="px-4 py-2 rounded-xl text-white w-full md:w-1/3 border border-white placeholder-gray-300 bg-transparent"
                />
                <button
                  type="submit"
                  className="bg-white text-purple-600 font-bold px-6 py-2 rounded-xl shadow-lg hover:opacity-90 transition"
                >
                  Inscrever
                </button>
              </form>
            )}
          </motion.div>

          {/* Próximos Jogos */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5"
          >
            <h3 className="font-bold text-xl mb-4 text-purple-600 dark:text-purple-400">
              ⏱ Próximos Jogos
            </h3>
            {proximosJogos.map((j, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="grid grid-cols-3 items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-xl mb-2"
              >
                <div className="flex items-center space-x-2 justify-start">
                  <img src={getEscudo(j.team1)} alt={j.team1} className="w-7 h-7 rounded-full" />
                  <span className="font-medium dark:text-gray-200">{j.team1}</span>
                </div>

                <div className="flex justify-center">
                  <span className="font-bold text-pink-600 dark:text-pink-400">{j.date}</span>
                </div>

                <div className="flex items-center space-x-2 justify-end">
                  <span className="font-medium dark:text-gray-200">{j.team2}</span>
                  <img src={getEscudo(j.team2)} alt={j.team2} className="w-7 h-7 rounded-full" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Últimos Jogos */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5"
          >
            <h3 className="font-bold text-xl mb-3 text-purple-600 dark:text-purple-400">
              📅 Últimos Jogos
            </h3>

            {/* BOTÕES ATUALIZADOS */}
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={() => setFilter("Todos")}
                className={`px-3 py-1 rounded-xl font-medium transition ${
                  filter === "Todos"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                Todos
              </button>

              {timesFemininos.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setFilter(t.name)}
                  className={`px-3 py-1 rounded-xl font-medium transition ${
                    filter === t.name
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            {filteredJogos.map((j, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="flex items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-xl mb-2"
              >
                <div className="flex items-center space-x-2 w-1/3">
                  <img src={getEscudo(j.team1)} alt={j.team1} className="w-7 h-7 rounded-full" />
                  <span className="font-medium dark:text-gray-200 truncate">{j.team1}</span>
                </div>

                <div className="w-1/3 flex flex-col items-center">
                  <span className="font-bold text-pink-600 dark:text-pink-400 text-center">
                    {j.score}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{j.loc}</span>
                </div>

                <div className="flex items-center space-x-2 w-1/3 justify-end">
                  <span className="font-medium dark:text-gray-200 truncate">{j.team2}</span>
                  <img src={getEscudo(j.team2)} alt={j.team2} className="w-7 h-7 rounded-full" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* COLUNA DIREITA */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="space-y-8 lg:col-span-1"
        >
          {/* Tendência Agora */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 text-center"
          >
            <h3 className="font-bold text-xl mb-3 text-purple-600 dark:text-purple-400 ">
              🔥 Tendência Agora
            </h3>
            <motion.div
              key={trendIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              className="rounded-xl overflow-hidden shadow-lg"
            >
              <div className="p-2">
                <img
                  src={tendencias[trendIndex].img}
                  alt="Tendência"
                  className="w-full h-44 object-cover rounded-xl"
                />
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 px-3 text-center">
                  {tendencias[trendIndex].desc}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Ranking */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5"
          >
            <h3 className="font-bold text-xl mb-4 text-purple-600 dark:text-purple-400">
              🏆 Brasileirão Feminino
            </h3>
            {timesFemininos.map((t, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-xl mb-2 cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <img src={t.escudo} alt={t.name} className="w-7 h-7 rounded-full" />
                  <span className="font-medium dark:text-gray-200">{t.name}</span>
                </div>
                <span className="font-bold text-pink-600 dark:text-pink-400">
                  {t.pontos} pts
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}