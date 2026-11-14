/** Mensagens de acolhimento exibidas na página inicial (alternam a cada dia). */
export const WELCOME_MESSAGES = [
  "Às vezes, tudo o que precisamos é de um momento de silêncio para encontrar novamente a paz.",
  "Você não precisa carregar tudo sozinho. Reserve um momento e permita-se encontrar esperança.",
  "Não há pressa aqui. Respire fundo, leia devagar e deixe que a Palavra fale ao seu coração.",
  "Seja qual for o seu dia, há espaço para você aqui.",
] as const;

export function messageForDate(iso: string): string {
  const n = iso.split("-").reduce((acc, part) => acc + Number(part), 0);
  return WELCOME_MESSAGES[n % WELCOME_MESSAGES.length]!;
}
