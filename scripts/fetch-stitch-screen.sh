#!/usr/bin/env bash
# Download HTML + screenshot for a Stitch screen (requires API key).
# Docs: https://stitch.withgoogle.com/docs/mcp/setup/
# Key:  https://stitch.withgoogle.com/settings
#
# Usage:
#   export STITCH_API_KEY="your_key"
#   bash scripts/fetch-stitch-screen.sh [project_id] [screen_id] [out_dir]
#
# Example (TownScout — Sliding Auth Body):
#   bash scripts/fetch-stitch-screen.sh \
#     11194818934156009555 \
#     1e2ef61d68cf49659d631aa767713cf6 \
#     ./tmp/stitch-sliding-auth

set -euo pipefail

PROJECT_ID="${1:-11194818934156009555}"
SCREEN_ID="${2:-1e2ef61d68cf49659d631aa767713cf6}"
OUT_DIR="${3:-./tmp/stitch-screen}"

if [[ -z "${STITCH_API_KEY:-}" ]]; then
  echo "Set STITCH_API_KEY (see https://stitch.withgoogle.com/settings)" >&2
  exit 1
fi

MCP_URL="https://stitch.googleapis.com/mcp"
NAME="projects/${PROJECT_ID}/screens/${SCREEN_ID}"

mkdir -p "$OUT_DIR"

RESPONSE="$(mktemp)"
PAYLOAD="$(mktemp)"
trap 'rm -f "$RESPONSE" "$PAYLOAD"' EXIT

# JSON-RPC 2.0 envelope (required by stitch.googleapis.com/mcp)
STITCH_MCP_NAME="$NAME" STITCH_MCP_PROJECT_ID="$PROJECT_ID" STITCH_MCP_SCREEN_ID="$SCREEN_ID" node >"$PAYLOAD" <<'NODE'
const name = process.env.STITCH_MCP_NAME;
const projectId = process.env.STITCH_MCP_PROJECT_ID;
const screenId = process.env.STITCH_MCP_SCREEN_ID;
console.log(
  JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "get_screen",
      arguments: { name, projectId, screenId },
    },
  }),
);
NODE

curl -sS -X POST "$MCP_URL" \
  -H "Content-Type: application/json" \
  -H "X-Goog-Api-Key: $STITCH_API_KEY" \
  -d @"$PAYLOAD" \
  -o "$RESPONSE"

cp "$RESPONSE" "$OUT_DIR/response.json"
echo "Wrote $OUT_DIR/response.json"

STITCH_JSON_PATH="$RESPONSE" STITCH_OUT_DIR="$OUT_DIR" node <<'NODE'
const fs = require("fs");
const { execSync } = require("child_process");
const p = process.env.STITCH_JSON_PATH;
const out = process.env.STITCH_OUT_DIR;
const raw = fs.readFileSync(p, "utf8");
let j;
try {
  j = JSON.parse(raw);
} catch {
  console.error("Invalid JSON from Stitch MCP:", raw.slice(0, 500));
  process.exit(1);
}
if (j.error) {
  console.error("MCP error:", j.error.code, j.error.message);
  process.exit(1);
}
const structured = j.result?.structuredContent;
function unwrap(x) {
  const inner = x?.result ?? x;
  const parts = inner?.content;
  if (Array.isArray(parts)) {
    for (const part of parts) {
      if (part?.type === "text" && typeof part.text === "string") {
        try {
          return JSON.parse(part.text);
        } catch {
          /* continue */
        }
      }
    }
  }
  const t = inner?.content?.[0]?.text;
  if (typeof t === "string") {
    try {
      return JSON.parse(t);
    } catch {
      /* fall through */
    }
  }
  return inner;
}
let r = unwrap(j);
if ((!r.htmlCode || !r.screenshot) && structured) {
  r = structured;
}
const htmlUrl = r.htmlCode?.downloadUrl;
const pngUrl = r.screenshot?.downloadUrl;
const status = r.screenMetadata?.status;
console.log("screenMetadata.status:", status || "(none)");
function grab(url, file) {
  if (!url) return;
  execSync(`curl -sSL ${JSON.stringify(url)} -o ${JSON.stringify(file)}`, {
    stdio: "inherit",
  });
  console.log("Wrote", file);
}
grab(htmlUrl, `${out}/screen.html`);
grab(pngUrl, `${out}/screen.png`);
NODE
