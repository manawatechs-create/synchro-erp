#!/bin/bash
echo "🔨 Build Synchro ERP pour Netlify..."

# Installer Prisma CLI globalement
echo "📦 Installation de Prisma CLI..."
npm install -g prisma

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
prisma generate

# Pousser le schéma vers Neon DB
echo "🗄️  Migration de la base de données..."
prisma db push --skip-generate

# Build Next.js
echo "🏗️  Build Next.js..."
next build

echo "✅ Build terminé !"
