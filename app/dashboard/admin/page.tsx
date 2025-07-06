'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Package, 
  TrendingUp, 
  ShoppingCart, 
  Plus,
  Edit,
  Trash2,
  Eye,
  TreePine,
  Settings,
  LogOut,
  X,
  Menu,
  UserPlus,
  Building
} from 'lucide-react';

const initialManagers = [
  { id: 1, name: 'Ahmed Benali', email: 'ahmed@boiscraft.dz', category: 'Tables', orders: 45, status: 'Active', createdAt: '2024-01-15' },
  { id: 2, name: 'Fatima Khelifi', email: 'fatima@boiscraft.dz', category: 'Chaises', orders: 32, status: 'Active', createdAt: '2024-01-10' },
  { id: 3, name: 'Mohamed Saidi', email: 'mohamed@boiscraft.dz', category: 'Armoires', orders: 28, status: 'Inactive', createdAt: '2024-01-05' },
  { id: 4, name: 'Amina Boudjema', email: 'amina@boiscraft.dz', category: 'Bureaux', orders: 19, status: 'Active', createdAt: '2024-01-01' }
];

const categories = [
  { id: 1, name: 'Tables', manager: 'Ahmed Benali', products: 24, orders: 156 },
  { id: 2, name: 'Chaises', manager: 'Fatima Khelifi', products: 18, orders: 132 },
  { id: 3, name: 'Armoires', manager: 'Mohamed Saidi', products: 15, orders: 89 },
  { id: 4, name: 'Bureaux', manager: 'Amina Boudjema', products: 12, orders: 67 },
  { id: 5, name: 'Lits', manager: 'Non assigné', products: 8, orders: 23 },
  { id: 6, name: 'Étagères', manager: 'Non assigné', products: 20, orders: 45 }
];

