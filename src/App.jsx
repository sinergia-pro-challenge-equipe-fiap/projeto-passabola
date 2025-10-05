// NENHUMA MUDANÇA NECESSÁRIA AQUI. SEU CÓDIGO ESTÁ PERFEITO.
import React, { useEffect, useState } from "react";
import { FaMoon, FaSun, FaDesktop } from "react-icons/fa";
import Home from "./pages/Home";
import Partidas from "./pages/Partidas";
import Estatisticas from "./pages/Estatisticas";
import QuemSomos from "./pages/QuemSomos";
import ImgBrand from "./assets/logonav.jpg";
import ImgUser from "./assets/perfil-usuario.jpg";

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "system");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [page, setPage] = useState("home");

  const isDarkMode =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (localStorage.getItem("theme") === "system") {
        if (e.matches) root.classList.add("dark");
        else root.classList.remove("dark");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, isDarkMode]);

  const ThemeIcon = () => {
    if (theme === "dark") return <FaMoon size={20} />;
    if (theme === "light") return <FaSun size={20} />;
    return <FaDesktop size={20} />;
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setIsDropdownOpen(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {/* NAVBAR */}
      <nav className="bg-white dark:bg-gray-900 shadow-lg px-6 py-4 flex flex-col md:flex-row justify-between items-center transition-colors duration-500 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <img
            src={ImgBrand}
            alt="PassaBola"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
          />
          <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            PassaBola
          </h1>
        </div>

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
            onClick={() => setPage("quemsomos")}
            className={`hover:text-purple-600 dark:hover:text-purple-400 transition ${
              page === "quemsomos" ? "text-purple-700 dark:text-purple-300" : ""
            }`}
          >
            Quem Somos?
          </button>
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Pesquisar..."
            className="px-3 py-2 border rounded-md hidden md:block w-full md:w-56 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 transition-colors"
          />
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition"
              aria-label="Selecionar tema"
            >
              <ThemeIcon />
            </button>
            {isDropdownOpen && (
              <div
                onMouseLeave={() => setIsDropdownOpen(false)}
                className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-lg shadow-xl py-1 z-50 border border-gray-200 dark:border-gray-700 transition-colors"
              >
                <button
                  onClick={() => handleThemeChange("light")}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FaSun /> Claro
                </button>
                <button
                  onClick={() => handleThemeChange("dark")}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FaMoon /> Escuro
                </button>
                <button
                  onClick={() => handleThemeChange("system")}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FaDesktop /> Sistema
                </button>
              </div>
            )}
          </div>

          <span className="text-gray-600 dark:text-gray-300 font-medium">Maria Silva</span>
          <img
            src={ImgUser}
            alt="Avatar de Maria Silva"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
          />
        </div>
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-6 transition-colors duration-500">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 transition-colors duration-500">
          {page === "home" && <Home isDarkMode={isDarkMode} />}
          {page === "partidas" && <Partidas isDarkMode={isDarkMode} />}
          {page === "estatisticas" && <Estatisticas isDarkMode={isDarkMode} />}
          {page === "quemsomos" && <QuemSomos isDarkMode={isDarkMode} />}
        </div>
      </main>
    </div>
  );
}