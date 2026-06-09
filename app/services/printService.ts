// Service d'impression professionnel - Synchro ERP

const EN_TETE = `
<table style="width:100%;border-bottom:3px solid #CC5500;padding-bottom:16px;margin-bottom:24px;">
  <tr>
    <td style="width:70px"><img src="/logo.png" alt="Logo" style="width:60px;height:60px;object-fit:contain;border-radius:8px;" /></td>
    <td>
      <h1 style="font-size:20px;font-weight:800;color:#1a1a1a;margin:0 0 2px 0;">Synchro ERP</h1>
      <p style="font-size:11px;color:#CC5500;font-weight:600;margin:0;font-style:italic;">Plus qu'un ERP, un Partenaire</p>
    </td>
    <td style="text-align:right;font-size:11px;color:#666;">
      <p style="margin:0;font-weight:600;">Coopérative Agricole</p>
      <p style="margin:2px 0;">Siège Social, Burkina Faso</p>
      <p style="margin:2px 0;">Tél: +226 70 00 00 00</p>
      <p style="margin:2px 0;">Email: contact@cooperative.bf</p>
      <p style="margin:2px 0;">RCCM: BF-2024-001 | NIF: 123456789</p>
    </td>
  </tr>
</table>`

const PIED_PAGE = `
<table style="width:100%;border-top:2px solid #CC5500;padding-top:16px;margin-top:32px;">
  <tr>
    <td style="font-size:10px;color:#999;text-align:center;">
      <p style="margin:0 0 4px 0;">Synchro ERP - Plus qu'un ERP, un Partenaire</p>
      <p style="margin:0 0 4px 0;">Document généré le ${new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}</p>
      <p style="margin:0 0 4px 0;">Coopérative Agricole - RCCM: BF-2024-001 - NIF: 123456789</p>
      <p style="margin:4px 0 0 0;color:#CC5500;font-weight:500;">Construit par Manawa Techs © 2026</p>
    </td>
  </tr>
</table>`

const STYLES = `
<style>
  @page { size: A4; margin: 15mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, sans-serif; font-size: 12px; color: #1a1a1a; line-height: 1.6; padding: 20px; }
  h1 { font-size: 20px; font-weight: 800; }
  h2 { font-size: 18px; font-weight: 700; color: #CC5500; margin-bottom: 16px; }
  h3 { font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #FFF5F0; padding: 10px 12px; text-align: left; font-size: 10px; font-weight: 700; color: #CC5500; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #e8e8e8; }
  td { padding: 10px 12px; border: 1px solid #e8e8e8; font-size: 11px; }
  .info-box { background: #FAFAFA; border: 1px solid #e8e8e8; border-radius: 8px; padding: 16px; margin: 16px 0; }
  .info-label { font-size: 9px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.5px; }
  .info-value { font-size: 13px; font-weight: 600; color: #1a1a1a; }
  .text-right { text-align: right; }
  .text-center { text-align: center; }
  .total { font-size: 16px; font-weight: 700; color: #CC5500; text-align: right; padding: 12px 0; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 600; }
  .badge-success { background: #ECFDF5; color: #10b981; }
  .badge-warning { background: #FFFBEB; color: #f59e0b; }
  .badge-danger { background: #FEF2F2; color: #ef4444; }
  .signatures { display: flex; justify-content: space-between; margin-top: 40px; }
  .signature { text-align: center; width: 45%; }
  .signature-line { border-top: 1px solid #1a1a1a; width: 80%; margin: 30px auto 8px; }
  .no-print { text-align: center; margin-top: 24px; padding: 16px; background: #FFF5F0; border-radius: 8px; }
  .no-print button { padding: 12px 28px; background: #CC5500; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; }
  @media print { body { padding: 0; } .no-print { display: none; } }
</style>`

