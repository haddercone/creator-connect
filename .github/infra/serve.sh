#!/usr/bin/env bash
# serve.sh — start Ollama bound to localhost only, pull the coding model, and
# build a custom agent tag with a large context window.
#
# SECURITY: Ollama has NO built-in authentication. Keep it bound to 127.0.0.1
# and let nginx (setup.sh) front it with HTTPS + an API-key header check.
# Never set OLLAMA_HOST=0.0.0.0 and expose 11434 directly to the internet.

set -euo pipefail

# Model tag to pull. Override via env, e.g. MODEL_TAG=qwen3:8b ./serve.sh
MODEL_TAG="${MODEL_TAG:-qwen3-coder:14b}"
AGENT_TAG="${AGENT_TAG:-junior-agent}"

if ! command -v ollama >/dev/null 2>&1; then
  echo "Ollama not installed. Install it first, e.g.:"
  echo "  curl -fsSL https://ollama.com/install.sh | sh"
  exit 1
fi

# Ensure Ollama is only reachable on loopback.
export OLLAMA_HOST="${OLLAMA_HOST:-127.0.0.1:11434}"

# Start the server if it is not already running.
if ! curl -fsS "http://${OLLAMA_HOST}/api/tags" >/dev/null 2>&1; then
  echo "Starting Ollama server on ${OLLAMA_HOST}..."
  nohup ollama serve >/var/log/ollama-agent.log 2>&1 &
  for _ in $(seq 1 30); do
    if curl -fsS "http://${OLLAMA_HOST}/api/tags" >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done
fi

# Pull the base model and build the agent tag.
echo "Pulling base model ${MODEL_TAG}..."
ollama pull "${MODEL_TAG}"

echo "Building agent tag ${AGENT_TAG}..."
sed "s/{{MODEL_TAG}}/${MODEL_TAG}/g" "$(dirname "$0")/Modelfile" > /tmp/junior-Modelfile
ollama create "${AGENT_TAG}" -f /tmp/junior-Modelfile

echo "Done. Agent model available as ${AGENT_TAG} on http://${OLLAMA_HOST}"
echo "Health check: curl http://${OLLAMA_HOST}/api/tags"
