// Générateur de factures PDF (version simplifiée)
export function genererFactureHTML(facture: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: #166534; }
    .info { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .info-box { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #166534; color: white; padding: 12px; text-align: left; }
    td { padding: 12px; border-bottom: 1px solid #ddd; }
    .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
    .footer { text-align: center; margin-top: 50px; color: #666; font-size: 12px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌱 Coopérative Agricole du Faso</h1>
    <p>123 Rue de l'Agriculture, Ouagadougou</p>
    <p>Tél: +226 70 00 00 00 | Email: contact@coop-agricole.bf</p>
  </div>

  <div class="info">
    <div class="info-box">
      <strong>FACTURE N° ${facture.numero}</strong><br>
      Date: ${new Date(facture.date).toLocaleDateString('fr-FR')}<br>
      Échéance: ${new Date(facture.dateEcheance).toLocaleDateString('fr-FR')}
    </div>
    <div class="info-box">
      <strong>CLIENT</strong><br>
      ${facture.client.nom}<br>
      ${facture.client.adresse || ''}<br>
      ${facture.client.telephone || ''}<br>
      ${facture.client.email || ''}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Produit</th>
        <th>Quantité</th>
        <th>Prix unitaire</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${facture.produits.map((p: any) => `
        <tr>
          <td>${p.nom}</td>
          <td>${p.quantite} ${p.unite}</td>
          <td>${p.prixUnitaire.toLocaleString()} FCFA</td>
          <td>${p.total.toLocaleString()} FCFA</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="total">
    <p>Total HT: ${facture.totalHT.toLocaleString()} FCFA</p>
    <p>TVA (18%): ${facture.tva.toLocaleString()} FCFA</p>
    <p style="font-size: 24px; color: #166534;">Total TTC: ${facture.totalTTC.toLocaleString()} FCFA</p>
  </div>

  <div class="footer">
    <p>Merci pour votre confiance !</p>
    <p>Coopérative Agricole du Faso - RCCM: BF-2024-001</p>
  </div>

  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>
  `
}

export function imprimerFacture(facture: any) {
  const html = genererFactureHTML(facture)
  const fenetre = window.open('', '_blank', 'width=800,height=600')
  if (fenetre) {
    fenetre.document.write(html)
    fenetre.document.close()
  }
}

export function telechargerFacturePDF(facture: any) {
  const html = genererFactureHTML(facture)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Facture_${facture.numero}.html`
  a.click()
  URL.revokeObjectURL(url)
}
