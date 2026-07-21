#!/usr/bin/env bash
set -euo pipefail

ssh nuno@jaws bash -s <<'EOF'
set -euo pipefail
cd /var/www/nitida/

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/nitida

git pull

cd www
npm install
npm run build
EOF
