# Padrão de Screenshots de Projetos

Este diretório armazena as capturas de tela das aplicações locais para exibição no portfólio.

## Estrutura de Pastas

```text
public/projects/
├── <id-do-projeto>/
│   ├── 01-nome-da-tela.webp
│   ├── 02-outra-tela.webp
│   └── ...
```

Exemplos:
- `public/projects/steamshotbridge/01-painel-principal.webp`
- `public/projects/free-games-hub/01-dashboard.webp`

## Recomendações

1. **Formato:** `.webp` (preferencial por tamanho e qualidade) ou `.png`.
2. **Proporção:** 16:9 (`1920x1080` ou `1280x720`) ou tamanho nativo da janela desktop/web.
3. **Privacidade:** Certifique-se de que não haja chaves de API, tokens, nomes de clientes reais ou dados pessoais/confidenciais nas capturas.

## Como Registrar no Portfólio

No arquivo `src/data/projects.ts`, dentro do projeto desejado:

```ts
details: {
  // ...
  screenshots: [
    {
      src: "/projects/<id-do-projeto>/01-nome-da-tela.webp",
      alt: {
        pt: "Descrição da tela em português",
        en: "Screen description in English",
      },
    },
  ],
}
```
