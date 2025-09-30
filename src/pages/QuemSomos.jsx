import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import Footer from "../components/Footer";

import Ale from "../assets/alee.jpg";
import Luana from "../assets/luana.webp";

export default function QuemSomos() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="flex-grow px-6 lg:px-20 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 space-y-8"
        >
          <h1 className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 mb-6 text-center">
            Quem Somos
          </h1>

          <p className="text-lg text-gray-700 dark:text-gray-300">
            O <span className="font-bold text-purple-600">PassaBola</span> nasceu com a missão de dar
            visibilidade e valorização ao futebol feminino no Brasil e no mundo. Nosso objetivo é
            transformar a forma como a modalidade é vista, mostrando sua força, talento e impacto
            social.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Mais do que um portal de notícias, o PassaBola é um{" "}
            <span className="font-semibold">espaço de comunidade</span>. Aqui, você encontra
            estatísticas em tempo real, calendário de jogos, rankings e análises, mas também tem a
            oportunidade de debater, aprender e se aproximar de outras pessoas apaixonadas pelo
            futebol feminino.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Nossa visão é criar uma rede forte que apoie jogadoras, clubes e torcedores, e que
            incentive as novas gerações a acreditarem no poder do esporte como ferramenta de
            transformação.
          </p>

          {/* Chamada Fundadoras */}
          <h2 className="text-3xl font-bold text-center text-purple-600 dark:text-purple-300 mt-12">
            As Criadoras do Projeto
          </h2>
          <p className="text-center text-gray-700 dark:text-gray-300 mb-8">
            Conheça as fundadoras que estão à frente dessa iniciativa e que trabalham para dar cada
            vez mais visibilidade ao futebol feminino.
          </p>

          {/* Fundadoras */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8 mt-6"
          >
            {/* Alê Xavier */}
            <div className="bg-purple-50 dark:bg-gray-700 rounded-2xl shadow-md p-6 text-center">
              <img
                src={Ale}
                alt="Alê Xavier"
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4 shadow-lg"
              />
              <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-300 mb-3">
                Alê Xavier
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Apresentadora, comentarista e influenciadora digital que ganhou destaque como a
                primeira mulher a integrar o canal Desimpedidos, referência em conteúdo esportivo no
                YouTube. Sua relação com o futebol começou ainda na infância, quando jogava e chegou
                a atuar profissionalmente, mas abandonou a carreira devido ao preconceito e à falta
                de investimento no esporte feminino. A partir dessa vivência, encontrou no
                jornalismo esportivo e nas mídias digitais um espaço para transformar sua paixão em
                trabalho, aproximando-se de uma nova geração de torcedores. Atualmente, comanda junto
                com Luana Maluf o canal Passa a Bola, criado em 2021, que discute futebol além das
                quatro linhas, dando visibilidade especial ao feminino. Alê também é apresentadora no
                Paramount+, produz conteúdos para redes sociais e se tornou uma voz importante em
                debates sobre diversidade, inclusão e igualdade no esporte. Além da carreira, vive um
                momento especial na vida pessoal: junto com a esposa Luana, anunciou recentemente a
                primeira gravidez do casal, fruto de fertilização in vitro.
              </p>
            </div>

            {/* Luana Maluf */}
            <div className="bg-purple-50 dark:bg-gray-700 rounded-2xl shadow-md p-6 text-center">
              <img
                src={Luana}
                alt="Luana Maluf"
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4 shadow-lg"
              />
              <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-300 mb-3">
                Luana Maluf
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Comentarista, apresentadora e criadora de conteúdo esportivo, formada em Relações
                Públicas e apaixonada por futebol desde a adolescência, quando chegou a criar blogs e
                espaços de opinião sobre o esporte. Torcedora do Palmeiras, iniciou sua trajetória na
                mídia com projetos independentes, como o “1×0 Feminino”, focado no futebol de
                mulheres, até conquistar espaço em veículos de peso como a ESPN, onde atuou como
                blogueira e colaboradora. Com experiência em agências e comunicação, consolidou-se
                como uma voz que alia conhecimento técnico a uma visão crítica sobre as desigualdades
                de gênero no esporte. Atualmente, é comentarista em transmissões esportivas no Prime
                Video, participa de programas como “Qual é o Gol” na Band e divide com Alê Xavier a
                apresentação do canal Passa a Bola, ampliando a discussão sobre futebol feminino e os
                bastidores do esporte. Sua trajetória reflete o esforço de abrir caminhos em um
                espaço historicamente machista, contribuindo para dar mais representatividade às
                mulheres no jornalismo esportivo.
              </p>
            </div>
          </motion.div>

          {/* Banner da comunidade no WhatsApp */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-green-500 text-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4 mt-10"
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
          <div className="flex justify-center gap-6 mt-8">
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
