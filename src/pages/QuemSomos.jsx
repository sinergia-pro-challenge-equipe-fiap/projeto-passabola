import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import Footer from "../components/Footer";

export default function QuemSomos() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="flex-grow px-6 lg:px-20 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 space-y-6"
        >
          <h1 className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 mb-6 text-center">
            Quem Somos
          </h1>

          <p className="text-lg text-gray-700 dark:text-gray-300">
            O <span className="font-bold text-purple-600">PassaBola</span> nasceu com a missão de dar
            visibilidade e valorização ao futebol feminino no Brasil e no mundo.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Aqui, você encontra notícias, estatísticas em tempo real, calendário de jogos, rankings e
            um espaço para a comunidade debater e compartilhar a paixão pelo esporte.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Nossa equipe é formada por apaixonados por futebol feminino, trabalhando para
            fortalecer a modalidade e aproximar cada vez mais torcedores e jogadoras.
          </p>

          {/* Banner da comunidade no WhatsApp */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-green-500 text-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">💬 Junte-se à nossa Comunidade!</h2>
              <p>
                Participe do grupo oficial no WhatsApp e fique por dentro das últimas novidades do
                futebol feminino.
              </p>
            </div>
            <a
              href="https://chat.whatsapp.com/seu-link-aqui"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold shadow-md hover:opacity-90 transition flex items-center gap-2"
            >
              <FaWhatsapp /> Entrar no Grupo
            </a>
          </motion.div>

          {/* Redes sociais */}
          <div className="flex justify-center gap-6 mt-6">
            <a href="#" className="text-3xl text-blue-600 hover:opacity-80">
              <FaFacebook />
            </a>
            <a href="#" className="text-3xl text-pink-600 hover:opacity-80">
              <FaInstagram />
            </a>
            <a href="#" className="text-3xl text-sky-500 hover:opacity-80">
              <FaTwitter />
            </a>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
