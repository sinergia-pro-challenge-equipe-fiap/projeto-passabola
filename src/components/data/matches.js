// src/data/matches.js
// Gera uma lista grande de partidas a partir de alguns "seeds".
// Campos usados pela sua Partidas.jsx: id, status, league, round, team1, team2, city, datetime, score?, stats?

const cities = {
  CORINTHIANS: "São Paulo",
  PALMEIRAS: "São Paulo",
  SANTOS: "Santos",
  SAO_PAULO: "São Paulo",
  FLAMENGO: "Rio de Janeiro",
  FLUMINENSE: "Rio de Janeiro",
  BOTAFOGO: "Rio de Janeiro",
  GREMIO: "Porto Alegre",
  INTER: "Porto Alegre",
  CRUZEIRO: "Belo Horizonte",
  BAHIA: "Salvador",
  CEARA: "Fortaleza",
  FORTALEZA: "Fortaleza",
  VITORIA: "Salvador",
  ATHLETICO: "Curitiba",
  BOTAFOGO_SP: "Ribeirão Preto",
};

const L = {
  BR: "Brasileirão Fem.",
  COPA: "Copa do Brasil Fem.",
  AMI: "Amistoso",
};

const base = Date.now();

// helpers para criar partidas em diferentes estados
const live = (id, league, round, t1, t2, dtOffsetH, score = "0 : 0", stats = { posse: "50%", finalizacoes: "5-5", escanteios: "3" }) => ({
  id,
  status: "live",
  league,
  round,
  team1: t1,
  team2: t2,
  city: cities[t1] || "—",
  datetime: base + dtOffsetH * 3600 * 1000,
  score,
  stats,
});

const upcoming = (id, league, round, t1, t2, dtOffsetH) => ({
  id,
  status: "upcoming",
  league,
  round,
  team1: t1,
  team2: t2,
  city: cities[t1] || "—",
  datetime: base + dtOffsetH * 3600 * 1000,
});

const finished = (id, league, round, t1, t2, dtOffsetH, score = "1 : 1", stats = { posse: "52%", finalizacoes: "7-7", escanteios: "4" }) => ({
  id,
  status: "finished",
  league,
  round,
  team1: t1,
  team2: t2,
  city: cities[t1] || "—",
  datetime: base - Math.abs(dtOffsetH) * 3600 * 1000,
  score,
  stats,
});

// seeds (algumas ao vivo, próximas e encerradas)
const seeds = [
  live(1,  L.BR,   "Rodada 14", "CORINTHIANS", "SANTOS", 0,  "2 : 1", { posse: "55%", finalizacoes: "8-5", escanteios: "4" }),
  live(2,  L.COPA, "Quartas",   "FLUMINENSE",  "BOTAFOGO", 0, "1 : 0", { posse: "61%", finalizacoes: "7-3", escanteios: "5" }),
  upcoming(3,  L.BR,   "Rodada 15", "PALMEIRAS",  "SAO_PAULO",  3),
  upcoming(4,  L.AMI,  "—",         "FLAMENGO",   "GREMIO",    26),
  upcoming(5,  L.COPA, "Quartas",    "SANTOS",     "BOTAFOGO_SP", 50),
  finished(6,  L.BR,   "Rodada 13", "SAO_PAULO",  "GREMIO",    20, "1 : 3", { posse: "45%", finalizacoes: "5-9", escanteios: "2" }),
  finished(7,  L.AMI,  "—",         "CRUZEIRO",   "CORINTHIANS", 48, "1 : 1", { posse: "51%", finalizacoes: "6-6", escanteios: "3" }),
  finished(8,  L.COPA, "Oitavas",   "PALMEIRAS",  "FLAMENGO",   75, "0 : 2", { posse: "57%", finalizacoes: "9-7", escanteios: "7" }),
];

// pares extras para multiplicar jogos
const pairs = [
  ["BAHIA", "CEARA"],
  ["FORTALEZA", "VITORIA"],
  ["INTER", "ATHLETICO"],
  ["SANTOS", "FLUMINENSE"],
  ["PALMEIRAS", "BOTAFOGO"],
  ["CORINTHIANS", "GREMIO"],
  ["CRUZEIRO", "BAHIA"],
  ["FLAMENGO", "CEARA"],
];

// geramos muitos jogos por rodada/competição
let id = seeds.length + 1;
const extra = [];

// próximas 12 partidas (upcoming) distribuídas nas próximas 96h
for (let i = 0; i < 12; i++) {
  const [a, b] = pairs[i % pairs.length];
  extra.push(upcoming(id++, i % 3 ? L.BR : L.COPA, i % 3 ? `Rodada ${15 + (i % 5)}` : "Quartas", a, b, 4 + i * 4));
}

// 10 partidas ao vivo (live) com scores variados
for (let i = 0; i < 10; i++) {
  const [a, b] = pairs[(i + 2) % pairs.length];
  const s1 = (i % 3) + 0; // 0..2
  const s2 = (i % 2) + 0; // 0..1
  extra.push(live(id++, L.BR, `Rodada ${14 + (i % 3)}`, a, b, 0, `${s1} : ${s2}`, { posse: `${45 + (i % 10)}%`, finalizacoes: `${5 + i}-${4 + (i % 5)}`, escanteios: `${2 + (i % 4)}` }));
}

// 18 partidas encerradas (finished) nos últimos dias
for (let i = 0; i < 18; i++) {
  const [a, b] = pairs[(i + 4) % pairs.length];
  const s1 = (i % 4) + 0; // 0..3
  const s2 = (i % 3) + 0; // 0..2
  extra.push(finished(id++, i % 2 ? L.BR : L.AMI, i % 2 ? `Rodada ${10 + (i % 7)}` : "—", a, b, 8 + i * 6, `${s1} : ${s2}`, { posse: `${40 + (i % 30)}%`, finalizacoes: `${4 + (i % 8)}-${3 + (i % 7)}`, escanteios: `${1 + (i % 6)}` }));
}

export const matches = [...seeds, ...extra];