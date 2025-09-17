import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

export default function Inscricoes() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    idade: "",
    time: "Nenhum",
    posicao: "",
    tempoJogo: "",
    outrasInformacoes: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const timesFemininos = useMemo(
    () => [
      { name: "Corinthians" },
      { name: "Santos" },
      { name: "Flamengo" },
      { name: "Palmeiras" },
      { name: "São Paulo" },
      { name: "Grêmio" },
    ],
    []
  );

  const posicoes = [
    "Atacante",
    "Meio-campista",
    "Zagueira",
    "Goleira",
    "Lateral Direito",
    "Lateral Esquerdo",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    console.log("Inscrição realizada com sucesso!", formData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white px-4">
      <motion.main
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl p-8 space-y-8"
      >
        {isSubmitted ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center bg-green-600/70 text-white p-8 rounded-2xl shadow-lg"
          >
            <h3 className="text-3xl font-bold">🎉 Inscrição realizada!</h3>
            <p className="mt-3 text-lg">
              Obrigado por se inscrever no Desafio Semanal. Em breve, entraremos
              em contato!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-center text-purple-300">
              Inscreva-se agora
            </h3>
            <p className="text-center text-gray-300">
              Preencha os dados abaixo para participar do desafio ⚡
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div>
                <label htmlFor="nome" className="block text-sm font-semibold">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800/70 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="Digite seu nome"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800/70 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>

              {/* Idade */}
              <div>
                <label htmlFor="idade" className="block text-sm font-semibold">
                  Idade
                </label>
                <input
                  type="number"
                  id="idade"
                  name="idade"
                  value={formData.idade}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800/70 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="Digite sua idade"
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label htmlFor="time" className="block text-sm font-semibold">
                  Escolha seu Time
                </label>
                <select
                  value={formData.time}
                  onChange={handleChange}
                  name="time"
                  className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800/70 text-white focus:ring-2 focus:ring-purple-500 transition"
                >
                  <option value="Nenhum">Nenhum</option>
                  {timesFemininos.map((t, idx) => (
                    <option key={idx} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Posição */}
              <div>
                <label htmlFor="posicao" className="block text-sm font-semibold">
                  Posição
                </label>
                <select
                  value={formData.posicao}
                  onChange={handleChange}
                  name="posicao"
                  className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800/70 text-white focus:ring-2 focus:ring-purple-500 transition"
                  required
                >
                  <option value="">Escolha sua posição</option>
                  {posicoes.map((pos, idx) => (
                    <option key={idx} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tempo de jogo */}
              <div>
                <label
                  htmlFor="tempoJogo"
                  className="block text-sm font-semibold"
                >
                  Tempo de Jogo
                </label>
                <input
                  type="text"
                  id="tempoJogo"
                  name="tempoJogo"
                  value={formData.tempoJogo}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800/70 text-white focus:ring-2 focus:ring-purple-500 transition"
                  placeholder="Quanto tempo você joga?"
                />
              </div>

              {/* Outras informações */}
              <div>
                <label
                  htmlFor="outrasInformacoes"
                  className="block text-sm font-semibold"
                >
                  Outras Informações
                </label>
                <textarea
                  id="outrasInformacoes"
                  name="outrasInformacoes"
                  value={formData.outrasInformacoes}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800/70 text-white focus:ring-2 focus:ring-purple-500 transition"
                  placeholder="Adicione mais informações, se necessário"
                  rows="4"
                />
              </div>

              {/* Botão */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl shadow-md font-semibold text-lg hover:from-purple-700 hover:to-purple-800 transition"
              >
                Inscrever-se
              </motion.button>
            </form>
          </div>
        )}
      </motion.main>

      <Footer />
    </div>
  );
}
