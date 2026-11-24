#!/usr/bin/env bash
set -euo pipefail

ssh nuno@jaws bash -s <<'EOF'
set -euo pipefail
cd /var/www/nitida/

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/nitida

git pull

cd www
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
# Major only: jaws updates Node 22 patch releases, and an exact pin breaks the deploy
nvm use 22

npm install
npm run build
EOF