function genererHTML(titre: string, contenu: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${titre} - Synchro ERP</title>${STYLES}</head><body>${EN_TETE}<h2>${titre}</h2>${contenu}${PIED_PAGE}<div class="no-print"><button onclick="window.print()">🖨️ Imprimer ce document</button></div></body></html>`
}

function ouvrirEtImprimer(html: string) {
  const w = window.open('', '_blank', 'width=900,height=700')
  if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 500) }
}

// 🪪 CARTE PRODUCTEUR
export function imprimerCarteProducteur(p: any) {
  const contenu = `
<div class="info-box">
  <h3>🪪 Informations Personnelles</h3>
  <table>
    <tr><td style="width:40%"><span class="info-label">Identifiant</span><br><span class="info-value">${p.identifiant || 'N/A'}</span></td><td style="width:60%"><span class="info-label">Nom complet</span><br><span class="info-value">${p.prenom} ${p.nom}</span></td></tr>
    <tr><td><span class="info-label">Sexe</span><br><span class="info-value">${p.sexe === 'M' ? 'Masculin' : p.sexe === 'F' ? 'Féminin' : 'N/A'}</span></td><td><span class="info-label">Date de naissance</span><br><span class="info-value">${p.dateNaissance || 'N/A'}</span></td></tr>
    <tr><td><span class="info-label">Téléphone</span><br><span class="info-value">${p.telephone}</span></td><td><span class="info-label">Email</span><br><span class="info-value">${p.email || 'N/A'}</span></td></tr>
  </table>
</div>
<div class="info-box">
  <h3>📍 Localisation</h3>
  <table>
    <tr><td><span class="info-label">Village</span><br><span class="info-value">${p.village}</span></td><td><span class="info-label">Région</span><br><span class="info-value">${p.region || 'N/A'}</span></td></tr>
    <tr><td><span class="info-label">Département</span><br><span class="info-value">${p.departement || 'N/A'}</span></td><td><span class="info-label">Adresse</span><br><span class="info-value">${p.adresse || 'N/A'}</span></td></tr>
  </table>
</div>
<div class="info-box">
  <h3>🌾 Activité Agricole</h3>
  <table>
    <tr><td><span class="info-label">Type de culture</span><br><span class="info-value">${p.typeCulture || 'N/A'}</span></td><td><span class="info-label">Superficie</span><br><span class="info-value">${p.superficie ? p.superficie + ' ha' : 'N/A'}</span></td></tr>
    <tr><td><span class="info-label">Date d'adhésion</span><br><span class="info-value">${new Date(p.dateAdhesion).toLocaleDateString('fr-FR')}</span></td><td><span class="info-label">Statut</span><br><span class="info-value"><span class="badge badge-success">${p.statut}</span></span></td></tr>
  </table>
</div>
<div class="signatures">
  <div class="signature"><div class="signature-line"></div><p style="font-size:11px;">Le Producteur</p></div>
  <div class="signature"><div class="signature-line"></div><p style="font-size:11px;">Le Président</p></div>
</div>`
  ouvrirEtImprimer(genererHTML(`🪪 Carte Producteur - ${p.prenom} ${p.nom}`, contenu))
}

// 🧾 FACTURE
export function imprimerFacture(v: any) {
  const contenu = `
<div class="info-box">
  <table>
    <tr>
      <td style="width:50%">
        <h3>🧾 FACTURE N° FAC-${new Date(v.dateVente).getFullYear()}${String(new Date(v.dateVente).getMonth()+1).padStart(2,'0')}-${String(v.id).padStart(4,'0')}</h3>
        <p><span class="info-label">Date</span><br><span class="info-value">${new Date(v.dateVente).toLocaleDateString('fr-FR')}</span></p>
        <p><span class="info-label">Échéance</span><br><span class="info-value">${new Date(new Date(v.dateVente).getTime()+30*24*60*60*1000).toLocaleDateString('fr-FR')}</span></p>
      </td>
      <td style="width:50%;text-align:right;">
        <p><span class="info-label">Client</span><br><span class="info-value">${v.membre?.prenom || ''} ${v.membre?.nom || ''}</span></p>
        <p><span class="info-label">Statut</span><br><span class="badge ${v.statut==='VALIDEE'?'badge-success':'badge-warning'}">${v.statut==='VALIDEE'?'Payée':'En attente'}</span></p>
      </td>
    </tr>
  </table>
</div>
<table>
  <thead><tr><th>Description</th><th class="text-center">Qté</th><th class="text-right">Prix unitaire</th><th class="text-right">Montant</th></tr></thead>
  <tbody><tr><td>Produits agricoles</td><td class="text-center">1</td><td class="text-right">${v.montantTotal?.toLocaleString()} FCFA</td><td class="text-right" style="font-weight:600;">${v.montantTotal?.toLocaleString()} FCFA</td></tr></tbody>
</table>
<div style="text-align:right;margin-top:16px;">
  <p style="font-size:12px;">Total HT: ${Math.round(v.montantTotal/1.18)?.toLocaleString()} FCFA</p>
  <p style="font-size:12px;">TVA (18%): ${Math.round(v.montantTotal - v.montantTotal/1.18)?.toLocaleString()} FCFA</p>
  <p class="total">Total TTC: ${v.montantTotal?.toLocaleString()} FCFA</p>
</div>
<p style="font-size:11px;color:#999;margin-top:8px;">Arrêtée la présente facture à la somme de <strong>${v.montantTotal?.toLocaleString()} Francs CFA</strong>.</p>
<div class="signatures">
  <div class="signature"><div class="signature-line"></div><p style="font-size:11px;">Le Client</p></div>
  <div class="signature"><div class="signature-line"></div><p style="font-size:11px;">La Coopérative</p></div>
</div>`
  ouvrirEtImprimer(genererHTML(`🧾 Facture N° ${v.id}`, contenu))
}

// 💰 REÇU DE PAIEMENT
export function imprimerRecu(o: any) {
  const contenu = `
<div class="info-box" style="text-align:center;">
  <h3>${o.type === 'ENTREE' ? '💰 REÇU DE PAIEMENT' : '💸 REÇU DE DÉCAISSEMENT'}</h3>
  <p style="font-size:28px;font-weight:700;color:${o.type==='ENTREE'?'#10b981':'#ef4444'};margin:16px 0;">${o.montant?.toLocaleString()} FCFA</p>
  <p style="font-size:11px;color:#999;">Reçu N° ${o.reference || o.id}</p>
</div>
<table>
  <tr><td style="width:40%"><span class="info-label">Type d'opération</span><br><span class="info-value"><span class="badge ${o.type==='ENTREE'?'badge-success':'badge-danger'}">${o.type}</span></span></td><td><span class="info-label">Motif</span><br><span class="info-value">${o.motif}</span></td></tr>
  <tr><td><span class="info-label">Mode de paiement</span><br><span class="info-value">${o.modePaiement}</span></td><td><span class="info-label">Date</span><br><span class="info-value">${o.dateOperation}</span></td></tr>
  <tr><td><span class="info-label">Référence</span><br><span class="info-value">${o.reference || 'N/A'}</span></td><td><span class="info-label">Notes</span><br><span class="info-value">${o.notes || 'Néant'}</span></td></tr>
</table>
<p style="font-size:11px;color:#999;margin-top:16px;">Reçu établi pour la somme de <strong>${o.montant?.toLocaleString()} Francs CFA</strong></p>
<div class="signatures">
  <div class="signature"><div class="signature-line"></div><p style="font-size:11px;">Le Payeur</p></div>
  <div class="signature"><div class="signature-line"></div><p style="font-size:11px;">Le Caissier</p></div>
</div>`
  ouvrirEtImprimer(genererHTML(`💰 Reçu - ${o.motif}`, contenu))
}

// 📋 BON DE LIVRAISON
export function imprimerBonLivraison(l: any) {
  const contenu = `
<div class="info-box">
  <h3>📦 BON DE LIVRAISON N° ${l.reference}</h3>
</div>
<table>
  <tr><td style="width:40%"><span class="info-label">Origine</span><br><span class="info-value">${l.origine}</span></td><td><span class="info-label">Destination</span><br><span class="info-value">${l.destination}</span></td></tr>
  <tr><td><span class="info-label">Transporteur</span><br><span class="info-value">${l.transporteur || 'N/A'}</span></td><td><span class="info-label">Date départ</span><br><span class="info-value">${l.dateDepart}</span></td></tr>
  <tr><td><span class="info-label">Produits</span><br><span class="info-value">${l.produits || 'N/A'}</span></td><td><span class="info-label">Frais transport</span><br><span class="info-value" style="color:#CC5500;font-weight:700;">${l.frais?.toLocaleString() || 0} FCFA</span></td></tr>
  <tr><td><span class="info-label">Statut</span><br><span class="info-value"><span class="badge ${l.statut==='Livrée'?'badge-success':l.statut==='En cours'?'badge-warning':'badge-info'}">${l.statut}</span></span></td><td><span class="info-label">Notes</span><br><span class="info-value">${l.notes || 'Néant'}</span></td></tr>
</table>
<table style="margin-top:24px;">
  <thead><tr><th>Produit</th><th class="text-center">Quantité</th><th>Conditionnement</th><th class="text-right">Observations</th></tr></thead>
  <tbody><tr><td>${l.produits || 'Marchandises'}</td><td class="text-center">${l.quantite || '-'}</td><td>-</td><td class="text-right">${l.notes || 'Néant'}</td></tr></tbody>
</table>
<div class="signatures">
  <div class="signature"><div class="signature-line"></div><p style="font-size:11px;">Le Transporteur</p></div>
  <div class="signature"><div class="signature-line"></div><p style="font-size:11px;">Le Réceptionnaire</p></div>
</div>`
  ouvrirEtImprimer(genererHTML(`📋 Bon de Livraison - ${l.reference}`, contenu))
}

// 🏦 ÉCHÉANCIER CRÉDIT
export function imprimerEcheancier(c: any) {
  let lignes = ''
  const mensualite = c.mensualite || 0
  for (let i = 1; i <= (c.duree || 12); i++) {
    const date = new Date(c.dateOctroi || new Date())
    date.setMonth(date.getMonth() + i)
    lignes += `<tr><td>${i}</td><td>${date.toLocaleDateString('fr-FR')}</td><td class="text-right">${mensualite.toLocaleString()} FCFA</td><td class="text-center"><span class="badge badge-warning">En attente</span></td></tr>`
  }
  const contenu = `
<div class="info-box">
  <h3>🏦 Échéancier de Crédit</h3>
  <table>
    <tr><td style="width:33%"><span class="info-label">Bénéficiaire</span><br><span class="info-value">${c.planteur}</span></td><td style="width:33%"><span class="info-label">Montant</span><br><span class="info-value" style="color:#CC5500;">${c.montant?.toLocaleString()} FCFA</span></td><td style="width:33%"><span class="info-label">Taux d'intérêt</span><br><span class="info-value">${c.taux}%</span></td></tr>
    <tr><td><span class="info-label">Durée</span><br><span class="info-value">${c.duree} mois</span></td><td><span class="info-label">Mensualité</span><br><span class="info-value" style="color:#004D4D;">${mensualite.toLocaleString()} FCFA</span></td><td><span class="info-label">Total à rembourser</span><br><span class="info-value" style="color:#CC5500;">${(mensualite * c.duree)?.toLocaleString()} FCFA</span></td></tr>
  </table>
</div>
<table>
  <thead><tr><th>N°</th><th>Date échéance</th><th class="text-right">Montant</th><th class="text-center">Statut</th></tr></thead>
  <tbody>${lignes}</tbody>
</table>
<div class="signatures">
  <div class="signature"><div class="signature-line"></div><p style="font-size:11px;">Le Bénéficiaire</p></div>
  <div class="signature"><div class="signature-line"></div><p style="font-size:11px;">La Coopérative</p></div>
</div>`
  ouvrirEtImprimer(genererHTML(`🏦 Échéancier - ${c.planteur}`, contenu))
}

// 📋 PROCÈS-VERBAL
export function imprimerPV(r: any) {
  const contenu = `
<div class="info-box">
  <h3>📋 PROCÈS-VERBAL DE RÉUNION</h3>
  <table>
    <tr><td style="width:50%"><span class="info-label">Type de réunion</span><br><span class="info-value">${r.type}</span></td><td><span class="info-label">Date</span><br><span class="info-value">${new Date(r.date).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</span></td></tr>
    <tr><td><span class="info-label">Lieu</span><br><span class="info-value">${r.lieu}</span></td><td><span class="info-label">Participants</span><br><span class="info-value">${r.participants || 'N/A'} personnes</span></td></tr>
  </table>
</div>
<div class="info-box">
  <h3>📝 Ordre du Jour</h3>
  <p style="font-size:12px;">${r.titre}</p>
  <ol style="margin-left:20px;font-size:12px;">
    <li>Ouverture de la séance</li>
    <li>Lecture et adoption du PV précédent</li>
    <li>Points à l'ordre du jour</li>
    <li>Divers</li>
    <li>Clôture</li>
  </ol>
</div>
<div class="info-box">
  <h3>📋 Résolutions</h3>
  <p style="font-size:12px;">Les résolutions seront consignées lors de la réunion.</p>
</div>
<div class="signatures">
  <div class="signature"><div class="signature-line"></div><p style="font-size:11px;">Le Secrétaire</p></div>
  <div class="signature"><div class="signature-line"></div><p style="font-size:11px;">Le Président</p></div>
</div>`
  ouvrirEtImprimer(genererHTML(`📋 PV - ${r.titre}`, contenu))
}

// 📊 RAPPORT MENSUEL
export function imprimerRapport(s: any) {
  const mois = new Date().toLocaleDateString('fr-FR',{month:'long',year:'numeric'})
  const contenu = `
<div class="info-box">
  <h3>📊 Rapport d'Activité - ${mois}</h3>
</div>
<table>
  <thead><tr><th>Indicateur</th><th class="text-right">Valeur</th><th class="text-center">Tendance</th></tr></thead>
  <tbody>
    <tr><td>Total Producteurs</td><td class="text-right" style="font-weight:600;">${s.totalPlanteurs || 0}</td><td class="text-center">📈</td></tr>
    <tr><td>Total Produits en stock</td><td class="text-right" style="font-weight:600;">${s.totalProduits || 0}</td><td class="text-center">📊</td></tr>
    <tr><td>Ventes du mois</td><td class="text-right" style="font-weight:600;color:#10b981;">${(s.ventesMois || 0).toLocaleString()} FCFA</td><td class="text-center">💰</td></tr>
    <tr><td>Achats du mois</td><td class="text-right" style="font-weight:600;color:#ef4444;">${(s.achatsMois || 0).toLocaleString()} FCFA</td><td class="text-center">🛒</td></tr>
    <tr><td>Solde Caisse</td><td class="text-right" style="font-weight:600;color:#CC5500;">${(s.soldeCaisse || 0).toLocaleString()} FCFA</td><td class="text-center">💵</td></tr>
    <tr><td>Crédits Actifs</td><td class="text-right" style="font-weight:600;">${s.creditsActifs || 0}</td><td class="text-center">🏦</td></tr>
    <tr><td>Campagnes en cours</td><td class="text-right" style="font-weight:600;">${s.campagnesEnCours || 0}</td><td class="text-center">🌾</td></tr>
  </tbody>
</table>
<div class="info-box" style="margin-top:24px;">
  <h3>📋 Résumé</h3>
  <p style="font-size:12px;">Ce rapport présente l'état des activités de la coopérative pour le mois de ${mois}.</p>
</div>
<div class="signatures">
  <div class="signature"><div class="signature-line"></div><p style="font-size:11px;">Le Secrétaire</p></div>
  <div class="signature"><div class="signature-line"></div><p style="font-size:11px;">Le Président</p></div>
</div>`
  ouvrirEtImprimer(genererHTML(`📊 Rapport Mensuel - ${mois}`, contenu))
}

// 📜 ATTESTATION D'ADHÉSION
export function imprimerAttestation(p: any) {
  const contenu = `
<div style="text-align:center;margin:20px 0;">
  <h3>📜 ATTESTATION D'ADHÉSION</h3>
</div>
<div class="info-box">
  <p style="font-size:13px;line-height:1.8;">
    Je soussigné, Président de la <strong>Coopérative Agricole</strong>, atteste par la présente que :
  </p>
  <p style="font-size:15px;font-weight:700;text-align:center;margin:16px 0;color:#CC5500;">
    ${p.prenom} ${p.nom}
  </p>
  <p style="font-size:13px;line-height:1.8;">
    Identifiant: <strong>${p.identifiant}</strong><br>
    Village: <strong>${p.village}</strong><br>
    Région: <strong>${p.region || 'N/A'}</strong>
  </p>
  <p style="font-size:13px;line-height:1.8;margin-top:12px;">
    Est membre actif de la coopérative depuis le <strong>${new Date(p.dateAdhesion).toLocaleDateString('fr-FR')}</strong>.
  </p>
  <p style="font-size:13px;line-height:1.8;margin-top:12px;">
    En foi de quoi, la présente attestation lui est délivrée pour servir et valoir ce que de droit.
  </p>
</div>
<p style="font-size:12px;text-align:right;margin-top:24px;">Fait à Koudougou, le ${new Date().toLocaleDateString('fr-FR')}</p>
<div class="signatures">
  <div class="signature"><div class="signature-line"></div><p style="font-size:11px;">Cachet de la Coopérative</p></div>
  <div class="signature"><div class="signature-line"></div><p style="font-size:11px;">Le Président</p></div>
</div>`
  ouvrirEtImprimer(genererHTML(`📜 Attestation - ${p.prenom} ${p.nom}`, contenu))
}

export default { imprimerCarteProducteur, imprimerFacture, imprimerRecu, imprimerBonLivraison, imprimerEcheancier, imprimerPV, imprimerRapport, imprimerAttestation }
