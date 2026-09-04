#!/usr/bin/env bash
# setup.sh — provision the GPU box: install Ollama + nginx, lock things down,
# and front the Ollama API with HTTPS + an API-key header check.
#
# Run as root on a fresh Ubuntu/Debian GPU box. When it asks for the API key,
# reuse the same value you store as the OLLAMA_API_KEY GitHub secret.

set -euo pipefail

OLLAMA_API_KEY="${OLLAMA_API_KEY:-}"
if [ -z "${OLLAMA_API_KEY}" ]; then
  echo "Set OLLAMA_API_KEY to a long random value and re-run, e.g."
  echo '  export OLLAMA_API_KEY="$(openssl rand -hex 32)"'
  echo "Then re-run: sudo OLLAMA_API_KEY=$OLLAMA_API_KEY $0"
  exit 1
fi

echo "== Installing Ollama =="
curl -fsSL https://ollama.com/install.sh | sh

echo "== Installing nginx + apache2-utils =="
apt-get update -y
apt-get install -y nginx
systemctl enable nginx

echo "== Locking down firewall (only 80/443 open) =="
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "== Generating self-signed TLS cert (replace with Let's Encrypt for public use) =="
mkdir -p /etc/nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/ollama.key \
  -out /etc/nginx/ssl/ollama.crt \
  -subj "/CN=ollama" 2>/dev/null

echo "== Rendering nginx config with API key =="
sed "s/\${OLLAMA_API_KEY}/${OLLAMA_API_KEY}/g" "$(dirname "$0")/nginx.conf" > /etc/nginx/nginx.conf
nginx -t
systemctl reload nginx

echo "== Leaving a /root/serve-agent.sh convenience script =="
cat > /root/serve-agent.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
MODEL_TAG="${MODEL_TAG:-qwen3-coder:14b}"
export OLLAMA_HOST="127.0.0.1:11434"
nohup ollama serve >/var/log/ollama-agent.log 2>&1 &
sleep 3
ollama pull "${MODEL_TAG}"
sed "s/{{MODEL_TAG}}/${MODEL_TAG}/g" /root/Modelfile > /tmp/junior-Modelfile
ollama create junior-agent -f /tmp/junior-Modelfile
echo "Read endpoint: https://<box>/api/chat with Authorization: Bearer ${OLLAMA_API_KEY:0:6}..."
EOF
chmod +x /root/serve-agent.sh

echo "== Done =="
echo "Copy .github/infra/Modelfile to /root/Modelfile (or run .github/infra/serve.sh)."
echo "Confirm port 11434 is NOT exposed:"
ufw status
