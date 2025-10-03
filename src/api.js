import axios from 'axios';

// Substitua pela sua chave da API
const API_KEY = 'XUL2aA8Un7HeWATpGzSHX4wTTthiupt5iCk1z45S9nOV17ylHGJZOAusMM1o';

const sportsMonkAPI = axios.create({
  baseURL: 'https://api.sportmonks.com/v3',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
  },
});


export const getBrasileiraoFemininoMatches = async () => {
  try {
    const response = await sportsMonkAPI.get('/matches', {
      params: {
        competition: '1261', // Use o ID correto da competição
        season: '2025',
        team: 'Brasileirão Fem.',
      },
    });
    return response.data.data; // Ajuste conforme a resposta da API
  } catch (error) {
    console.error('Erro ao buscar as partidas do Brasileirão Feminino:', error);
    throw error;
  }
};