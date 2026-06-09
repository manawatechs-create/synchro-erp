'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Package, ArrowLeft } from 'lucide-react'

interface Produit {
  id: number
  nom: string
  description: string
  prixUnitaire: number
  quantiteStock: number
  uniteMesure: string
  categorie: {
    id: number
    nom: string
  }
}

export default function ProduitsPage() {
  const router = useRouter()
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prixUnitaire: '',
    quantiteStock: '',
    uniteMesure: 'kg',
    categorieId: ''
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchProduits(token)
    fetchCategories(token)
  }, [])

  const fetchProduits = async (token: string) => {
    try {
      const response = await fetch('/api/produits', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setProduits(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async (token: string) => {
    try {
      const response = await fetch('/api/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch('/api/produits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowForm(false)
        setFormData({
          nom: '',
          description: '',
          prixUnitaire: '',
          quantiteStock: '',
          uniteMesure: 'kg',
          categorieId: ''
        })
        fetchProduits(token!)
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Produits</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau Produit
          </button>
        </div>

        {/* Formulaire d'ajout */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Ajouter un produit</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <select
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.categorieId}
                  onChange={(e) => setFormData({...formData, categorieId: e.target.value})}
                >
                  <option value="">Sélectionner</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prix unitaire (FCFA)</label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.prixUnitaire}
                  onChange={(e) => setFormData({...formData, prixUnitaire: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantité en stock</label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.quantiteStock}
                  onChange={(e) => setFormData({...formData, quantiteStock: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unité de mesure</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.uniteMesure}
                  onChange={(e) => setFormData({...formData, uniteMesure: e.target.value})}
                >
                  <option value="kg">Kilogramme (kg)</option>
                  <option value="tonne">Tonne</option>
                  <option value="sac">Sac</option>
                  <option value="pièce">Pièce</option>
                  <option value="régime">Régime</option>
                  <option value="litre">Litre</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="col-span-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des produits */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Liste des produits ({produits.length})</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-3">Produit</th>
                      <th className="pb-3">Catégorie</th>
                      <th className="pb-3">Prix</th>
                      <th className="pb-3">Stock</th>
                      <th className="pb-3">Unité</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produits.map((produit) => (
                      <tr key={produit.id} className="border-b last:border-0">
                        <td className="py-3">
                          <div>
                            <p className="font-medium">{produit.nom}</p>
                            {produit.description && (
                              <p className="text-sm text-gray-500">{produit.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {produit.categorie.nom}
                          </span>
                        </td>
                        <td className="py-3 font-medium">
                          {produit.prixUnitaire.toLocaleString()} FCFA
                        </td>
                        <td className="py-3">
                          <span className={`font-medium ${
                            produit.quantiteStock < 50 ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {produit.quantiteStock}
                          </span>
                        </td>
                        <td className="py-3 text-gray-600">{produit.uniteMesure}</td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
