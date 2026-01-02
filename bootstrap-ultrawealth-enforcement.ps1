$ErrorActionPreference = "Stop"
Write-Host "▶ UltraWealth Enforcement Bootstrap starting…" -ForegroundColor Cyan

# ---- Compliance linters ----
$forbidden = @(
  "balance","net\\s*worth","portfolio","returns?","performance",
  "profit","yield","forecast","predict","recommend","advice","AI","outperform"
)

$lint = @"
import fs from 'fs';
import path from 'path';

const forbidden = ${($forbidden | ConvertTo-Json -Compress)};

function scan(dir: string) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) scan(p);
    else if (p.match(/\\.(ts|tsx|json)$/)) {
      const c = fs.readFileSync(p,'utf8');
      for (const x of forbidden) {
        if (new RegExp(x,'i').test(c)) {
          throw new Error(`❌ Compliance violation: ${x} in ${p}`);
        }
      }
    }
  }
}

scan(process.cwd());
console.log("✔ Compliance lint passed");
"@

New-Item -ItemType Directory -Force checks | Out-Null
Set-Content checks/lint-compliance.ts $lint -Encoding UTF8
Set-Content checks/lint-copy.ts $lint -Encoding UTF8
Set-Content checks/lint-data.ts $lint -Encoding UTF8

# ---- Governance guardrails ----
Set-Content governance/COMPLIANCE_GUARDRAILS.md @"
UltraWealth is a visibility-only client.
It MUST NEVER show balances, returns, forecasts, advice, or recommendations.
All authority resides in TuringOS.
Violations are release-blocking.
"@

Set-Content governance/UX_PRINCIPLES.md @"
Goals precede money.
Progress is directional, not monetary.
Decisions are shown, never inferred.
Blocks are respected.
"@

# ---- Dockerfile ----
if (!(Test-Path "./Dockerfile")) {
@"
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm","run","start"]
"@ | Set-Content Dockerfile -Encoding UTF8
}

Write-Host "✅ UltraWealth enforcement COMPLETE" -ForegroundColor Green
