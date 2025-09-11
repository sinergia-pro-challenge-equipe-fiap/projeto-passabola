export const leagues = ["Brasileirão Fem.", "Copa do Brasil Fem.", "Amistoso"];

export const matches = [
  {
    id: 1,
    status: "live",
    league: "Brasileirão Fem.",
    round: "Rodada 14",
    team1: "Corinthians",
    team2: "Santos",
    city: "São Paulo",
    datetime: new Date(),
    score: "2 : 1",
    stats: { posse: "55%", finalizacoes: "8-5", escanteios: "4" },
  },
  {
    id: 2,
    status: "upcoming",
    league: "Copa do Brasil Fem.",
    round: "Quartas",
    team1: "Flamengo",
    team2: "Palmeiras",
    city: "Rio de Janeiro",
    datetime: new Date(Date.now() + 1000 * 60 * 60 * 3),
  },
  {
    id: 3,
    status: "finished",
    league: "Brasileirão Fem.",
    round: "Rodada 13",
    team1: "São Paulo",
    team2: "Grêmio",
    city: "Porto Alegre",
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    score: "1 : 3",
    stats: { posse: "45%", finalizacoes: "5-9", escanteios: "2" },
  },
];