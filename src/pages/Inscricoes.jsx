import React, { useState, useMemo } from "react";
import  { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Footer from "../components/Footer"

// IMAGENS (em src/assets)
import ImgNav from "../assets/logonav.jpg";
import ImgBanner from "../assets/copa-passabola.jpeg";

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

  const [isSubmitted, setIsSubmitted] = useState(false);  // Para controlar o estado de inscrição

  const timesFemininos = useMemo(() => ([
    { name: "Corinthians" },
    { name: "Santos" },
    { name: "Flamengo" },
    { name: "Palmeiras" },
    { name: "São Paulo" },
    { name: "Grêmio" },
  ]), []);

  const posicoes = [
    "Atacante", "Meio-campista", "Zagueira", "Goleira", "Lateral Direito", "Lateral Esquerdo"
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
    // Aqui você pode adicionar lógica para enviar os dados para um servidor ou API
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">

      <main className="w-full max-w-4xl p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg space-y-8">
        {/* Se inscrição for realizada */}
        {isSubmitted ? (
          <div className="text-center bg-green-500 text-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold">Inscrição realizada com sucesso!</h3>
            <p className="mt-2">Obrigado por se inscrever no Desafio Semanal. Em breve, entraremos em contato!</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center text-purple-700 dark:text-purple-400">Inscreva-se no Desafio Semanal</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Nome Completo</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Digite seu nome"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">E-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>

              <div>
                <label htmlFor="idade" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Idade</label>
                <input
                  type="number"
                  id="idade"
                  name="idade"
                  value={formData.idade}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Digite sua idade"
                  required
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Escolha seu Time</label>
                <select
                  value={formData.time}
                  onChange={handleChange}
                  name="time"
                  className="w-full p-3 rounded-md border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Nenhum">Nenhum</option>
                  {timesFemininos.map((t, idx) => (
                    <option key={idx} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="posicao" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Posição</label>
                <select
                  value={formData.posicao}
                  onChange={handleChange}
                  name="posicao"
                  className="w-full p-3 rounded-md border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Escolha sua posição</option>
                  {posicoes.map((pos, idx) => (
                    <option key={idx} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tempoJogo" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Tempo de Jogo</label>
                <input
                  type="text"
                  id="tempoJogo"
                  name="tempoJogo"
                  value={formData.tempoJogo}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Quanto tempo você joga?"
                />
              </div>

              <div>
                <label htmlFor="outrasInformacoes" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Outras Informações</label>
                <textarea
                  id="outrasInformacoes"
                  name="outrasInformacoes"
                  value={formData.outrasInformacoes}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Adicione mais informações, se necessário"
                  rows="4"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
              >
                Inscrever-se
              </button>
            </form>
          </div>
        )} 
      </main>
<Footer/>
    </div>
  );
}

