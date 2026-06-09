#!/bin/bash

echo "═══════════════════════════════════════════════════════════════"
echo "  🚀 DÉPLOIEMENT SYNCHRO ERP"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# 1. Variables
GITHUB_REPO="https://github.com/manawatech/synchro-erp.git"
NEON_DB_URL="${NEON_DATABASE_URL}"
NETLIFY_SITE="synchro-erp"

# 2. Git
echo "📦 1/4 - Préparation Git..."
if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "🚀 Synchro ERP v3.0 - Déploiement initial"
fi

# 3. Base de données Neon
echo "🗄️  2/4 - Configuration base de données..."
echo "ℹ️  Crée une base de données sur https://neon.tech"
echo "ℹ️  Puis ajoute l'URL dans les variables d'environnement Netlify"
echo ""
echo "   DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# 4. Build
echo "🔨 3/4 - Build du projet..."
npm run build

# 5. Déploiement Netlify
echo "📤 4/4 - Déploiement Netlify..."
echo ""
echo "ℹ️  Pour déployer manuellement :"
echo "   1. Va sur https://app.netlify.com"
echo "   2. Clique sur 'Add new site' → 'Import an existing project'"
echo "   3. Connecte ton GitHub"
echo "   4. Sélectionne le repo synchro-erp"
echo "   5. Configure :"
echo "      - Build command: npm run build"
echo "      - Publish directory: .next"
echo "   6. Ajoute les variables d'environnement :"
echo "      - DATABASE_URL"
echo "      - JWT_SECRET"
echo "   7. Clique sur 'Deploy site'"
echo ""
echo "  Ou utilise Netlify CLI :"
echo "   netlify login"
echo "   netlify init"
echo "   netlify deploy --prod"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "  ✅ PRÊT POUR LE DÉPLOIEMENT !"
echo "═══════════════════════════════════════════════════════════════"
