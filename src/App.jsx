import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import Home from "./pages/Home";
import Partidas from "./pages/Partidas";
import Estatisticas from "./pages/Estatisticas";

// Imagens (em src/assets)
import ImgBrand from "./assets/logonav.jpg";      // topo ESQUERDO
import ImgUser from "./assets/perfil-usuario.jpg";       // topo DIREITO

export default function App() {
  // tema (igual você já tinha)
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
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

  // navegação (sem router)
  const [page, setPage] = useState("home"); // "home" | "partidas" | "estatisticas"

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-500">
      {/* NAV */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg px-6 py-4 flex flex-col md:flex-row justify-between items-center transition-all duration-500 space-y-3 md:space-y-0">
        {/* ESQUERDA: logo + título (com imagem) */}
        <div className="flex items-center space-x-3">
          <img
            src={ImgBrand}
            alt="PassaBola"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-700"
          />
          <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-400">PassaBola</h1>
        </div>

        {/* LINKS */}
        <div className="flex items-center space-x-6 text-gray-700 dark:text-gray-200 font-semibold">
          <button
            onClick={() => setPage("home")}
            className={`hover:text-purple-600 dark:hover:text-purple-400 transition ${page==="home"?"text-purple-700 dark:text-purple-300":""}`}
          >
            Home
          </button>
          <button
            onClick={() => setPage("partidas")}
            className={`hover:text-purple-600 dark:hover:text-purple-400 transition ${page==="partidas"?"text-purple-700 dark:text-purple-300":""}`}
          >
            Partidas
          </button>
          <button
            onClick={() => setPage("estatisticas")}
            className={`hover:text-purple-600 dark:hover:text-purple-400 transition ${page==="estatisticas"?"text-purple-700 dark:text-purple-300":""}`}
          >
            Estatísticas
          </button>
          <span className="opacity-50">Inscrições</span>
        </div>

        {/* DIREITA: busca + tema + usuário (com imagem) */}
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

      {/* CONTEÚDO */}
      <main className="flex-1 p-6">
        {page === "home" ? <Home /> : page === "partidas" ? <Partidas /> : <Estatisticas />}
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