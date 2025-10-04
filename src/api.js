import axios from 'axios';

// Substitua pela sua chave da API
const API_KEY = 'XUL2aA8Un7HeWATpGzSHX4wTTthiupt5iCk1z45S9nOV17ylHGJZOAusMM1o';

// ⚙️ Usa o proxy definido no vite.config.js
const sportsMonkAPI = axios.create({
  baseURL: '/api', // usa o proxy configurado no Vite
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});

export const getBrasileiraoFemininoMatches = async () => {
  try {
    const response = await sportsMonkAPI.get('/matches', {
      params: {
        competition: '1261', // ID da competição (Brasileirão Feminino)
        season: '2025',      // temporada desejada
      },
    });

    console.log('Resposta da API:', response.data);
    return response.data.data; // Ajuste conforme estrutura real da API
  } catch (error) {
    console.error('Erro ao buscar as partidas do Brasileirão Feminino:', error);
    throw error;
  }
};