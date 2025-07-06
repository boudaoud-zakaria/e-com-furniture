'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Edit,
  TreePine,
  Settings,
  LogOut,
  Search,
  Filter,
  Plus,
  Menu,
  X
} from 'lucide-react';

const orders = [
  {
    id: 'CMD-001',
    customer: 'Karim Benaissa',
    product: 'Table à Manger en Chêne Rustique',
    customization: 'Taille: 200cm x 90cm, Finition: Chêne Naturel',
    quantity: 1,
    total: 89900,
    status: 'En Attente',
    date: '2024-01-15',
    priority: 'Haute'
  },
  {
    id: 'CMD-002',
    customer: 'Amina Cherif',
    product: 'Table Basse Moderne en Chêne',
    customization: 'Taille: 120cm x 60cm, Finition: Chêne Foncé',
    quantity: 1,
    total: 44900,
    status: 'En Cours',
    date: '2024-01-14',
    priority: 'Moyenne'
  },
  {
    id: 'CMD-003',
    customer: 'Youcef Mansouri',
    product: 'Bureau Exécutif en Chêne',
    customization: 'Taille: 180cm x 80cm, Finition: Chêne Clair',
    quantity: 1,
    total: 79900,
    status: 'Terminée',
    date: '2024-01-13',
    priority: 'Basse'
  },
  {
    id: 'CMD-004',
    customer: 'Leila Boumediene',
    product: 'Bibliothèque en Chêne',
    customization: 'Taille: 200cm x 35cm, Finition: Chêne Naturel',
    quantity: 2,
    total: 69800,
    status: 'Annulée',
    date: '2024-01-12',
    priority: 'Moyenne'
  }
];

const products = [
  {
    id: 1,
    name: 'Table à Manger en Chêne Rustique',
    stock: 15,
    price: 89900,
    sales: 45,
    status: 'Actif'
  },
  {
    id: 2,
    name: 'Table Basse Moderne en Chêne',
    stock: 8,
    price: 44900,
    sales: 32,
    status: 'Actif'
  },
  {
    id: 3,
    name: 'Bureau Exécutif en Chêne',
    stock: 3,
    price: 79900,
    sales: 28,
    status: 'Stock Faible'
  },
  {
    id: 4,
    name: 'Bibliothèque en Chêne',
    stock: 0,
    price: 34900,
    sales: 56,
    status: 'Rupture de Stock'
  }
];

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En Attente': return 'bg-yellow-100 text-yellow-800';
      case 'En Cours': return 'bg-blue-100 text-blue-800';
      case 'Terminée': return 'bg-green-100 text-green-800';
      case 'Annulée': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Haute': return 'bg-red-100 text-red-800';
      case 'Moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'Basse': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Rupture de Stock', color: 'bg-red-100 text-red-800' };
    if (stock < 5) return { label: 'Stock Faible', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'En Stock', color: 'bg-green-100 text-green-800' };
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-2">
                <TreePine className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Tableau de Bord Gestionnaire
                </span>
                <Badge className="bg-blue-100 text-blue-800 text-xs sm:text-sm mt-1 sm:mt-0">Catégorie Tables</Badge>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-700"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4">
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Total Commandes</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-800">156</p>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-3">
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">+12% ce mois</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Commandes en Attente</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-800">24</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-3">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-sm text-red-600 mt-2">3 commandes urgentes</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Produits</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-800">24</p>
                </div>
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-3">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-yellow-600 mt-2">2 articles en rupture</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Terminées</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-800">132</p>
                </div>
                <div className="bg-gradient-to-r from-purple-100 to-violet-100 rounded-xl p-3">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">98% taux de réussite</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto">
          <Button
            variant={activeTab === 'orders' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('orders')}
            className={`whitespace-nowrap ${activeTab === 'orders' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'text-slate-700 hover:bg-blue-50'}`}
          >
            Commandes
          </Button>
          <Button
            variant={activeTab === 'products' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('products')}
            className={`whitespace-nowrap ${activeTab === 'products' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'text-slate-700 hover:bg-blue-50'}`}
          >
            Produits
          </Button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                  <Input
                    placeholder="Rechercher des commandes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-300 focus:border-blue-600"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48 border-slate-300 focus:border-blue-600">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les Commandes</SelectItem>
                    <SelectItem value="attente">En Attente</SelectItem>
                    <SelectItem value="cours">En Cours</SelectItem>
                    <SelectItem value="terminée">Terminées</SelectItem>
                    <SelectItem value="annulée">Annulées</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <p className="text-slate-700 text-sm">
                {filteredOrders.length} commandes trouvées
              </p>
            </div>

            {/* Orders List - Mobile Cards */}
            <div className="block lg:hidden space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="border-slate-200 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-800">{order.id}</h3>
                        <p className="text-sm text-slate-600">{order.customer}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <Badge className={getPriorityColor(order.priority)}>
                          {order.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-slate-800 font-medium">{order.product}</p>
                      <p className="text-slate-600 text-xs">{order.customization}</p>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Total:</span>
                        <span className="text-slate-800 font-medium">{formatPrice(order.total)} DA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Date:</span>
                        <span className="text-slate-800">{order.date}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50">
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50">
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Orders Table - Desktop */}
            <Card className="border-slate-200 shadow-lg hidden lg:block">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                      <tr>
                        <th className="text-left p-4 text-slate-800">ID Commande</th>
                        <th className="text-left p-4 text-slate-800">Client</th>
                        <th className="text-left p-4 text-slate-800">Produit</th>
                        <th className="text-left p-4 text-slate-800">Personnalisation</th>
                        <th className="text-left p-4 text-slate-800">Total</th>
                        <th className="text-left p-4 text-slate-800">Statut</th>
                        <th className="text-left p-4 text-slate-800">Priorité</th>
                        <th className="text-left p-4 text-slate-800">Date</th>
                        <th className="text-left p-4 text-slate-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
                          <td className="p-4 text-slate-800 font-medium">{order.id}</td>
                          <td className="p-4 text-slate-800">{order.customer}</td>
                          <td className="p-4 text-slate-600">{order.product}</td>
                          <td className="p-4 text-slate-600 text-sm max-w-xs truncate">{order.customization}</td>
                          <td className="p-4 text-slate-800 font-medium">{formatPrice(order.total)} DA</td>
                          <td className="p-4">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={getPriorityColor(order.priority)}>
                              {order.priority}
                            </Badge>
                          </td>
                          <td className="p-4 text-slate-600">{order.date}</td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Mes Produits</h2>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Nouveau Produit
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <Card key={product.id} className="border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-800 line-clamp-2">{product.name}</h3>
                        <Badge className={stockStatus.color}>
                          {stockStatus.label}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Prix:</span>
                          <span className="text-slate-800 font-medium">{formatPrice(product.price)} DA</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Stock:</span>
                          <span className="text-slate-800">{product.stock} unités</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Ventes:</span>
                          <span className="text-slate-800">{product.sales} vendus</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50">
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}