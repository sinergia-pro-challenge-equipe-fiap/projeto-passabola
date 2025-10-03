import React from 'react'
import { FaWhatsapp, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
          {/* FOOTER */}
          <footer className="bg-white dark:bg-gray-800 mt-10 p-6 text-center rounded-t-2xl shadow-lg">
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-purple-600 dark:text-purple-400">Quem Somos</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl mx-auto mt-2">
                O PassaBola é uma plataforma dedicada a promover o futebol feminino, trazendo notícias,
                estatísticas e oportunidades para atletas mostrarem seu talento.
              </p>
            </div>
            <div className="flex justify-center space-x-6 mt-4 text-gray-600 dark:text-gray-300 text-2xl">
              <a href="https://www.whatsapp.com/channel/0029Vavm10347XeEyTTNi91i?fbclid=PAVERFWANMokxleHRuA2FlbQIxMQABp2eBokJXRM4B3jieREVMt63b0PbeyIQd1yQR3N_AiE1Z_PDldCnUFD2R5bm-_aem_bOGFwsQTpNFvZ7XLx280FA" className="hover:text-purple-600"><FaWhatsapp/></a>
              <a href="https://www.instagram.com/passaabola/" className="hover:text-purple-600"><FaInstagram/></a>
              <a href="https://www.tiktok.com/@passabola" className="hover:text-purple-600"><FaTiktok/></a>
              <a href="https://www.youtube.com/@passabola" className="hover:text-purple-600"><FaYoutube/></a>
            </div>
            <div className="text-center py-4 text-sm text-gray-600 dark:text-gray-400">
        © 2025 - Todos os direitos reservados | PassaBola
      </div>
          </footer>
    </div>
  )
}

export default Footer