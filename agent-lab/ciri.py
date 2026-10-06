#!/usr/bin/env python3
"""Ciri - painel de controle da agente (terminal REPL).

Fluxo:
  1. ORQUESTRADOR classifica a sua mensagem e devolve {"rota": "..."}.
  2. O SUBAGENTE correspondente responde com persona + rules + agente + knowledge.
  3. Historico salvo em data/session.json (memoria entre sessoes).

Providers (fallback em ordem): Groq -> OpenRouter -> Gemini.
Edite os prompts em brain/ e flow/agents/ e rode de novo - sem recompilar.
"""

import json
import re
import sys
from pathlib import Path

import requests

HERE = Path(__file__).resolve().parent

MODEL_GROQ = "meta-llama/llama-3.3-70b-versatile"
MODEL_OPENROUTER = "openrouter/free"
MODEL_GEMINI = "gemini-3.8-flash"
GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models"
SESSION = HERE / "data" / "session.json"

ROUTES = {
    "bio":      {"agent": "bio.md",      "knowledge": "bio.md"},
    "projetos": {"agent": "projetos.md", "knowledge": "projetos.md"},
    "contato":  {"agent": "contato.md",  "knowledge": "contato.md"},
    "tech":     {"agent": "tech.md",     "knowledge": "tech.md"},
    "geral":    {"agent": "geral.md",    "knowledge": None},
}


def load_env() -> dict:
    """Le agent-lab/.env primeiro, depois ../.env.local (chaves do site)."""
    env = {}
    for path in (HERE / ".env", HERE.parent / ".env.local"):
        if not path.is_file():
            continue
        for line in path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def read_md(rel: str) -> str:
    return (HERE / rel).read_text(encoding="utf-8").strip()


def shared_prefix() -> str:
    return read_md("brain/persona.md") + "\n\n" + read_md("brain/rules.md")


