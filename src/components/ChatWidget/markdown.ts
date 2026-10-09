// Parser de markdown leve para as respostas da Ciri.
//
// Subset de inline markdown, cobrindo o que modelos de chat realmente geram
// em respostas curtas: `*ênfase*`, `**negrito**`, `***negrito+ênfase***`,
// `__negrito__`, `_ênfase_`, `` `código` `` e links `[texto](url)`.
// Sem block-level (listas/títulos) — o system prompt vede markdown pesado.
//
// Lógica pura (sem React) de propósito: o parser é testável com Node puro e
// o JSX fica só na camada fina do ChatMarkdown.tsx. A árvore é renderizada
// como elementos React reais, nunca como HTML crudo — seguro por construção.

/** Nó do AST inline: string = texto puro, objeto = nó formatado. */
export type MarkdownNode =
  | string
  | { type: "bold"; children: MarkdownNode[] }
  | { type: "italic"; children: MarkdownNode[] }
  | { type: "bold-italic"; children: MarkdownNode[] }
  | { type: "code"; content: string }
  | { type: "link"; href: string | null; children: MarkdownNode[] };

/**
 * Alternâncias na ordem que devem ser tentadas: código primeiro (trecho
 * atômico — asterisco dentro de `code` NÃO vira ênfase), depois
 * negrito+ênfase, negrito, ênfase (com `(?!\*)` para não fechar no meio de
 * um `**`), e por fim underscores e links.
 *
 * Itálico de underscore usa limite de palavra no consumidor: `use_chat` ou
 * `snake_case` precisam sobreviver intactos (regra markdown de não-intraword).
 */
const INLINE_RE =
  /`([^`]+)`|\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*([^*]+)\*(?!\*)|__(.+?)__|_([^_]+)_|\[([^\]]+)\]\(([^)\s]+)\)/;

/** Apenas http(s), mailto e âncora local viram `<a>` — bloqueia `javascript:`. */
const SAFE_HREF = /^(https?:\/\/|mailto:|#)/i;

const IS_WORD_CHAR = /[A-Za-z0-9]/;

/** Regra de não-intraword para underscore: o delimitador não pode encostar
 * em letra/número dos lados de fora. */
function hasWordBoundaries(text: string, start: number, end: number): boolean {
  const before = text[start - 1];
  const after = text[end];
  return (
    !(before && IS_WORD_CHAR.test(before)) && !(after && IS_WORD_CHAR.test(after))
  );
}

/** Regra de flancos do markdown: `*` só abre/fecha ênfase encostando no
 * conteúdo — sem espaço. Evita que "2 * 3 * 4" vire itálico. */
function hasTightFlanks(content: string): boolean {
  return !/^\s/.test(content) && !/\s$/.test(content);
}

/** Parseia uma linha (sem `\n`) em nós inline. */
export function parseInline(text: string): MarkdownNode[] {
  const nodes: MarkdownNode[] = [];
  let pos = 0;

  while (pos < text.length) {
    const rest = text.slice(pos);
    const match = INLINE_RE.exec(rest);
    if (!match) {
      nodes.push(rest);
      break;
    }

    const start = pos + match.index;
    const end = start + match[0].length;

    // Underscore intraword: trata o delimitador como texto literal e segue.
    const isUnderscore = match[5] !== undefined || match[6] !== undefined;
    if (isUnderscore && !hasWordBoundaries(text, start, end)) {
      nodes.push(text.slice(pos, start + 1));
      pos = start + 1;
      continue;
    }

    // Asterisco com espaço junto não é ênfase ("2 * 3 * 4").
    const starContent = match[2] ?? match[3] ?? match[4];
    if (starContent !== undefined && !hasTightFlanks(starContent)) {
      nodes.push(text.slice(pos, start + 1));
      pos = start + 1;
      continue;
    }

    if (start > pos) nodes.push(text.slice(pos, start));

    if (match[1] !== undefined) {
      // Código é atômico: conteúdo vira texto puro, sem recursão.
      nodes.push({ type: "code", content: match[1] });
    } else if (match[2] !== undefined) {
      nodes.push({
        type: "bold-italic",
        children: parseInline(match[2]),
      });
    } else if (match[3] !== undefined) {
      nodes.push({ type: "bold", children: parseInline(match[3]) });
    } else if (match[4] !== undefined) {
      nodes.push({ type: "italic", children: parseInline(match[4]) });
    } else if (match[5] !== undefined) {
      nodes.push({ type: "bold", children: parseInline(match[5]) });
    } else if (match[6] !== undefined) {
      nodes.push({ type: "italic", children: parseInline(match[6]) });
    } else if (match[7] !== undefined && match[8] !== undefined) {
      nodes.push({
        type: "link",
        // Href suspeito: mantém o texto visível mas deslinka.
        href: SAFE_HREF.test(match[8]) ? match[8] : null,
        children: parseInline(match[7]),
      });
    }

    pos = end;
  }

  return nodes;
}
