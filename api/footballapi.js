import axios from "axios";

const API_KEY = "6417c10ac5e0230751f83c3f74ee11dd";
const API_BASE = "https://v3.football.api-sports.io";
const LEAGUE_ID = 74; // Brasileirão Feminino
const SEASON = 2025;   // temporada atual

export const getBrasileiraoFemininoMatches = async (date) => {
  try {
    let url = `${API_BASE}/fixtures?league=${LEAGUE_ID}&season=${SEASON}`;
    if (date) url += `&date=${date}`; // filtra por data, se fornecida

    const response = await axios.get(url, {
      headers: {
        "x-apisports-key": API_KEY,
      },
    });

    // retorna apenas o array de partidas
    return response.data.response || [];
  } catch (error) {
    console.error(
      "Erro ao buscar fixtures via API-Football:",
      error.response?.data || error.message
    );
    return []; // garante que a função nunca quebre a renderização
  }
};