def call_openai(messages, base_url, key, model, max_tokens, extra_headers=None):
    resp = requests.post(
        f"{base_url}/chat/completions",
        headers={"Authorization": f"Bearer {key}", **(extra_headers or {})},
        json={"model": model, "messages": messages, "max_tokens": max_tokens},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"].strip()


def split_system(messages):
    system = "\n\n".join(m["content"] for m in messages if m["role"] == "system")
    rest = [m for m in messages if m["role"] != "system"]
    return system, rest


def call_gemini(messages, key, model, max_tokens):
    system, rest = split_system(messages)
    payload = {
        "contents": [
            {"role": "model" if m["role"] == "assistant" else "user", "parts": [{"text": m["content"]}]}
            for m in rest
        ]
    }
    if system:
        payload["systemInstruction"] = {"parts": [{"text": system}]}
    resp = requests.post(
        f"{GEMINI_ENDPOINT}/{model}:generateContent",
        params={"key": key},
        json=payload,
        timeout=30,
    )
    resp.raise_for_status()
    data = resp.json()
    return data["candidates"][0]["content"]["parts"][0]["text"].strip()


def chat(env, messages, max_tokens=420):
    fails = []
    if env.get("GROQ_API_KEY"):
        try:
            return call_openai(messages, "https://api.groq.com/openai/v1", env["GROQ_API_KEY"], MODEL_GROQ, max_tokens)
        except Exception as e:
            fails.append(f"groq: {e}")
            print(f"    ! groq falhou, tentando proximo provider... ({e})", file=sys.stderr)
    if env.get("OPENROUTER_API_KEY"):
        try:
            return call_openai(
                messages,
                "https://openrouter.ai/api/v1",
                env["OPENROUTER_API_KEY"],
                MODEL_OPENROUTER,
                max_tokens,
                extra_headers={
                    "HTTP-Referer": "https://github.com/Marcospena12",
                    "X-Title": "Ciri - agent-lab",
                },
            )
        except Exception as e:
            fails.append(f"openrouter: {e}")
            print(f"    ! openrouter falhou, tentando proximo provider... ({e})", file=sys.stderr)
    if env.get("GEMINI_API_KEY"):
        try:
            return call_gemini(messages, env["GEMINI_API_KEY"], MODEL_GEMINI, max_tokens)
        except Exception as e:
            fails.append(f"gemini: {e}")
    raise RuntimeError("nenhum provider respondeu: " + "; ".join(fails))


def parse_route(reply):
    match = re.search(r"\{.*\}", reply, re.S)
    if match:
        try:
            data = json.loads(match.group(0))
            rota = data.get("rota") or data.get("route")
            if rota in ROUTES:
                return rota
        except json.JSONDecodeError:
            pass
    print(f"    ! rota nao reconhecida ('{reply[:60]}...'), caindo em geral", file=sys.stderr)
    return "geral"


def route_message(env, history, user_msg):
    system = shared_prefix() + "\n\n" + read_md("brain/orchestrator.md")
    messages = [{"role": "system", "content": system}]
    messages += [{"role": m["role"], "content": m["content"]} for m in history[-6:]]
    messages.append({"role": "user", "content": user_msg})
    return parse_route(chat(env, messages, max_tokens=80))


def build_agent_system(rota):
    spec = ROUTES[rota]
    parts = [shared_prefix(), f"PAPEL ATUAL: responder como especialista da rota '{rota}'."]
    parts.append(read_md(f"flow/agents/{spec['agent']}"))
    if spec["knowledge"]:
        parts.append("# CONHECIMENTO DISPONIVEL\n\n" + read_md(f"knowledge/{spec['knowledge']}"))
    return "\n\n".join(parts)


def agent_reply(env, history, user_msg):
    rota = route_message(env, history[:-1], user_msg)
    spec = ROUTES[rota]
    print(
        f"[ciri] rota: {rota} -> flow/agents/{spec['agent']}"
        + (f" + knowledge/{spec['knowledge']}" if spec["knowledge"] else "")
    )
    system = build_agent_system(rota)
    messages = [{"role": "system", "content": system}]
    messages += [{"role": m["role"], "content": m["content"]} for m in history[-16:]]
    return chat(env, messages)


def load_history():
    if SESSION.is_file():
        try:
            return json.loads(SESSION.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return []
    return []


def save_history(history):
    SESSION.parent.mkdir(parents=True, exist_ok=True)
    SESSION.write_text(json.dumps(history, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> int:
    env = load_env()
    if not any(env.get(k) for k in ("GROQ_API_KEY", "OPENROUTER_API_KEY", "GEMINI_API_KEY")):
        print("Nenhuma chave de API configurada.")
        print("Crie agent-lab/.env com GROQ_API_KEY/OPENROUTER_API_KEY/GEMINI_API_KEY,")
        print("ou aproveite as chaves do site em ../.env.local.")
        return 1

    history = load_history()
    if history:
        print(f"Memoria: retomando sessao com {len(history)} mensagens (use \\reset para limpar).")
    print("Ciri pronta (Groq -> OpenRouter -> Gemini). Comandos: \\sair | \\reset")

    while True:
        try:
            user_msg = input("\nvoce> ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break
        if user_msg in ("\\sair", "\\quit", "\\exit"):
            break
        if user_msg == "\\reset":
            history.clear()
            save_history(history)
            print("Memoria apagada.")
            continue
        if not user_msg:
            continue

        history.append({"role": "user", "content": user_msg})
        try:
            reply = agent_reply(env, history, user_msg)
        except Exception as e:
            print(f"    ! erro ao gerar resposta: {e}")
            history.pop()
            continue

        history.append({"role": "assistant", "content": reply})
        if len(history) > 80:
            history = history[-80:]
        save_history(history)
        print(f"\nciri> {reply}")

    print("Ate mais!")
    return 0


if __name__ == "__main__":
    sys.exit(main())