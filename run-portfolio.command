#!/bin/zsh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT="3000"
URL="http://localhost:${PORT}"

cd "$SCRIPT_DIR"

if ! command -v npm >/dev/null 2>&1; then
  osascript -e 'display alert "npm을 찾을 수 없습니다." message "Node.js와 npm이 설치되어 있는지 확인해주세요." as critical'
  exit 1
fi

if [ ! -d "node_modules" ]; then
  osascript -e 'display dialog "의존성이 없어 npm install을 먼저 실행합니다." buttons {"확인"} default button "확인"'
  npm install
fi

if lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  open "$URL"
  exit 0
fi

osascript -e 'display notification "포트폴리오 서버를 실행합니다." with title "my_portfolio"'

open "$URL"
exec npm run dev
