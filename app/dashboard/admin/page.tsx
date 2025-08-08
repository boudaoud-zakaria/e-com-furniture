'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
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
  Loader2
} from 'lucide-react';

// Import your server actions
import {
  getDashboardStats,
  getRecentActivity,
  getManagers,
  createManager,
  deleteManager,
  toggleManagerStatus,
  getCategories,
  getAvailableCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '@/model/admin';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingManager, setIsAddingManager] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    activeManagers: 0,
    totalRevenue: 0,
    inactiveManagers: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [managers, setManagers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  
  // Form state
  const [newManager, setNewManager] = useState({
    firstName: '',
    lastName: '',
    email: '',
    categoryId: '',
    password: ''
  });

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    nameAr: '',
    nameEn: '',
    description: '',
    image: null
  });

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'managers') {
      loadManagers();
      loadAvailableCategories();
    } else if (activeTab === 'categories') {
      loadCategories();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [statsResult, activityResult] = await Promise.all([
        getDashboardStats(),
        getRecentActivity()
      ]);

      if (statsResult.success) {
        setDashboardStats(statsResult.data);
      } else {
        setError(statsResult.error);
      }

      if (activityResult.success) {
        setRecentActivities(activityResult.data);
      }
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadManagers = async () => {
    try {
      const result = await getManagers();
      if (result.success) {
        setManagers(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erreur lors du chargement des gestionnaires');
      console.error('Error loading managers:', err);
    }
  };

  

  const loadCategories = async () => {
    try {
      const result = await getCategories();
      if (result.success) {
        setCategories(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erreur lors du chargement des catégories');
      console.error('Error loading categories:', err);
    }
  };

  const loadAvailableCategories = async () => {
    try {
      const result = await getAvailableCategories();
      if (result.success) {
        setAvailableCategories(result.data);
      }
    } catch (err) {
      console.error('Error loading available categories:', err);
    }
  };

  const handleAddManager = async () => {
    if (!newManager.firstName || !newManager.lastName || !newManager.email || !newManager.categoryId || !newManager.password) {
      setError('Tous les champs sont requis');
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('firstName', newManager.firstName);
        formData.append('lastName', newManager.lastName);
        formData.append('email', newManager.email);
        formData.append('categoryId', newManager.categoryId);
        formData.append('password', newManager.password);

        const result = await createManager(formData);
        
        if (result.success) {
          setManagers(prev => [result.data, ...prev]);
          setIsAddingManager(false);
          setNewManager({
            firstName: '',
            lastName: '',
            email: '',
            categoryId: '',
            password: ''
          });
          setError(null);
          
          // Refresh dashboard stats
          loadDashboardData();
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Erreur lors de la création du gestionnaire');
        console.error('Error creating manager:', err);
      }
    });
  };

  const handleDeleteManager = async (managerId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce gestionnaire ?')) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteManager(managerId);
        
        if (result.success) {
          setManagers(prev => prev.filter(m => m.id !== managerId));
          loadDashboardData(); // Refresh stats
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Erreur lors de la suppression du gestionnaire');
        console.error('Error deleting manager:', err);
      }
    });
  };

  const handleToggleManagerStatus = async (managerId) => {
    startTransition(async () => {
      try {
        const result = await toggleManagerStatus(managerId);
        
        if (result.success) {
          setManagers(prev => prev.map(m => 
            m.id === managerId ? result.data : m
          ));
          loadDashboardData(); // Refresh stats
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Erreur lors de la mise à jour du statut');
        console.error('Error toggling manager status:', err);
      }
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleAddCategory = async () => {
  if (!newCategory.name || !newCategory.nameAr || !newCategory.nameEn) {
    setError('Nom, Nom Arabe et Nom Anglais sont requis');
    return;
  }

  startTransition(async () => {
    try {
      const formData = new FormData();
      formData.append('name', newCategory.name);
      formData.append('nameAr', newCategory.nameAr);
      formData.append('nameEn', newCategory.nameEn);
      formData.append('description', newCategory.description || '');
      
      // Only append image if it exists
      if (newCategory.image) {
        formData.append('image', newCategory.image);
      }

      const result = await createCategory(formData);

      if (result.success) {
        // Add the new category to the state with default values
        setCategories(prev => [{
          ...result.data,
          products: 0,
          orders: 0,
          manager: 'Non assigné'
        }, ...prev]);
        
        setIsAddingCategory(false);
        setNewCategory({ name: '', nameAr: '', nameEn: '', description: '', image: null });
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erreur lors de la création de la catégorie');
      console.error('Error creating category:', err);
    }
  });
};

  const handleUpdateCategory = async () => {
  if (!editingCategory || !newCategory.name || !newCategory.nameAr || !newCategory.nameEn) {
    setError('Tous les champs sont requis');
    return;
  }

  startTransition(async () => {
    try {
      const formData = new FormData();
      formData.append('name', newCategory.name);
      formData.append('nameAr', newCategory.nameAr);
      formData.append('nameEn', newCategory.nameEn);
      formData.append('description', newCategory.description || '');
      if (newCategory.image) {
        formData.append('image', newCategory.image);
      }

      const result = await updateCategory(editingCategory.id, formData);

      if (result.success) {
        // Update the category in state
        setCategories(prev => prev.map(c => 
          c.id === editingCategory.id ? result.data : c
        ));
        
        setEditingCategory(null);
        setIsAddingCategory(false);
        setNewCategory({ name: '', nameAr: '', nameEn: '', description: '', image: null });
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour de la catégorie');
      console.error('Error updating category:', err);
    }
  });
};

  const handleDeleteCategory = async (categoryId) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Tous les produits associés seront également supprimés.')) {
    return;
  }

  startTransition(async () => {
    try {
      const result = await deleteCategory(categoryId);
      
      if (result.success) {
        // Update categories list
        setCategories(prev => prev.filter(c => c.id !== categoryId));
        
        // Show success message
        setError(null);
        // You might want to use a toast notification here instead
        alert(result.message);
        
        // Refresh available categories for manager assignment
        loadAvailableCategories();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erreur lors de la suppression de la catégorie');
      console.error('Error deleting category:', err);
    }
  });
};

  // Updated handleEditCategory function to work with the full category data
const handleEditCategory = (category) => {
  setEditingCategory(category);
  setNewCategory({
    name: category.name,
    nameAr: category.nameAr,
    nameEn: category.nameEn,
    description: category.description || '',
    image: null // Reset file input, but keep reference to existing image
  });
  setIsAddingCategory(true);
};

// Optional: Add a function to toggle category status
const handleToggleCategoryStatus = async (categoryId) => {
  startTransition(async () => {
    try {
      const result = await toggleCategoryStatus(categoryId);
      
      if (result.success) {
        setCategories(prev => prev.map(c => 
          c.id === categoryId ? result.data : c
        ));
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
      console.error('Error toggling category status:', err);
    }
  });
};

  const cancelCategoryForm = () => {
    setIsAddingCategory(false);
    setEditingCategory(null);
    setNewCategory({ name: '', nameAr: '', nameEn: '', description: '', image: null });
    setError(null);
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'une heure';
    if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

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
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                DariMeuble Admin
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('overview')}
            className={activeTab === 'overview' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'text-slate-700 hover:bg-blue-50'}
          >
            Vue d'ensemble
          </Button>
          <Button
            variant={activeTab === 'managers' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('managers')}
            className={activeTab === 'managers' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'text-slate-700 hover:bg-blue-50'}
          >
            Gestionnaires
          </Button>
          <Button
            variant={activeTab === 'categories' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('categories')}
            className={activeTab === 'categories' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'text-slate-700 hover:bg-blue-50'}
          >
            Catégories
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Total Commandes</p>
                      <p className="text-2xl font-bold text-slate-800">{dashboardStats.totalOrders.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-3">
                      <ShoppingCart className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Total Produits</p>
                      <p className="text-2xl font-bold text-slate-800">{dashboardStats.totalProducts.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-3">
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Gestionnaires Actifs</p>
                      <p className="text-2xl font-bold text-slate-800">{dashboardStats.activeManagers}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-100 to-violet-100 rounded-xl p-3">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-sm text-blue-600 mt-2">{dashboardStats.inactiveManagers} inactifs</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Chiffre d'Affaires</p>
                      <p className="text-2xl font-bold text-slate-800">{formatCurrency(dashboardStats.totalRevenue)}</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-3">
                      <TrendingUp className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
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
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full bg-${activity.color}-500`}></div>
                        <div>
                          <p className="text-slate-800">{activity.message}</p>
                          <p className="text-sm text-slate-600">{getTimeAgo(activity.timestamp)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-600">Aucune activité récente</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Managers Tab */}
        {activeTab === 'managers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Gestionnaires</h2>
              <Button
                onClick={() => setIsAddingManager(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={isPending}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Gestionnaire
              </Button>
            </div>

            {isAddingManager && (
              <Card className="border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-800">Ajouter Nouveau Gestionnaire</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-slate-700">Prénom</Label>
                      <Input
                        id="firstName"
                        value={newManager.firstName}
                        onChange={(e) => setNewManager({...newManager, firstName: e.target.value})}
                        className="border-slate-300 focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-slate-700">Nom</Label>
                      <Input
                        id="lastName"
                        value={newManager.lastName}
                        onChange={(e) => setNewManager({...newManager, lastName: e.target.value})}
                        className="border-slate-300 focus:border-blue-600"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-slate-700">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newManager.email}
                        onChange={(e) => setNewManager({...newManager, email: e.target.value})}
                        className="border-slate-300 focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-slate-700">Mot de passe</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newManager.password}
                        onChange={(e) => setNewManager({...newManager, password: e.target.value})}
                        className="border-slate-300 focus:border-blue-600"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-slate-700">Catégorie</Label>
                    <Select value={newManager.categoryId} onValueChange={(value) => setNewManager({...newManager, categoryId: value})}>
                      <SelectTrigger className="border-slate-300 focus:border-blue-600">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleAddManager} 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Ajout...
                        </>
                      ) : (
                        'Ajouter Gestionnaire'
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingManager(false);
                        setError(null);
                      }} 
                      className="border-slate-300 text-slate-700"
                      disabled={isPending}
                    >
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-slate-200 shadow-lg">
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
                        <th className="text-left p-4 text-slate-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {managers.length > 0 ? (
                        managers.map((manager) => (
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
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                  onClick={() => handleToggleManagerStatus(manager.id)}
                                  disabled={isPending}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-red-200 text-red-600 hover:bg-red-50"
                                  onClick={() => handleDeleteManager(manager.id)}
                                  disabled={isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-slate-600">
                            Aucun gestionnaire trouvé
                          </td>
                        </tr>
                      )}
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
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Catégories</h2>
              <Button
                onClick={() => setIsAddingCategory(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={isPending}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Catégorie
              </Button>
            </div>

            {/* Add/Edit Category Form */}
            {isAddingCategory && (
              <Card className="border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-800">
                    {editingCategory ? 'Modifier Catégorie' : 'Ajouter Nouvelle Catégorie'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="categoryName" className="text-slate-700">Nom (Français)</Label>
                      <Input
                        id="categoryName"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                        className="border-slate-300 focus:border-blue-600"
                        placeholder="Ex: Mobilier"
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoryNameAr" className="text-slate-700">Nom (العربية)</Label>
                      <Input
                        id="categoryNameAr"
                        value={newCategory.nameAr}
                        onChange={(e) => setNewCategory({...newCategory, nameAr: e.target.value})}
                        className="border-slate-300 focus:border-blue-600"
                        placeholder="Ex: الأثاث"
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoryNameEn" className="text-slate-700">Nom (English)</Label>
                      <Input
                        id="categoryNameEn"
                        value={newCategory.nameEn}
                        onChange={(e) => setNewCategory({...newCategory, nameEn: e.target.value})}
                        className="border-slate-300 focus:border-blue-600"
                        placeholder="Ex: Furniture"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="categoryDescription" className="text-slate-700">Description</Label>
                    <Textarea
                      id="categoryDescription"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      className="border-slate-300 focus:border-blue-600"
                      placeholder="Description de la catégorie..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
  <Label htmlFor="categoryImage" className="text-slate-700">Image</Label>
  <Input
    id="categoryImage"
    type="file"
    accept="image/*"
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        setNewCategory({...newCategory, image: e.target.files[0]});
      }
    }}
    className="border-slate-300 focus:border-blue-600"
  />
  {editingCategory && editingCategory.image && !newCategory.image && (
    <div className="mt-2">
      <img 
        src={editingCategory.image} 
        alt="Current category image" 
        className="w-20 h-20 object-cover rounded-lg border border-slate-200"
      />
    </div>
  )}
</div>
                  
                  <Separator />
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {editingCategory ? 'Modification...' : 'Ajout...'}
                        </>
                      ) : (
                        <>
                          {editingCategory ? 'Modifier Catégorie' : 'Ajouter Catégorie'}
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={cancelCategoryForm}
                      className="border-slate-300 text-slate-700"
                      disabled={isPending}
                    >
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Categories List */}
            <Card className="border-slate-200 shadow-lg">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                      <tr>
                        <th className="text-left p-4 text-slate-800">Image</th>
                        <th className="text-left p-4 text-slate-800">Nom</th>
                        <th className="text-left p-4 text-slate-800">Traductions</th>
                        <th className="text-left p-4 text-slate-800">Gestionnaire</th>
                        <th className="text-left p-4 text-slate-800">Produits</th>
                        <th className="text-left p-4 text-slate-800">Commandes</th>
                        <th className="text-left p-4 text-slate-800">Statut</th>
                        <th className="text-left p-4 text-slate-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <tr key={category.id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
                            <td className="p-4">
                              {category.image ? (
                                <img 
                                  src={category.image} 
                                  alt={category.name}
                                  className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                  <Package className="h-6 w-6 text-blue-600" />
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="font-medium text-slate-800">{category.name}</p>
                                {category.description && (
                                  <p className="text-sm text-slate-600 mt-1 max-w-xs truncate">
                                    {category.description}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <p className="text-sm text-slate-600">
                                  <span className="font-medium">AR:</span> {category.nameAr}
                                </p>
                                <p className="text-sm text-slate-600">
                                  <span className="font-medium">EN:</span> {category.nameEn}
                                </p>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`text-sm ${category.manager === 'Non assigné' ? 'text-orange-600' : 'text-slate-600'}`}>
                                {category.manager}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Package className="h-4 w-4 text-blue-600" />
                                <span className="text-slate-600">{category.products}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <ShoppingCart className="h-4 w-4 text-green-600" />
                                <span className="text-slate-600">{category.orders}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className={category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {category.isActive ? 'Actif' : 'Inactif'}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                  onClick={() => handleEditCategory(category)}
                                  disabled={isPending}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-red-200 text-red-600 hover:bg-red-50"
                                  onClick={() => handleDeleteCategory(category.id)}
                                  disabled={isPending}
                                >
                                  {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="p-8 text-center text-slate-600">
                            Aucune catégorie trouvée
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}