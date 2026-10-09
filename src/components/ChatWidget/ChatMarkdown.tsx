"use client";

import { Fragment, type ReactNode } from "react";
import { type MarkdownNode, parseInline } from "./markdown";

/**
 * Renderizador de markdown leve das respostas da Ciri.
 *
 * Recebe o texto cru da IA e devolve elementos React (`<strong>`, `<em>`,
 * `<code>`, `<a>`) a partir do AST de `markdown.ts` — sem
 * `dangerouslySetInnerHTML`, então não há superficie de XSS. Só respostas da
 * IA passam por aqui; mensagens do usuário, welcome e erro continuam texto
 * puro.
 */

function renderNodes(nodes: MarkdownNode[], keyPrefix: string): ReactNode[] {
  return nodes.map((node, index) => {
    // Strings (texto puro) não precisam de key — React só exige para elementos.
    if (typeof node === "string") return node;

    const key = `${keyPrefix}-${index}`;
    switch (node.type) {
      case "code":
        return (
          <code
            key={key}
            className="rounded bg-foreground/10 px-1 py-0.5 text-[0.85em]"
          >
            {node.content}
          </code>
        );
      case "bold":
        return <strong key={key}>{renderNodes(node.children, key)}</strong>;
      case "italic":
        return <em key={key}>{renderNodes(node.children, key)}</em>;
      case "bold-italic":
        return (
          <strong key={key}>
            <em>{renderNodes(node.children, key)}</em>
          </strong>
        );
      case "link":
        return node.href ? (
          <a
            key={key}
            href={node.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 decoration-foreground/30 hover:decoration-foreground/60"
          >
            {renderNodes(node.children, key)}
          </a>
        ) : (
          // Href bloqueado pelo parser: texto visível, mas sem link.
          <span key={key}>{renderNodes(node.children, key)}</span>
        );
    }
  });
}

export function ChatMarkdown({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, index) => (
        <Fragment key={index}>
          {index > 0 && <br />}
          {renderNodes(parseInline(line), `l${index}`)}
        </Fragment>
      ))}
    </>
  );
}
