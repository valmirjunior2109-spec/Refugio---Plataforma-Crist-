/** Ajusta espaços que a fonte deixa ao redor de palavras entre colchetes. */
export function tidyScripture(text: string): string {
  return text.replace(/-\s+\[/g, "-[").replace(/\]\s+([;,.:!?])/g, "]$1");
}

/**
 * Versão em texto simples (para copiar, compartilhar ou salvar):
 * remove os colchetes que marcam palavras acrescentadas pelos tradutores.
 */
export function plainScripture(text: string): string {
  return tidyScripture(text)
    .replace(/[[\]]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Divide o texto em trechos normais e trechos acrescentados (índices ímpares). */
export function scriptureParts(text: string): string[] {
  return tidyScripture(text).split(/\[([^\]]*)\]/);
}
