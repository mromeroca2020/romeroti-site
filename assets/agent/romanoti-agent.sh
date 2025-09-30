#!/usr/bin/env bash
set -euo pipefail

API="${ROMANOTI_API:-https://romanoti-tools-api.onrender.com}"
KEY="${ROMANOTI_KEY:-dev}"
AGENT="${ROMANOTI_AGENT:-unnamed}"

HOSTNAME="$(hostname || true)"
PLATFORM="$(uname -a || true)"
LOCAL_IP="$(hostname -I 2>/dev/null | awk '{print $1}' || true)"
IFACES="$(ip -j addr 2>/dev/null || true)"
if [ -z "$IFACES" ]; then IFACES="$(ifconfig || true)"; fi
ARP_TABLE="$(arp -an 2>/dev/null || true)"

PAYLOAD=$(cat <<JSON
{
  "agent": "$AGENT",
  "hostname": "$HOSTNAME",
  "platform": "$PLATFORM",
  "local_ip": "$LOCAL_IP",
  "interfaces": $([ -n "$IFACES" ] && echo "$IFACES" || echo "null"),
  "arp": $(printf %s "$ARP_TABLE" | python3 -c 'import sys,json; print(json.dumps(sys.stdin.read()))')
}
JSON
)

curl -sS -X POST "$API/client/report" \
  -H "content-type: application/json" \
  -H "x-api-key: $KEY" \
  --data "$PAYLOAD"

echo "OK"

