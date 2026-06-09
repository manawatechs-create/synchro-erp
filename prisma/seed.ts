import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Démarrage du seed...')

  // Supprimer les données existantes dans l'ordre
  await prisma.mouvementStock.deleteMany()
  await prisma.venteProduit.deleteMany()
  await prisma.achatProduit.deleteMany()
  await prisma.vente.deleteMany()
  await prisma.achat.deleteMany()
  await prisma.produit.deleteMany()
  await prisma.categorieProduit.deleteMany()
  await prisma.membre.deleteMany()
  await prisma.cooperative.deleteMany()

  // Créer la coopérative
  const cooperative = await prisma.cooperative.create({
    data: {
      nom: "Coopérative Agricole du Faso",
      adresse: "123 Rue de l'Agriculture, Ouagadougou",
      telephone: "+226 70 00 00 00",
      email: "contact@coop-agricole.bf"
    }
  })
  console.log('✅ Coopérative créée')

  // Créer les utilisateurs
  const adminPassword = await bcrypt.hash('admin2024', 10)
  const gestionnairePassword = await bcrypt.hash('gest2024', 10)
  const membrePassword = await bcrypt.hash('membre2024', 10)

  const admin = await prisma.membre.create({
    data: {
      nom: "Admin",
      prenom: "Principal",
      email: "admin@coop.com",
      telephone: "+226 71 00 00 00",
      adresse: "Ouagadougou",
      role: Role.ADMIN,
      cooperativeId: cooperative.id,
      motDePasse: adminPassword
    }
  })

  const gestionnaire = await prisma.membre.create({
    data: {
      nom: "Gestionnaire",
      prenom: "Coopérative",
      email: "gestionnaire@coop.com",
      telephone: "+226 71 00 00 01",
      adresse: "Bobo-Dioulasso",
      role: Role.GESTIONNAIRE,
      cooperativeId: cooperative.id,
      motDePasse: gestionnairePassword
    }
  })

  const membre = await prisma.membre.create({
    data: {
      nom: "Membre",
      prenom: "Actif",
      email: "membre@coop.com",
      telephone: "+226 71 00 00 02",
      adresse: "Koudougou",
      role: Role.MEMBRE,
      cooperativeId: cooperative.id,
      motDePasse: membrePassword
    }
  })
  console.log('✅ Utilisateurs créés')

  // Créer les catégories
  const categories = await Promise.all([
    prisma.categorieProduit.create({
      data: { nom: "Céréales", description: "Mil, maïs, sorgho, riz local" }
    }),
    prisma.categorieProduit.create({
      data: { nom: "Légumes", description: "Tomates, oignons, choux, aubergines" }
    }),
    prisma.categorieProduit.create({
      data: { nom: "Fruits", description: "Mangues, bananes, papayes, oranges" }
    }),
    prisma.categorieProduit.create({
      data: { nom: "Tubercules", description: "Patates douces, ignames, manioc" }
    }),
    prisma.categorieProduit.create({
      data: { nom: "Légumineuses", description: "Haricots, arachides, soja" }
    })
  ])
  console.log('✅ Catégories créées')

  // Créer les produits
  const produits = [
    { nom: "Mil", description: "Mil local de qualité supérieure", prix: 350, stock: 500, unite: "kg", cat: 0 },
    { nom: "Maïs", description: "Maïs blanc pour consommation", prix: 250, stock: 800, unite: "kg", cat: 0 },
    { nom: "Sorgho", description: "Sorgho rouge traditionnel", prix: 300, stock: 600, unite: "kg", cat: 0 },
    { nom: "Tomates", description: "Tomates fraîches du jardin", prix: 500, stock: 200, unite: "kg", cat: 1 },
    { nom: "Oignons", description: "Oignons violets locaux", prix: 400, stock: 300, unite: "kg", cat: 1 },
    { nom: "Choux", description: "Choux pommés frais", prix: 300, stock: 150, unite: "pièce", cat: 1 },
    { nom: "Mangues", description: "Mangues greffées sucrées", prix: 600, stock: 400, unite: "kg", cat: 2 },
    { nom: "Bananes", description: "Bananes plantain", prix: 450, stock: 350, unite: "régime", cat: 2 },
    { nom: "Patates douces", description: "Patates douces à chair orange", prix: 350, stock: 500, unite: "kg", cat: 3 },
    { nom: "Manioc", description: "Manioc doux frais", prix: 200, stock: 1000, unite: "kg", cat: 3 },
    { nom: "Haricots", description: "Haricots blancs secs", prix: 800, stock: 250, unite: "kg", cat: 4 },
    { nom: "Arachides", description: "Arachides non décortiquées", prix: 600, stock: 400, unite: "kg", cat: 4 }
  ]

  for (const p of produits) {
    await prisma.produit.create({
      data: {
        nom: p.nom,
        description: p.description,
        prixUnitaire: p.prix,
        quantiteStock: p.stock,
        uniteMesure: p.unite,
        categorieId: categories[p.cat].id,
        cooperativeId: cooperative.id
      }
    })
  }
  console.log('✅ Produits créés')

  console.log('\n📊 RÉSUMÉ DU SEED :')
  console.log('═══════════════════════════════════')
  console.log('🏢 Coopérative :', cooperative.nom)
  console.log('👥 Utilisateurs :')
  console.log('   - Admin : admin@coop.com / admin2024')
  console.log('   - Gestionnaire : gestionnaire@coop.com / gest2024')
  console.log('   - Membre : membre@coop.com / membre2024')
  console.log('📦 Produits :', produits.length, 'produits dans', categories.length, 'catégories')
  console.log('═══════════════════════════════════')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
