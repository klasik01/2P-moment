#!/usr/bin/env bash
# ============================================================
# Deploy Firebase Rules (Firestore + Storage)
#
# Použití:
#   ./scripts/deploy-firebase-rules.sh <prostředí>
#
# Příklady:
#   ./scripts/deploy-firebase-rules.sh dev
#   ./scripts/deploy-firebase-rules.sh prod
#
# Předpoklady:
#   - firebase-tools nainstalované (npm i -g firebase-tools)
#   - jsi přihlášen přes `firebase login` nebo máš GOOGLE_APPLICATION_CREDENTIALS
#   - .firebaserc obsahuje aliasy "dev" a "prod"
# ============================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

VALID_ENVS=("dev" "prod")

if [[ $# -lt 1 ]]; then
  echo -e "${RED}Chyba: Musíš zadat prostředí.${NC}"
  echo ""
  echo "Použití: $0 <prostředí>"
  echo "Dostupná prostředí: ${VALID_ENVS[*]}"
  exit 1
fi

ENV="$1"

if [[ ! " ${VALID_ENVS[*]} " =~ " ${ENV} " ]]; then
  echo -e "${RED}Chyba: Neznámé prostředí '${ENV}'.${NC}"
  echo "Dostupná prostředí: ${VALID_ENVS[*]}"
  exit 1
fi

if ! command -v firebase &> /dev/null; then
  echo -e "${RED}Chyba: firebase-tools nejsou nainstalované.${NC}"
  echo "Nainstaluj: npm install -g firebase-tools"
  exit 1
fi

echo -e "${YELLOW}Přepínám na prostředí: ${ENV}${NC}"
firebase use "$ENV"

CURRENT_PROJECT=$(firebase use 2>/dev/null | grep -oP 'Active Project: \K.*' || true)
echo -e "Aktuální projekt: ${GREEN}${CURRENT_PROJECT:-neznámý}${NC}"
echo ""

if [[ "$ENV" == "prod" ]]; then
  echo -e "${RED}⚠  POZOR: Nasazuješ rules na PRODUKCI!${NC}"
  read -rp "Opravdu pokračovat? (y/N): " confirm
  if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo "Zrušeno."
    exit 0
  fi
  echo ""
fi

echo -e "${YELLOW}Nasazuji Firestore rules...${NC}"
firebase deploy --only firestore:rules
echo -e "${GREEN}✓ Firestore rules nasazeny.${NC}"
echo ""

echo -e "${YELLOW}Nasazuji Storage rules...${NC}"
firebase deploy --only storage
echo -e "${GREEN}✓ Storage rules nasazeny.${NC}"
echo ""

echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ Všechny rules nasazeny na: ${ENV}${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
