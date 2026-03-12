// ─────────────────────────────────────────────────────────────────────────────
// Trade Master Pro — Estrutura completa do curso (37 aulas, 4 fases)
// ─────────────────────────────────────────────────────────────────────────────

export interface Aula {
  id: string
  slug: string
  titulo: string
  descricao: string
  duracao: string
  videoId: string | null   // Panda Video embed ID
  gratis: boolean          // true = preview liberado sem login
  ordem: number
}

export interface Modulo {
  id: string
  slug: string
  titulo: string
  descricao: string
  cor: string              // accent color do módulo
  icone: string            // emoji
  ordem: number
  aulas: Aula[]
}

export interface Fase {
  id: string
  numero: number
  titulo: string
  descricao: string
  modulos: Modulo[]
}

export const CURSO_SLUG = 'trade-master-pro'

export const CURSO_META = {
  titulo: 'Trade Master Pro',
  subtitulo: 'O método completo de análise e operação em criptomoedas',
  descricao:
    'Do contexto macro à execução precisa — aprenda o sistema TMP de 37 aulas com análise real do XRP em cada etapa.',
  totalAulas: 37,
  totalHoras: '18h',
  nivel: 'Intermediário — Avançado',
  atualizadoEm: '2026',
  thumbnail: '/curso/thumb-tmp.jpg',
}

