const EN_TETE = `
<div style="border-bottom:3px solid #CC5500;padding-bottom:16px;margin-bottom:24px;">
<div style="display:flex;justify-content:space-between;align-items:center;">
<div style="display:flex;align-items:center;gap:14px;">
<img src="/logo.png" alt="Logo" style="width:60px;height:60px;object-fit:contain;border-radius:8px;"/>
<div><h1 style="font-size:20px;font-weight:800;color:#1a1a1a;margin:0 0 2px 0;">Synchro ERP</h1>
<p style="font-size:11px;color:#CC5500;font-weight:600;margin:0;font-style:italic;">Plus qu un ERP, un Partenaire</p></div></div>
<div style="text-align:right;font-size:11px;color:#666;">
<p style="margin:0;font-weight:600;">Cooperative Agricole</p>
<p style="margin:2px 0;">Tel: +226 70 00 00 00 | Email: contact@coop.bf</p>
<p style="margin:2px 0;">RCCM: BF-2024-001 | NIF: 123456789</p></div></div></div>`

const PIED_PAGE = `
<div style="border-top:2px solid #CC5500;padding-top:16px;margin-top:32px;font-size:10px;color:#999;text-align:center;">
<p style="margin:0 0 4px 0;">Synchro ERP - Plus qu un ERP, un Partenaire</p>
<p style="margin:0 0 4px 0;">Document genere le ${new Date().toLocaleDateString('fr-FR')}</p>
<p style="margin:0;">Construit par Manawa Techs 2026</p></div>`

