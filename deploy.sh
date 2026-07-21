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
nvm use 22.14.0

npm install
npm run build
EOF