const availableCategories = ['Tables', 'Chaises', 'Armoires', 'Bureaux', 'Lits', 'Étagères', 'Canapés', 'Commodes'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingManager, setIsAddingManager] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [managers, setManagers] = useState(initialManagers);
  const [newManager, setNewManager] = useState({
    name: '',
    email: '',
    category: '',
    password: ''
  });

  const handleAddManager = () => {
    if (!newManager.name || !newManager.email || !newManager.category) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newManagerData = {
      id: managers.length + 1,
      name: newManager.name,
      email: newManager.email,
      category: newManager.category,
      orders: 0,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setManagers(prev => [...prev, newManagerData]);
    setIsAddingManager(false);
    setNewManager({ name: '', email: '', category: '', password: '' });
    alert(`Gestionnaire ${newManager.name} créé avec succès!`);
  };

  const handleDeleteManager = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce gestionnaire?')) {
      setManagers(prev => prev.filter(manager => manager.id !== id));
    }
  };

  const toggleManagerStatus = (id: number) => {
    setManagers(prev => prev.map(manager => 
      manager.id === id 
        ? { ...manager, status: manager.status === 'Active' ? 'Inactive' : 'Active' }
        : manager
    ));
  };

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
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                BoisCraft Admin
              </span>
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
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap ${activeTab === 'overview' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'text-slate-700 hover:bg-blue-50'}`}
          >
            Vue d'ensemble
          </Button>
          <Button
            variant={activeTab === 'managers' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('managers')}
            className={`whitespace-nowrap ${activeTab === 'managers' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'text-slate-700 hover:bg-blue-50'}`}
          >
            Gestionnaires
          </Button>
          <Button
            variant={activeTab === 'categories' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('categories')}
            className={`whitespace-nowrap ${activeTab === 'categories' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'text-slate-700 hover:bg-blue-50'}`}
          >
            Catégories
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Total Commandes</p>
                      <p className="text-xl sm:text-2xl font-bold text-slate-800">1,234</p>
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
                      <p className="text-sm text-blue-600">Total Produits</p>
                      <p className="text-xl sm:text-2xl font-bold text-slate-800">156</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-3">
                      <Package className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-green-600 mt-2">+8% ce mois</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Gestionnaires Actifs</p>
                      <p className="text-xl sm:text-2xl font-bold text-slate-800">{managers.filter(m => m.status === 'Active').length}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-100 to-violet-100 rounded-xl p-3">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-sm text-blue-600 mt-2">{managers.filter(m => m.status === 'Inactive').length} inactifs</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Chiffre d'Affaires</p>
                      <p className="text-lg sm:text-2xl font-bold text-slate-800">4,567,890 DA</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-3">
                      <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-sm text-green-600 mt-2">+15% ce mois</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-800">Activité Récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-slate-800 text-sm sm:text-base">Nouveau gestionnaire Ahmed Benali ajouté pour la catégorie Tables</p>
                      <p className="text-xs sm:text-sm text-slate-600">Il y a 2 heures</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-slate-800 text-sm sm:text-base">Commande #1234 mise à jour par Fatima Khelifi</p>
                      <p className="text-xs sm:text-sm text-slate-600">Il y a 4 heures</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-slate-800 text-sm sm:text-base">Nouveau produit ajouté à la catégorie Chaises</p>
                      <p className="text-xs sm:text-sm text-slate-600">Il y a 1 jour</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Managers Tab */}
        {activeTab === 'managers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Gestionnaires</h2>
                <p className="text-slate-600 text-sm sm:text-base">{managers.length} gestionnaires au total</p>
              </div>
              <Button
                onClick={() => setIsAddingManager(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full sm:w-auto"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter Gestionnaire
              </Button>
            </div>

            {isAddingManager && (
              <Card className="border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center">
                    <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
                    Ajouter Nouveau Gestionnaire
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-slate-700">Nom Complet *</Label>
                      <Input
                        id="name"
                        value={newManager.name}
                        onChange={(e) => setNewManager({...newManager, name: e.target.value})}
                        className="border-slate-300 focus:border-blue-600"
                        placeholder="Ex: Ahmed Benali"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-slate-700">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newManager.email}
                        onChange={(e) => setNewManager({...newManager, email: e.target.value})}
                        className="border-slate-300 focus:border-blue-600"
                        placeholder="ahmed@boiscraft.dz"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-slate-700">Catégorie *</Label>
                      <Select value={newManager.category} onValueChange={(value) => setNewManager({...newManager, category: value})}>
                        <SelectTrigger className="border-slate-300 focus:border-blue-600">
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-slate-700">Mot de passe temporaire *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newManager.password}
                        onChange={(e) => setNewManager({...newManager, password: e.target.value})}
                        className="border-slate-300 focus:border-blue-600"
                        placeholder="Mot de passe temporaire"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button onClick={handleAddManager} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer Gestionnaire
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingManager(false)} className="border-slate-300 text-slate-700">
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Managers List - Mobile Cards */}
            <div className="block sm:hidden space-y-4">
              {managers.map((manager) => (
                <Card key={manager.id} className="border-slate-200 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-800">{manager.name}</h3>
                        <p className="text-sm text-slate-600">{manager.email}</p>
                      </div>
                      <Badge className={manager.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {manager.status === 'Active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Catégorie:</span>
                        <span className="text-slate-800">{manager.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Commandes:</span>
                        <span className="text-slate-800">{manager.orders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Créé le:</span>
                        <span className="text-slate-800">{manager.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50">
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50"
                        onClick={() => toggleManagerStatus(manager.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {manager.status === 'Active' ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteManager(manager.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Managers Table - Desktop */}
            <Card className="border-slate-200 shadow-lg hidden sm:block">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                      <tr>
                        <th className="text-left p-4 text-slate-800">Nom</th>
                        <th className="text-left p-4 text-slate-800">Email</th>
                        <th className="text-left p-4 text-slate-800">Catégorie</th>
                        <th className="text-left p-4 text-slate-800">Commandes</th>
                        <th className="text-left p-4 text-slate-800">Statut</th>
                        <th className="text-left p-4 text-slate-800">Créé le</th>
                        <th className="text-left p-4 text-slate-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {managers.map((manager) => (
                        <tr key={manager.id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
                          <td className="p-4 text-slate-800">{manager.name}</td>
                          <td className="p-4 text-slate-600">{manager.email}</td>
                          <td className="p-4 text-slate-600">{manager.category}</td>
                          <td className="p-4 text-slate-600">{manager.orders}</td>
                          <td className="p-4">
                            <Badge className={manager.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {manager.status === 'Active' ? 'Actif' : 'Inactif'}
                            </Badge>
                          </td>
                          <td className="p-4 text-slate-600">{manager.createdAt}</td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-slate-200 text-slate-600 hover:bg-slate-50"
                                onClick={() => toggleManagerStatus(manager.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteManager(manager.id)}
                              >
                                <Trash2 className="h-4 w-4" />
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

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Catégories de Produits</h2>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full sm:w-auto">
                <Building className="h-4 w-4 mr-2" />
                Ajouter Catégorie
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categories.map((category) => (
                <Card key={category.id} className="border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-800">{category.name}</h3>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 p-2">
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 p-2">
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Gestionnaire:</span>
                        <span className="text-slate-800 text-right">{category.manager}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Produits:</span>
                        <span className="text-slate-800">{category.products}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Commandes:</span>
                        <span className="text-slate-800">{category.orders}</span>
                      </div>
                    </div>

                    <Separator className="my-4 bg-slate-200" />

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Button size="sm" variant="outline" className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 text-xs sm:text-sm">
                        Voir Produits
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm">
                        Assigner Gestionnaire
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}