import { readFile } from "node:fs/promises";
import process from "node:process";

const BASE_URL = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const CASES_URL = new URL("./smoke.json", import.meta.url);

const normalize = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const cases = JSON.parse(await readFile(CASES_URL, "utf8"));
let failures = 0;

for (const testCase of cases) {
  const include = testCase.expect?.include ?? [];
  const exclude = testCase.expect?.exclude ?? [];

  let response;
  try {
    response = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: testCase.messages }),
    });
  } catch (error) {
    failures += 1;
    console.log(`FAIL ${testCase.id} erro de rede: ${error.message}`);
    continue;
  }

  const data = await response.json().catch(() => null);
  const text = data?.message?.content ?? "";
  const normalized = normalize(text);
  const missing = include.filter((needle) => !normalized.includes(normalize(needle)));
  const forbidden = exclude.filter((needle) => normalized.includes(normalize(needle)));
  const modelLabel = data?.model?.label;
  const ok =
    response.ok &&
    missing.length === 0 &&
    forbidden.length === 0 &&
    typeof modelLabel === "string";

  if (ok) {
    console.log(`PASS ${testCase.id} [${modelLabel}]`);
  } else {
    failures += 1;
    console.log(
      `FAIL ${testCase.id} [HTTP ${response.status}] modelo=${modelLabel ?? "ausente"}`,
    );
    if (!response.ok) console.log(`  erro: ${data?.error ?? "resposta não-JSON"}`);
    if (missing.length > 0) console.log(`  faltando: ${missing.join(", ")}`);
    if (forbidden.length > 0) console.log(`  proibido: ${forbidden.join(", ")}`);
  }

  await new Promise((resolve) => setTimeout(resolve, 400));
}

const passed = cases.length - failures;
console.log(`\n${passed}/${cases.length} casos passaram`);
process.exitCode = failures > 0 ? 1 : 0;
