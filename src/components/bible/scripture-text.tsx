import { Fragment } from "react";
import { scriptureParts } from "@/lib/bible/format";

/**
 * Exibe um versículo da Bíblia Livre.
 * Trechos entre [colchetes] foram acrescentados pelos tradutores e aparecem em itálico,
 * como nas Bíblias impressas. Só a apresentação muda; as palavras continuam as mesmas.
 */
export function ScriptureText({ text }: { text: string }) {
  return (
    <>
      {scriptureParts(text).map((part, i) =>
        i % 2 === 1 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}
