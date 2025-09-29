import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import Home from "./pages/Home";
import Partidas from "./pages/Partidas";
import Estatisticas from "./pages/Estatisticas";
import Inscricoes from "./pages/Inscricoes";
import QuemSomos from "./pages/QuemSomos";

// Imagens
import ImgBrand from "./assets/logonav.jpg";
import ImgUser from "./assets/perfil-usuario.jpg";

export default function App() {
  // Tema
  const [darkMode, setDarkMode] = useState(false);

  // Inicializa o tema
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Alterna tema
  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  // Página atual
  const [page, setPage] = useState("home"); // "home" | "partidas" | "estatisticas" | "inscricoes"

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-500">
      {/* NAV */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg px-6 py-4 flex flex-col md:flex-row justify-between items-center transition-all duration-500 space-y-3 md:space-y-0">
        {/* Esquerda: logo + título */}
        <div className="flex items-center space-x-3">
          <img
            src={ImgBrand}
            alt="PassaBola"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-700"
          />
          <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-400">
            PassaBola
          </h1>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-6 text-gray-700 dark:text-gray-200 font-semibold">
          <button
            onClick={() => setPage("home")}
            className={`hover:text-purple-600 dark:hover:text-purple-400 transition ${
              page === "home" ? "text-purple-700 dark:text-purple-300" : ""
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setPage("partidas")}
            className={`hover:text-purple-600 dark:hover:text-purple-400 transition ${
              page === "partidas" ? "text-purple-700 dark:text-purple-300" : ""
            }`}
          >
            Partidas
          </button>
          <button
            onClick={() => setPage("estatisticas")}
            className={`hover:text-purple-600 dark:hover:text-purple-400 transition ${
              page === "estatisticas" ? "text-purple-700 dark:text-purple-300" : ""
            }`}
          >
            Estatísticas
          </button>
          <button
            onClick={() => setPage("inscricoes")}
            className={`hover:text-purple-600 dark:hover:text-purple-400 transition ${
              page === "inscricoes" ? "text-purple-700 dark:text-purple-300" : ""
            }`}
          >
            Inscrições
          </button>
          <button
            onClick={() => setPage("quemsomos")}
            className={`hover:text-purple-600 dark:hover:text-purple-400 transition ${
              page === "quemsomos" ? "text-purple-700 dark:text-purple-300" : ""
            }`}
          >
            Quem somos?
          </button>
        </div>

        {/* Direita: busca + tema + usuário */}
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Pesquisar..."
            className="px-3 py-2 border rounded-md hidden md:block w-full md:w-56 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            aria-label="Alternar tema"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <span className="text-gray-600 dark:text-gray-200">Maria Silva</span>
          <img
            src={ImgUser}
            alt="Avatar de Maria Silva"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-700"
          />
        </div>
      </nav>

      {/* Conteúdo */}
      <main className="flex-1 p-6">
        {page === "home" && <Home />}
        {page === "partidas" && <Partidas />}
        {page === "estatisticas" && <Estatisticas />}
        {page === "inscricoes" && <Inscricoes />}
        {page === "quemsomos" && <QuemSomos />}
      </main>
    </div>
  );
}
