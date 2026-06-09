const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Démarrage du seed...')

  // Supprimer les données existantes
  await prisma.vente.deleteMany().catch(() => {})
  await prisma.achat.deleteMany().catch(() => {})
  await prisma.produit.deleteMany().catch(() => {})
  await prisma.categorieProduit.deleteMany().catch(() => {})
  await prisma.planteur.deleteMany().catch(() => {})
  await prisma.membre.deleteMany().catch(() => {})
  await prisma.cooperative.deleteMany().catch(() => {})

  // Créer la coopérative
  const cooperative = await prisma.cooperative.create({
    data: {
      nom: "Coopérative Villageoise de Koudougou",
      adresse: "Marché Central, Koudougou",
      telephone: "+226 70 00 00 00",
      email: "contact@coop-villageoise.bf"
    }
  })
  console.log('✅ Coopérative créée')

  // Créer les utilisateurs
  const adminPassword = await bcrypt.hash('admin2024', 10)
  const gestPassword = await bcrypt.hash('gest2024', 10)
  const membrePassword = await bcrypt.hash('membre2024', 10)

  await prisma.membre.create({
    data: {
      nom: "Admin",
      prenom: "Principal",
      email: "admin@coop.com",
      telephone: "+226 71 00 00 00",
      adresse: "Koudougou",
      role: "ADMIN",
      cooperativeId: cooperative.id,
      motDePasse: adminPassword
    }
  })

  await prisma.membre.create({
    data: {
      nom: "Gestionnaire",
      prenom: "Coopérative",
      email: "gestionnaire@coop.com",
      telephone: "+226 71 00 00 01",
      adresse: "Réo",
      role: "GESTIONNAIRE",
      cooperativeId: cooperative.id,
      motDePasse: gestPassword
    }
  })

  await prisma.membre.create({
    data: {
      nom: "Membre",
      prenom: "Actif",
      email: "membre@coop.com",
      telephone: "+226 71 00 00 02",
      adresse: "Sapouy",
      role: "MEMBRE",
      cooperativeId: cooperative.id,
      motDePasse: membrePassword
    }
  })
  console.log('✅ Utilisateurs créés')

  // Créer des planteurs
  const planteurs = [
    { identifiant: 'PLT-2024-0001', nom: 'Diallo', prenom: 'Amadou', telephone: '+226 70 00 00 10', village: 'Koudougou', region: 'Centre-Ouest', typeCulture: 'Céréales', superficie: 5.5 },
    { identifiant: 'PLT-2024-0002', nom: 'Camara', prenom: 'Fatou', telephone: '+226 70 00 00 11', village: 'Réo', region: 'Centre-Ouest', typeCulture: 'Maraîchage', superficie: 2.3 },
    { identifiant: 'PLT-2024-0003', nom: 'Koné', prenom: 'Ibrahim', telephone: '+226 70 00 00 12', village: 'Sapouy', region: 'Centre-Ouest', typeCulture: 'Arboriculture', superficie: 8.0 },
    { identifiant: 'PLT-2024-0004', nom: 'Ouédraogo', prenom: 'Aïcha', telephone: '+226 70 00 00 13', village: 'Koudougou', region: 'Centre-Ouest', typeCulture: 'Légumineuses', superficie: 3.7 },
    { identifiant: 'PLT-2024-0005', nom: 'Traoré', prenom: 'Moussa', telephone: '+226 70 00 00 14', village: 'Dédougou', region: 'Boucle du Mouhoun', typeCulture: 'Céréales', superficie: 12.0 },
  ]

  for (const p of planteurs) {
    await prisma.planteur.create({
      data: {
        ...p,
        cooperativeId: cooperative.id,
        sexe: Math.random() > 0.5 ? 'M' : 'F'
      }
    })
  }
  console.log('✅ Planteurs créés')

  // Créer les catégories
  const categories = await Promise.all([
    prisma.categorieProduit.create({ data: { nom: "Céréales", description: "Mil, maïs, sorgho, riz" } }),
    prisma.categorieProduit.create({ data: { nom: "Légumes", description: "Tomates, oignons, choux" } }),
    prisma.categorieProduit.create({ data: { nom: "Fruits", description: "Mangues, bananes, papayes" } }),
    prisma.categorieProduit.create({ data: { nom: "Tubercules", description: "Patates, ignames, manioc" } }),
  ])
  console.log('✅ Catégories créées')

  // Créer des produits
  const produitsData = [
    { nom: "Mil", prix: 350, stock: 500, unite: "kg", cat: 0 },
    { nom: "Maïs", prix: 250, stock: 800, unite: "kg", cat: 0 },
    { nom: "Tomates", prix: 500, stock: 200, unite: "kg", cat: 1 },
    { nom: "Oignons", prix: 400, stock: 300, unite: "kg", cat: 1 },
    { nom: "Mangues", prix: 600, stock: 150, unite: "kg", cat: 2 },
    { nom: "Patates", prix: 350, stock: 400, unite: "kg", cat: 3 },
  ]

  for (const p of produitsData) {
    await prisma.produit.create({
      data: {
        nom: p.nom,
        prixUnitaire: p.prix,
        quantiteStock: p.stock,
        uniteMesure: p.unite,
        categorieId: categories[p.cat].id,
        cooperativeId: cooperative.id
      }
    })
  }
  console.log('✅ Produits créés')

  console.log('')
  console.log('📊 SEED TERMINÉ AVEC SUCCÈS !')
  console.log('👤 admin@coop.com / admin2024')
  console.log('👤 gestionnaire@coop.com / gest2024')
  console.log('👤 membre@coop.com / membre2024')
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