export const FASES: Fase[] = [
  {
    id: 'fase-1',
    numero: 1,
    titulo: 'Inteligência de Mercado',
    descricao: 'Contexto macro, fontes, Fear & Greed, dominância BTC e dados on-chain.',
    modulos: [
      {
        id: 'mod-1',
        slug: 'fundamentos',
        titulo: 'Fundamentos do Trader Profissional',
        descricao: 'Mindset, pilares e ferramentas base.',
        cor: '#3d8fef',
        icone: '🧠',
        ordem: 1,
        aulas: [
          { id: 'a1',  slug: 'mindset',        titulo: 'Mindset do Trader Profissional', descricao: 'Os 5 princípios que separam traders profissionais de amadores.',          duracao: '22 min', videoId: null, gratis: true,  ordem: 1 },
          { id: 'a2',  slug: 'pilares',         titulo: 'Os 3 Pilares do Método TMP',     descricao: 'Contexto + Técnica + Decisão — a estrutura de toda análise.',             duracao: '18 min', videoId: null, gratis: true,  ordem: 2 },
          { id: 'a3',  slug: 'diario',          titulo: 'Diário de Trading',               descricao: 'Por que documentar é a ferramenta de evolução mais subestimada.',        duracao: '15 min', videoId: null, gratis: false, ordem: 3 },
        ],
      },
      {
        id: 'mod-2',
        slug: 'contexto-macro',
        titulo: 'Contexto Macro e Notícias',
        descricao: 'Leitura de mercado antes de abrir qualquer gráfico.',
        cor: '#f0a500',
        icone: '📰',
        ordem: 2,
        aulas: [
          { id: 'a4',  slug: 'noticias',        titulo: 'Classificando Notícias por Impacto',   descricao: 'Sistema SCN: Impacto, Timing, Fonte e Viés.',                        duracao: '20 min', videoId: null, gratis: false, ordem: 4 },
          { id: 'a5',  slug: 'fontes',          titulo: 'Fontes Confiáveis no Cripto',          descricao: 'Quais acompanhar, quais ignorar e como filtrar ruído.',               duracao: '16 min', videoId: null, gratis: false, ordem: 5 },
          { id: 'a6',  slug: 'exemplo-noticias', titulo: 'Análise de Notícias — Caso Real',     descricao: 'Aplicação do sistema SCN no cenário XRP 23/02/2026.',                duracao: '24 min', videoId: null, gratis: false, ordem: 6 },
        ],
      },
      {
        id: 'mod-3',
        slug: 'indicadores-macro',
        titulo: 'Indicadores Macro',
        descricao: 'Fear & Greed, dominância BTC e dados on-chain.',
        cor: '#00d68f',
        icone: '📊',
        ordem: 3,
        aulas: [
          { id: 'a7',  slug: 'fg',              titulo: 'Fear & Greed Index',          descricao: 'Como usar o índice de medo e ganância como indicador contrarian.',          duracao: '19 min', videoId: null, gratis: false, ordem: 7 },
          { id: 'a8',  slug: 'dominancia',      titulo: 'Dominância do Bitcoin',       descricao: 'BTC.D como radar de ciclos altcoin e rotação de capital.',                  duracao: '17 min', videoId: null, gratis: false, ordem: 8 },
          { id: 'a9',  slug: 'onchain',         titulo: 'Dados On-Chain Essenciais',   descricao: 'Whale alerts, fluxo de exchanges e indicadores de capitulação.',            duracao: '21 min', videoId: null, gratis: false, ordem: 9 },
        ],
      },
    ],
  },

  {
    id: 'fase-2',
    numero: 2,
    titulo: 'Análise Técnica',
    descricao: 'Estrutura de preço, indicadores e o sistema STMP completo.',
    modulos: [
      {
        id: 'mod-4',
        slug: 'analise-tecnica-base',
        titulo: 'Análise Técnica — Base',
        descricao: 'Estrutura, S/R, Fibonacci e padrões gráficos.',
        cor: '#00c4e8',
        icone: '📈',
        ordem: 4,
        aulas: [
          { id: 'a10', slug: 'estrutura',       titulo: 'Estrutura de Preço',          descricao: 'Uptrend, downtrend e range — a base de toda análise técnica.',              duracao: '23 min', videoId: null, gratis: false, ordem: 10 },
          { id: 'a11', slug: 'sr',              titulo: 'Suportes e Resistências',     descricao: 'Os 6 tipos, hierarquia de força e a Regra da Inversão.',                   duracao: '25 min', videoId: null, gratis: false, ordem: 11 },
          { id: 'a12', slug: 'fib',             titulo: 'Fibonacci',                   descricao: 'Retracement, extensão e a Golden Zone 61.8%.',                             duracao: '20 min', videoId: null, gratis: false, ordem: 12 },
          { id: 'a13', slug: 'padroes',         titulo: 'Padrões Gráficos',            descricao: 'Hammer, engolfo, doji, estrela da manhã e estrela cadente.',               duracao: '22 min', videoId: null, gratis: false, ordem: 13 },
        ],
      },
      {
        id: 'mod-5',
        slug: 'sistema-stmp',
        titulo: 'Sistema STMP',
        descricao: 'ADX, RSI, MACD, Ichimoku e processo de decisão.',
        cor: '#9c27b0',
        icone: '⚙️',
        ordem: 5,
        aulas: [
          { id: 'a14', slug: 'stmp-overview',   titulo: 'Visão Geral do Sistema STMP', descricao: 'Os 8 componentes, 5 filtros e o scorecard de 12 critérios.',               duracao: '28 min', videoId: null, gratis: false, ordem: 14 },
          { id: 'a15', slug: 'adx',             titulo: 'ADX — Força da Tendência',    descricao: 'Como usar o ADX para confirmar tendências e evitar ranges.',               duracao: '18 min', videoId: null, gratis: false, ordem: 15 },
          { id: 'a16', slug: 'rsi-macd',        titulo: 'RSI + MACD',                  descricao: 'Divergências, cruzamentos e sinais de reversão.',                          duracao: '24 min', videoId: null, gratis: false, ordem: 16 },
          { id: 'a17', slug: 'ichimoku',        titulo: 'Ichimoku — Os 5 Componentes', descricao: 'Nuvem, Tenkan, Kijun, Chikou e o Kumo Twist.',                             duracao: '30 min', videoId: null, gratis: false, ordem: 17 },
          { id: 'a18', slug: 'decisao',         titulo: 'Processo de Decisão',         descricao: 'Scorecard STMP, cálculo de R:R e registro da decisão.',                   duracao: '22 min', videoId: null, gratis: false, ordem: 18 },
        ],
      },
      {
        id: 'mod-6',
        slug: 'multi-timeframe',
        titulo: 'Multi-Timeframe (MTF)',
        descricao: 'Hierarquia Daily → 4H → 1H, protocolo e matriz.',
        cor: '#e8394a',
        icone: '🔭',
        ordem: 6,
        aulas: [
          { id: 'a19', slug: 'mtf',             titulo: 'Análise Multi-Timeframe',       descricao: 'Hierarquia Daily/4H/1H e os 6 cenários de alinhamento.',                 duracao: '26 min', videoId: null, gratis: false, ordem: 19 },
          { id: 'a20', slug: 'mtf-protocol',    titulo: 'Protocolo de 45 Minutos',       descricao: '3 fases: Contexto (20min) + Técnica (15min) + Decisão (10min).',        duracao: '32 min', videoId: null, gratis: false, ordem: 20 },
          { id: 'a21', slug: 'mtf-matrix',      titulo: 'Matriz MTF',                    descricao: '7 dimensões × 3 timeframes — scorecard quantificado.',                   duracao: '28 min', videoId: null, gratis: false, ordem: 21 },
        ],
      },
    ],
  },

  {
    id: 'fase-3',
    numero: 3,
    titulo: 'Cenários e Probabilidades',
    descricao: 'Pensamento probabilístico, 3 cenários, filtros, entradas, stops e sizing.',
    modulos: [
      {
        id: 'mod-7',
        slug: 'probabilidade',
        titulo: 'Probabilidade e Cenários',
        descricao: 'Sistema de pontos, 3 cenários e cálculo de probabilidade.',
        cor: '#00d68f',
        icone: '🎲',
        ordem: 7,
        aulas: [
          { id: 'a22', slug: 'probabilidade',   titulo: 'Pensamento Probabilístico',    descricao: 'Expectativa matemática, lei dos grandes números e gestão de risco.',      duracao: '24 min', videoId: null, gratis: false, ordem: 22 },
          { id: 'a23', slug: 'cenarios',        titulo: 'Framework dos 3 Cenários',     descricao: 'C1 Bullish / C2 Neutro / C3 Bearish com gatilhos e planos de ação.',    duracao: '26 min', videoId: null, gratis: false, ordem: 23 },
          { id: 'a24', slug: 'calc-prob',       titulo: 'Calculando Probabilidades',    descricao: 'Sistema de pontos: evidências → probabilidade quantificada.',            duracao: '22 min', videoId: null, gratis: false, ordem: 24 },
          { id: 'a25', slug: 'cenarios-xrp',    titulo: 'Cenários XRP — Caso Real',     descricao: 'Documento completo C1/C2/C3 para XRP 23/02/2026 com dados reais.',      duracao: '35 min', videoId: null, gratis: false, ordem: 25 },
        ],
      },
      {
        id: 'mod-8',
        slug: 'execucao',
        titulo: 'Execução',
        descricao: 'Filtros de qualidade, tipos de entrada e gestão de trade.',
        cor: '#f0a500',
        icone: '🎯',
        ordem: 8,
        aulas: [
          { id: 'a26', slug: 'filtros',         titulo: 'Os 7 Filtros de Qualidade',    descricao: 'F1 Macro / F2 Zona / F3 Tendência / F4 Momentum / F5 R:R / F6 Confirmação / F7 Capital.', duracao: '28 min', videoId: null, gratis: false, ordem: 26 },
          { id: 'a27', slug: 'entradas',        titulo: 'Os 4 Tipos de Entrada',        descricao: 'E1 Zona / E2 Confirmação / E3 Rompimento / E4 Reteste — quando usar cada um.', duracao: '24 min', videoId: null, gratis: false, ordem: 27 },
          { id: 'a28', slug: 'stop',            titulo: 'Stop Loss — Os 4 Métodos',     descricao: 'Stop Estrutural, ATR, Kijun-Sen e Trailing — gestão dinâmica.',         duracao: '22 min', videoId: null, gratis: false, ordem: 28 },
          { id: 'a29', slug: 'tp',              titulo: 'Take Profit Escalonado',       descricao: 'TP1 30% / TP2 50% / TP3 20% trailing — realizando lucros progressivamente.', duracao: '20 min', videoId: null, gratis: false, ordem: 29 },
          { id: 'a30', slug: 'sizing',          titulo: 'Position Sizing',              descricao: 'Fórmula de sizing, modificadores de contexto e regra dos 6%.',           duracao: '18 min', videoId: null, gratis: false, ordem: 30 },
        ],
      },
    ],
  },

  {
    id: 'fase-4',
    numero: 4,
    titulo: 'Psicologia e Rotina',
    descricao: 'Regras absolutas, emocional, plano B, rotina semanal e métricas.',
    modulos: [
      {
        id: 'mod-9',
        slug: 'disciplina',
        titulo: 'Disciplina e Psicologia',
        descricao: 'Regras, emoções e o protocolo pós-stop.',
        cor: '#3d8fef',
        icone: '🧘',
        ordem: 9,
        aulas: [
          { id: 'a31', slug: 'regras',          titulo: 'As 10 Regras Absolutas',       descricao: 'Nunca violadas — a base da consistência de longo prazo.',                duracao: '20 min', videoId: null, gratis: false, ordem: 31 },
          { id: 'a32', slug: 'emocional',       titulo: 'Gestão Emocional',             descricao: 'Os 5 inimigos: FOMO, Vingança, Overconfidence, Paralisia e Aversão.',   duracao: '26 min', videoId: null, gratis: false, ordem: 32 },
          { id: 'a33', slug: 'planob',          titulo: 'Plano B — Contingências',      descricao: 'Ações pré-definidas para quando o cenário principal falha.',             duracao: '18 min', videoId: null, gratis: false, ordem: 33 },
          { id: 'a34', slug: 'stop-hit',        titulo: 'Protocolo Pós-Stop',           descricao: 'Os 5 passos: aceitar, pausar, documentar, analisar e atualizar.',       duracao: '16 min', videoId: null, gratis: false, ordem: 34 },
        ],
      },
      {
        id: 'mod-10',
        slug: 'rotina-metricas',
        titulo: 'Rotina e Métricas',
        descricao: 'Rotina semanal, métricas de performance e jornada.',
        cor: '#00d68f',
        icone: '📅',
        ordem: 10,
        aulas: [
          { id: 'a35', slug: 'semanal',         titulo: 'Rotina Semanal Completa',      descricao: 'Dom (prep 60min) → Seg-Qui (execução) → Sex (revisão 30min).',           duracao: '22 min', videoId: null, gratis: false, ordem: 35 },
          { id: 'a36', slug: 'metricas',        titulo: 'As 8 Métricas Essenciais',     descricao: 'Win Rate, R:R, Expectativa, Profit Factor, Drawdown e mais.',            duracao: '20 min', videoId: null, gratis: false, ordem: 36 },
          { id: 'a37', slug: 'jornada',         titulo: 'Os Próximos 90 Dias',          descricao: 'Roadmap: Paper → Capital 25% → Capital Completo.',                       duracao: '25 min', videoId: null, gratis: false, ordem: 37 },
        ],
      },
    ],
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

export function getAllAulas(): Aula[] {
  return FASES.flatMap(f => f.modulos.flatMap(m => m.aulas))
}

export function getAulaBySlug(moduloSlug: string, aulaSlug: string) {
  for (const fase of FASES) {
    const modulo = fase.modulos.find(m => m.slug === moduloSlug)
    if (modulo) {
      const aula = modulo.aulas.find(a => a.slug === aulaSlug)
      if (aula) return { aula, modulo, fase }
    }
  }
  return null
}

export function getProximaAula(moduloSlug: string, aulaSlug: string) {
  const all = FASES.flatMap(f =>
    f.modulos.flatMap(m => m.aulas.map(a => ({ ...a, moduloSlug: m.slug })))
  )
  const idx = all.findIndex(a => a.moduloSlug === moduloSlug && a.slug === aulaSlug)
  return idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null
}

export function getAulaAnterior(moduloSlug: string, aulaSlug: string) {
  const all = FASES.flatMap(f =>
    f.modulos.flatMap(m => m.aulas.map(a => ({ ...a, moduloSlug: m.slug })))
  )
  const idx = all.findIndex(a => a.moduloSlug === moduloSlug && a.slug === aulaSlug)
  return idx > 0 ? all[idx - 1] : null
}
