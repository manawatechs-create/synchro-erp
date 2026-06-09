#!/bin/bash

echo "🌱 Démarrage de la Coopérative Agricole"
echo "========================================"

# Vérifier PostgreSQL
echo "📊 Vérification de PostgreSQL..."
if sudo service postgresql status > /dev/null 2>&1; then
    echo "✅ PostgreSQL est en cours d'exécution"
else
    echo "🔄 Démarrage de PostgreSQL..."
    sudo service postgresql start
    sleep 2
fi

# Vérifier la connexion à la base de données
echo "🔍 Test de connexion à la base de données..."
if PGPASSWORD='Cooper2024!' psql -h localhost -U cooperadmin -d cooperative_agricole -c "SELECT 1" > /dev/null 2>&1; then
    echo "✅ Connexion à la base de données réussie"
else
    echo "❌ Erreur de connexion à la base de données"
    echo "Configuration de la base de données..."
    sudo -u postgres psql -c "CREATE USER cooperadmin WITH PASSWORD 'Cooper2024!';" 2>/dev/null
    sudo -u postgres psql -c "CREATE DATABASE cooperative_agricole OWNER cooperadmin;" 2>/dev/null
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cooperative_agricole TO cooperadmin;" 2>/dev/null
fi

# Mettre à jour la base de données
echo "🔄 Mise à jour du schéma de la base de données..."
npx prisma db push

# Générer le client Prisma
echo "📦 Génération du client Prisma..."
npx prisma generate

# Vérifier si les données existent
echo "🔍 Vérification des données..."
DATA_EXISTS=$(PGPASSWORD='Cooper2024!' psql -h localhost -U cooperadmin -d cooperative_agricole -t -c "SELECT COUNT(*) FROM \"Cooperative\";" 2>/dev/null)

if [ "$DATA_EXISTS" = "0" ] || [ -z "$DATA_EXISTS" ]; then
    echo "🌱 Première initialisation - Création des données de test..."
    npx tsx prisma/seed.ts
else
    echo "✅ Données existantes trouvées"
fi

# Démarrer l'application
echo "🚀 Démarrage de l'application Next.js..."
echo "📱 Application disponible sur : http://localhost:3000"
echo "👤 Identifiants : admin@coop.com / admin2024"
echo ""
npm run dev
