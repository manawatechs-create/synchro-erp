'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Leaf, Users, Package, ShoppingCart, TrendingUp,
  AlertTriangle, LogOut, Home, BarChart3
} from 'lucide-react'

interface Stats {
  totalMembres: number
  totalProduits: number
  totalCategories: number
  ventesMois: number
  achatsMois: number
  dernieresVentes: any[]
  stockFaible: any[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<Stats>({
    totalMembres: 0,
    totalProduits: 0,
    totalCategories: 0,
    ventesMois: 0,
    achatsMois: 0,
    dernieresVentes: [],
    stockFaible: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    fetchStats(token)
  }, [])

  const fetchStats = async (token: string) => {
    try {
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const menuItems = [
    { title: 'Produits', icon: Package, path: '/dashboard/produits', color: 'bg-blue-500' },
    { title: 'Ventes', icon: ShoppingCart, path: '/dashboard/ventes', color: 'bg-green-500' },
    { title: 'Achats', icon: TrendingUp, path: '/dashboard/achats', color: 'bg-purple-500' },
    { title: 'Membres', icon: Users, path: '/dashboard/membres', color: 'bg-orange-500' },
    { title: 'Stock', icon: AlertTriangle, path: '/dashboard/stock', color: 'bg-red-500' },
    { title: 'Rapports', icon: BarChart3, path: '/dashboard/rapports', color: 'bg-indigo-500' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Coopérative Agricole
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 transition"
                title="Déconnexion"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Membres</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalMembres}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Produits</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProduits}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ventes du mois</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.ventesMois.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Achats du mois</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.achatsMois.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu de navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <div className={`${item.color} p-3 rounded-full inline-block mb-3`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
            </button>
          ))}
        </div>

        {/* Dernières ventes et Stock faible */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dernières ventes */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Dernières ventes</h3>
            </div>
            <div className="p-6">
              {stats.dernieresVentes && stats.dernieresVentes.length > 0 ? (
                <div className="space-y-4">
                  {stats.dernieresVentes.map((vente: any) => (
                    <div key={vente.id} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {vente.membre.prenom} {vente.membre.nom}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(vente.dateVente).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {vente.montantTotal.toLocaleString()} FCFA
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          vente.statut === 'VALIDEE' ? 'bg-green-100 text-green-800' :
                          vente.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {vente.statut}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Aucune vente récente</p>
              )}
            </div>
          </div>

          {/* Stock faible */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Stock faible</h3>
            </div>
            <div className="p-6">
              {stats.stockFaible && stats.stockFaible.length > 0 ? (
                <div className="space-y-4">
                  {stats.stockFaible.map((produit: any) => (
                    <div key={produit.id} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{produit.nom}</p>
                        <p className="text-xs text-gray-500">{produit.uniteMesure}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-red-600">
                          {produit.quantiteStock} en stock
                        </p>
                        <p className="text-xs text-gray-500">
                          {produit.prixUnitaire.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Tous les stocks sont suffisants</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
