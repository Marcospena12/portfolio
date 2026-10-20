// Parser de markdown leve para as respostas da Ciri.
//
// Subset de inline markdown, cobrindo o que modelos de chat realmente geram
// em respostas curtas: `*ênfase*`, `**negrito**`, `***negrito+ênfase***`,
// `__negrito__`, `_ênfase_`, `` `código` `` e links `[texto](url)`.
// Também aceita autolinks: `<https://…>`, URL crua e e-mail cru — assim links
// continuam clicáveis mesmo quando o modelo foge do formato markdown.
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
 * um `**`), underscores, links `[texto](url)` e, por fim, autolinks.
 *
 * Grupos: 1 code, 2 bold-italic, 3 bold, 4 italic, 5 bold-underscore,
 * 6 italic-underscore, 7 link-text, 8 link-href, 9 angle-href,
 * 10 raw-href, 11 email.
 *
 * Itálico de underscore usa limite de palavra no consumidor: `use_chat` ou
 * `snake_case` precisam sobreviver intactos (regra markdown de não-intraword).
 */
const INLINE_RE =
  /`([^`]+)`|\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*([^*]+)\*(?!\*)|__(.+?)__|_([^_]+)_|\[([^\]]+)\]\(([^)\s]+)\)|<((?:https?:\/\/|mailto:)[^>\s]+)>|(https?:\/\/[^\s<]+)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/;

/** Apenas http(s), mailto e âncora local viram `<a>` — bloqueia `javascript:`. */
const SAFE_HREF = /^(https?:\/\/|mailto:|#)/i;

const IS_WORD_CHAR = /[A-Za-z0-9]/;

/** Pontuação de fim de frase que nunca pertence a uma URL. */
const TRAILING_URL_PUNCT = /[.,;:!?*"'”’>]+$/;

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

function countChar(value: string, char: string): number {
  let count = 0;
  for (const current of value) {
    if (current === char) count += 1;
  }
  return count;
}

/**
 * Remove a pontuação final que pertence à frase, não à URL.
 * Parênteses só saem quando estão desbalanceados — links da Wikipedia
 * (`.../Foo_(bar)`) continuam inteiros.
 */
function trimUrlEnd(url: string): string {
  let result = url.replace(TRAILING_URL_PUNCT, "");
  while (
    result.endsWith(")") &&
    countChar(result, "(") < countChar(result, ")")
  ) {
    result = result.slice(0, -1);
  }
  return result;
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
    let end = start + match[0].length;

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
    } else if (match[9] !== undefined) {
      const href = match[9];
      nodes.push({
        type: "link",
        href: SAFE_HREF.test(href) ? href : null,
        // `<mailto:a@b.com>` exibe só o endereço, sem o prefixo.
        children: [href.replace(/^mailto:/i, "")],
      });
    } else if (match[10] !== undefined) {
      const display = trimUrlEnd(match[10]);
      // A pontuação "sobra" para o texto ao redor, não entra no link.
      end = start + display.length;
      nodes.push({
        type: "link",
        href: SAFE_HREF.test(display) ? display : null,
        children: [display],
      });
    } else if (match[11] !== undefined) {
      nodes.push({
        type: "link",
        href: `mailto:${match[11]}`,
        children: [match[11]],
      });
    }

    pos = end;
  }

  return nodes;
}
