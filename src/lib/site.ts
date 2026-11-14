export const SITE = {
  name: "Refúgio",
  wordmark: "refúgio.",
  slogan: "Um lugar para sua alma descansar.",
  description:
    "Um espaço de fé, esperança e acolhimento. Um lugar para encontrar conforto nas Escrituras, conversar com Deus e fortalecer sua jornada espiritual.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "pt_BR",
  themeColor: "#668773",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
} as const;

/** Canais de ajuda humana no Brasil — exibidos em pontos sensíveis do app. */
export const HELP_LINES = [
  {
    name: "CVV — Centro de Valorização da Vida",
    phone: "188",
    description: "Apoio emocional gratuito, sigiloso, 24 horas, por telefone ou chat.",
    url: "https://cvv.org.br",
  },
  { name: "SAMU", phone: "192", description: "Emergências médicas.", url: null },
  { name: "Polícia Militar", phone: "190", description: "Situações de violência ou perigo imediato.", url: null },
  {
    name: "Central de Atendimento à Mulher",
    phone: "180",
    description: "Orientação e denúncia de violência contra a mulher, 24 horas.",
    url: null,
  },
] as const;
