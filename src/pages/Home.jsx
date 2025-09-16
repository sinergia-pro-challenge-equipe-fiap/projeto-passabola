import React, { useMemo, useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Footer from "../components/Footer";

// IMAGENS (em src/assets)
import ImgNav from "../assets/logonav.jpg";
import ImgTrend from "../assets/jogadora-tendencia.jpg";
import ImgBanner from "../assets/copa-passabola.jpeg";

// Escudos (coloque arquivos ex: corinthians.jpg, flamengo.jpg etc em src/assets/escudos/)
import Corinthians from "../assets/escudos/corinthians.jpg";
import Santos from "../assets/escudos/santos.webp";
import Flamengo from "../assets/escudos/flamengo.jpg";
import Palmeiras from "../assets/escudos/palmeiras.jpg";
import SaoPaulo from "../assets/escudos/saopaulo.png";
import Gremio from "../assets/escudos/gremio.jpg";

export default function Home() {
  const [filter, setFilter] = useState("Todos");

  const timesFemininos = useMemo(() => ([
    { name: "Corinthians", escudo: Corinthians, pontos: 30 },
    { name: "Santos", escudo: Santos, pontos: 28 },
    { name: "Flamengo", escudo: Flamengo, pontos: 25 },
    { name: "Palmeiras", escudo: Palmeiras, pontos: 27 },
    { name: "São Paulo", escudo: SaoPaulo, pontos: 22 },
    { name: "Grêmio", escudo: Gremio, pontos: 20 },
  ]), []);

  const jogosAoVivo = useMemo(() => ([
    { team1: "Corinthians", team2: "Santos", score: "2 : 1" },
    { team1: "Flamengo", team2: "Palmeiras", score: "0 : 0" },
    { team1: "São Paulo", team2: "Grêmio", score: "1 : 3" },
  ]), []);

  const ultimosJogos = useMemo(() => ([
    { team1: "Corinthians", team2: "Palmeiras", score: "3:2", loc: "São Paulo" },
    { team1: "Santos", team2: "Flamengo", score: "1:1", loc: "Rio de Janeiro" },
    { team1: "Grêmio", team2: "São Paulo", score: "0:2", loc: "Porto Alegre" },
  ]), []);

  const melhoresJogadoras = useMemo(() => ([
    { name: "Alexia", gols: 20 },
    { name: "Bia", gols: 18 },
    { name: "Carla", gols: 15 },
    { name: "Daniela", gols: 14 },
    { name: "Elisa", gols: 12 },
  ]), []);

  const getEscudo = (time) => {
    const t = timesFemininos.find((x) => x.name === time);
    return t ? t.escudo : "";
  };

  const filteredJogos = filter === "Todos"
    ? ultimosJogos
    : ultimosJogos.filter(j => j.team1 === filter || j.team2 === filter);

  return (
    <div className="flex flex-col gap-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* NAV */}
      <div className="bg-white dark:bg-gray-800 shadow-lg px-6 py-4 rounded-2xl flex items-center justify-between md:hidden">
        <div className="flex items-center space-x-3">
          <img
            src={ImgNav}
            alt="Logo PassaBola"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-700"
          />
          <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-400">PassaBola</h1>
        </div>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* COLUNA ESQUERDA */}
        <div className="space-y-6 lg:col-span-1">
          {/* Jogos Ao Vivo */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
            <h3 className="font-bold text-lg mb-4 dark:text-white">Jogos Ao Vivo</h3>
            {jogosAoVivo.map((j, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b dark:border-gray-600 last:border-0">
                <div className="flex items-center space-x-2">
                  <img src={getEscudo(j.team1)} alt={j.team1} className="w-6 h-6 rounded-full" />
                  <span className="dark:text-gray-200">{j.team1}</span>
                </div>
                <span className="font-bold text-purple-600 dark:text-purple-400">{j.score}</span>
                <div className="flex items-center space-x-2">
                  <span className="dark:text-gray-200">{j.team2}</span>
                  <img src={getEscudo(j.team2)} alt={j.team2} className="w-6 h-6 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Melhores Jogadoras */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
            <h3 className="font-bold text-lg mb-3 dark:text-white">Melhores Jogadoras</h3>
            {melhoresJogadoras.map((p, idx) => (
              <div key={idx} className="flex justify-between items-center mb-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                <span className="dark:text-gray-200">{p.name}</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">{p.gols} ⚽</span>
              </div>
            ))}
          </div>
        </div>

        {/* COLUNA CENTRAL */}
        <div className="space-y-6 lg:col-span-2">
          {/* Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-xl">
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold">Desafio Semanal de Futebol Feminino</h2>
              <p className="mt-2 text-lg">Participe e mostre suas habilidades! Local: São Paulo • 7:00 PM</p>
              <a
                href="/inscricoes"
                className="mt-4 px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition inline-block"
              >
                Inscreva-se
              </a>
            </div>
            <div className="w-48 h-48 rounded-xl overflow-hidden ring-4 ring-white/30">
              <img src={ImgBanner} alt="Destaque do evento" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Últimos Jogos */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
            <h3 className="font-bold text-lg mb-4 dark:text-white">Últimos Jogos</h3>
            {filteredJogos.map((j, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-xl mb-3">
                <div className="flex items-center space-x-2">
                  <img src={getEscudo(j.team1)} alt={j.team1} className="w-6 h-6 rounded-full" />
                  <span className="dark:text-gray-200 font-medium">{j.team1}</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">{j.score}</span>
                  <span className="dark:text-gray-200">{j.team2}</span>
                  <img src={getEscudo(j.team2)} alt={j.team2} className="w-6 h-6 rounded-full" />
                </div>
                <span className="text-gray-600 dark:text-gray-300 mt-2 sm:mt-0">Local: {j.loc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div className="space-y-6 lg:col-span-1">
          {/* Ranking de Times */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
            <h3 className="font-bold text-lg mb-3 dark:text-white">Ranking de Times</h3>
            {timesFemininos.map((t, idx) => (
              <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded-lg mb-2">
                <div className="flex items-center space-x-2">
                  <img src={t.escudo} alt={t.name} className="w-6 h-6 rounded-full" />
                  <span className="dark:text-gray-200">{t.name}</span>
                </div>
                <span className="font-bold text-purple-600 dark:text-purple-400">{t.pontos} pts</span>
              </div>
            ))}
          </div>

          {/* Tendência Agora */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
            <h3 className="font-bold text-lg mb-3 dark:text-white">Tendência Agora</h3>
            <div className="rounded-xl overflow-hidden">
              <img src={ImgTrend} alt="Tendência do futebol feminino" className="w-full h-40 object-cover" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Destaque para a jogadora mais comentada da semana no cenário do futebol feminino.
            </p>
          </div>
        </div>
      </main>
<Footer/>
    </div>
  );
}