function genererHTML(titre: string, contenu: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${titre}</title>
<style>@page{size:A4;margin:15mm}body{font-family:sans-serif;font-size:12px;color:#1a1a1a;padding:20px}
h2{font-size:18px;color:#CC5500;margin-bottom:8px}table{width:100%;border-collapse:collapse;margin:16px 0}
th{background:#FFF5F0;padding:10px;text-align:left;font-size:10px;color:#CC5500;border:1px solid #e8e8e8}
td{padding:10px;border:1px solid #e8e8e8;font-size:11px}
.info-box{background:#FAFAFA;border:1px solid #e8e8e8;border-radius:8px;padding:16px;margin:16px 0}
.badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:10px;font-weight:600}
.badge-success{background:#ECFDF5;color:#10b981}.badge-warning{background:#FFFBEB;color:#f59e0b}
@media print{body{padding:0}.no-print{display:none}}</style></head><body>
${EN_TETE}<h2>${titre}</h2>${contenu}${PIED_PAGE}
<div class="no-print" style="text-align:center;margin-top:24px;padding:16px;background:#FFF5F0;border-radius:8px">
<button onclick="window.print()" style="padding:12px 28px;background:#CC5500;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600">Imprimer</button></div></body></html>`
}

function ouvrirEtImprimer(html: string) {
  const fenetre = window.open('', '_blank', 'width=900,height=700')
  if (fenetre) { fenetre.document.write(html); fenetre.document.close(); setTimeout(() => fenetre.print(), 500) }
}

export function imprimerCartePlanteur(p: any) {
  const c = `<div class="info-box"><h3>Informations</h3>
<p><strong>ID:</strong> ${p.identifiant || 'N/A'}</p>
<p><strong>Nom:</strong> ${p.prenom} ${p.nom}</p>
<p><strong>Tel:</strong> ${p.telephone}</p>
<p><strong>Village:</strong> ${p.village}</p>
<p><strong>Culture:</strong> ${p.typeCulture || 'N/A'}</p>
<p><strong>Statut:</strong> <span class="badge badge-success">${p.statut}</span></p></div>`
  ouvrirEtImprimer(genererHTML(`Fiche Producteur - ${p.prenom} ${p.nom}`, c))
}

export function imprimerFacture(v: any) {
  const c = `<div class="info-box"><h3>Facture N ${v.id}</h3>
<p><strong>Date:</strong> ${v.dateVente}</p><p><strong>Client:</strong> ${v.membre?.prenom || ''} ${v.membre?.nom || ''}</p></div>
<table><tr><th>Description</th><th style="text-align:right">Montant</th></tr>
<tr><td>Produits</td><td style="text-align:right;font-weight:600">${v.montantTotal?.toLocaleString()} FCFA</td></tr></table>
<p style="text-align:right;font-weight:700;color:#CC5500;font-size:16px">Total: ${v.montantTotal?.toLocaleString()} FCFA</p>`
  ouvrirEtImprimer(genererHTML(`Facture N ${v.id}`, c))
}

export function imprimerRecu(o: any) {
  const c = `<div class="info-box" style="text-align:center">
<h3>Recu de ${o.type === 'ENTREE' ? 'Paiement' : 'Decaissement'}</h3>
<p style="font-size:24px;font-weight:700;color:${o.type==='ENTREE'?'#10b981':'#ef4444'}">${o.type==='ENTREE'?'+':'-'}${o.montant?.toLocaleString()} FCFA</p></div>
<p><strong>Motif:</strong> ${o.motif}</p><p><strong>Mode:</strong> ${o.modePaiement}</p><p><strong>Date:</strong> ${o.dateOperation}</p>`
  ouvrirEtImprimer(genererHTML(`Recu - ${o.motif}`, c))
}

export function imprimerBonLivraison(l: any) {
  const c = `<div class="info-box"><h3>Bon de Livraison ${l.reference}</h3></div>
<p><strong>Origine:</strong> ${l.origine} | <strong>Destination:</strong> ${l.destination}</p>
<p><strong>Transporteur:</strong> ${l.transporteur}</p><p><strong>Produits:</strong> ${l.produits}</p>
<p><strong>Frais:</strong> ${l.frais?.toLocaleString()} FCFA</p>`
  ouvrirEtImprimer(genererHTML(`Bon Livraison - ${l.reference}`, c))
}

export function imprimerRapport(s: any) {
  const c = `<table><tr><th>Indicateur</th><th style="text-align:right">Valeur</th></tr>
<tr><td>Producteurs</td><td style="text-align:right;font-weight:600">${s.totalPlanteurs || 0}</td></tr>
<tr><td>Produits</td><td style="text-align:right;font-weight:600">${s.totalProduits || 0}</td></tr>
<tr><td>Ventes du mois</td><td style="text-align:right;font-weight:600;color:#10b981">${(s.ventesMois || 0).toLocaleString()} FCFA</td></tr>
<tr><td>Solde Caisse</td><td style="text-align:right;font-weight:600;color:#CC5500">${(s.soldeCaisse || 0).toLocaleString()} FCFA</td></tr></table>`
  ouvrirEtImprimer(genererHTML('Rapport Mensuel', c))
}

export function imprimerAttestation(p: any) {
  const c = `<div style="text-align:center;margin:20px 0"><h3>Attestation d Adhesion</h3></div>
<p>Nous attestons que <strong>${p.prenom} ${p.nom}</strong>, ID: <strong>${p.identifiant}</strong>, village: <strong>${p.village}</strong>, est membre actif depuis le ${new Date(p.dateAdhesion).toLocaleDateString('fr-FR')}.</p>
<p style="text-align:right;margin-top:40px">Fait le ${new Date().toLocaleDateString('fr-FR')}</p>`
  ouvrirEtImprimer(genererHTML(`Attestation - ${p.prenom} ${p.nom}`, c))
}

export function imprimerEcheancier(cr: any) {
  let lignes = ''
  for (let i = 1; i <= (cr.duree || 12); i++) {
    const d = new Date(cr.dateOctroi || new Date()); d.setMonth(d.getMonth() + i)
    lignes += `<tr><td>${i}</td><td>${d.toLocaleDateString('fr-FR')}</td><td style="text-align:right">${(cr.mensualite || 0).toLocaleString()} FCFA</td></tr>`
  }
  const c = `<div class="info-box"><p><strong>Beneficiaire:</strong> ${cr.planteur}</p>
<p><strong>Montant:</strong> ${cr.montant?.toLocaleString()} FCFA | <strong>Duree:</strong> ${cr.duree} mois</p></div>
<table><tr><th>N</th><th>Date</th><th style="text-align:right">Montant</th></tr>${lignes}</table>`
  ouvrirEtImprimer(genererHTML(`Echeancier - ${cr.planteur}`, c))
}

export function imprimerPV(r: any) {
  const c = `<div class="info-box"><h3>Proces-Verbal</h3>
<p><strong>Reunion:</strong> ${r.titre}</p><p><strong>Type:</strong> ${r.type}</p>
<p><strong>Date:</strong> ${r.date} | <strong>Lieu:</strong> ${r.lieu}</p>
<p><strong>Participants:</strong> ${r.participants || 'N/A'}</p></div>
<p>Proces-verbal en attente de redaction.</p>`
  ouvrirEtImprimer(genererHTML(`PV - ${r.titre}`, c))
}

export default { imprimerCartePlanteur, imprimerFacture, imprimerRecu, imprimerBonLivraison, imprimerRapport, imprimerAttestation, imprimerEcheancier, imprimerPV }
