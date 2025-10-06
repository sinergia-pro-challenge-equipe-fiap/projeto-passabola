// src/api/footballapi.js
import axios from "axios";

// 🔹 Configurações fixas da API
const API_KEY = "6417c10ac5e0230751f83c3f74ee11dd";
const API_BASE = "https://v3.football.api-sports.io";
const LEAGUE_ID = 74; // Brasileirão Feminino A1

/**
 * Busca partidas do Brasileirão Feminino A1 por temporada
 * @param {number} season - Temporada (ex: 2021, 2022, 2023)
 * @returns {Promise<Array>} - Lista de partidas adaptadas
 */
export const getBrasileiraoFemininoMatches = async (season = 2023) => {
  try {
    const url = `${API_BASE}/fixtures?league=${LEAGUE_ID}&season=${season}&timezone=America/Sao_Paulo`;

    console.log("📅 Buscando partidas da temporada:", season);
    console.log("🌐 URL chamada:", url);

    const response = await axios.get(url, {
      headers: { "x-apisports-key": API_KEY },
    });

    const matches = response.data.response || [];

    // 🔄 Adapta os dados para o front-end
    return matches.map((m) => {
      const statusMap = {
        LIVE: "ao-vivo",
        NS: "agendado",
        FT: "encerrado",
      };

      return {
        id: m.fixture.id,
        casa: m.teams.home.name,
        fora: m.teams.away.name,
        placar:
          m.goals.home !== null && m.goals.away !== null
            ? `${m.goals.home} : ${m.goals.away}`
            : "- : -",
        status: statusMap[m.fixture.status.short] || "todas",
        data: new Date(m.fixture.date).toLocaleString([], {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });
  } catch (error) {
    console.error("❌ Erro ao buscar partidas via API-Football:", error.response?.data || error.message);
    return [];
  }
};