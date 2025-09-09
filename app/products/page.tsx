'use client';

import { useEffect, useState, useTransition, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Heart,
  Grid,
  List,
  TreePine,
  Eye,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/hooks/useStore';
import { 
  formatPrice, 
  getProductImages, 
  parseJSON, 
  getProductName,
  getProductMaterial,
  getProductBadge
} from '@/lib/utils';

const translations = {
  fr: {
    searchProducts: 'Rechercher des produits...',
    filters: 'Filtres',
    categories: 'Catégories',
    priceRange: 'Gamme de Prix',
    material: 'Matériau',
    productsFound: 'produits trouvés',
    sortBy: 'Trier par',
    mostPopular: 'Plus Populaire',
    priceLowHigh: 'Prix: Bas à Élevé',
    priceHighLow: 'Prix: Élevé à Bas',
    highestRated: 'Mieux Noté',
    nameAZ: 'Nom: A à Z',
    reviews: 'avis',
    addToCart: 'Ajouter au Panier',
    buyNow: 'Acheter Maintenant',
    viewDetails: 'Voir Détails',
    outOfStock: 'Rupture de Stock',
    previous: 'Précédent',
    next: 'Suivant',
    da: 'DA',
    loading: 'Chargement...',
    noProducts: 'Aucun produit trouvé',
    allProducts: 'Tous les Produits',
    resetFilters: 'Réinitialiser les Filtres'
  },
  ar: {
    searchProducts: 'البحث عن المنتجات...',
    filters: 'المرشحات',
    categories: 'الفئات',
    priceRange: 'نطاق السعر',
    material: 'المادة',
    productsFound: 'منتج موجود',
    sortBy: 'ترتيب حسب',
    mostPopular: 'الأكثر شعبية',
    priceLowHigh: 'السعر: من الأقل للأعلى',
    priceHighLow: 'السعر: من الأعلى للأقل',
    highestRated: 'الأعلى تقييماً',
    nameAZ: 'الاسم: أ إلى ي',
    reviews: 'تقييم',
    addToCart: 'أضف للسلة',
    buyNow: 'اشتري الآن',
    viewDetails: 'عرض التفاصيل',
    outOfStock: 'نفد المخزون',
    previous: 'السابق',
    next: 'التالي',
    da: 'دج',
    loading: 'جاري التحميل...',
    noProducts: 'لم يتم العثور على منتجات',
    allProducts: 'جميع المنتجات',
    resetFilters: 'إعادة تعيين المرشحات'
  },
  en: {
    searchProducts: 'Search products...',
    filters: 'Filters',
    categories: 'Categories',
    priceRange: 'Price Range',
    material: 'Material',
    productsFound: 'products found',
    sortBy: 'Sort by',
    mostPopular: 'Most Popular',
    priceLowHigh: 'Price: Low to High',
    priceHighLow: 'Price: High to Low',
    highestRated: 'Highest Rated',
    nameAZ: 'Name: A to Z',
    reviews: 'reviews',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    viewDetails: 'View Details',
    outOfStock: 'Out of Stock',
    previous: 'Previous',
    next: 'Next',
    da: 'DA',
    loading: 'Loading...',
    noProducts: 'No products found',
    allProducts: 'All Products',
    resetFilters: 'Reset Filters'
  }
};

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  
  const {
    products,
    categories,
    totalCount,
    totalPages,
    currentPage,
    priceRange,
    availableMaterials,
    isLoading,
    error,
    filters,
    updateSearch,
    updateCategory,
    updatePriceRange,
    updateSortBy,
    updateLanguage,
    updatePage,
    resetFilters,
    isInitialized
  } = useStore();

  const t = useMemo(() => translations[filters.language] || translations.en, [filters.language]);
  const isRTL = useMemo(() => filters.language === 'ar', [filters.language]);

  // Load cart from localStorage only once on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, []);

  const addToCart = useCallback((productData: any) => {
    console.log('🛒 Adding to cart - Product data:', productData);
    
    const cartItem = {
        id: productData.id,
        quantity: 1,
        finish: 'natural', // default finish
        dimensions: {
          length: 180,
          width: 90,
          height: 75
        }, // default dimensions
        price: productData.price,
        addedAt: new Date().toISOString()
      };

    console.log('🛒 Cart item to add:', cartItem);

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log('🛒 Existing cart before adding:', existingCart);

    // Check if item already exists
    const existingItemIndex = existingCart.findIndex((item: any) => 
      item.id === productData.id && 
      item.finish === 'natural' &&
      JSON.stringify(item.dimensions) === JSON.stringify(cartItem.dimensions)
    );

    console.log('🛒 Existing item index:', existingItemIndex);

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += 1;
      console.log('🛒 Updated existing item quantity');
    } else {
      // Add new item
      existingCart.push(cartItem);
      console.log('🛒 Added new item to cart');
    }

    // Save back to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    console.log('🛒 Final cart saved to localStorage:', existingCart);

    // Update local state
    setCart(existingCart);

    // Show success message
    alert(`${getProductName(productData, filters.language)} ${t.addToCart}!`);
  }, [filters.language, t]);

  const getCategoryName = useCallback((category: any) => {
    if (category.name && typeof category.name === 'object') {
      return category.name[filters.language] || category.name.fr;
    }
    return filters.language === 'ar' ? category.nameAr : 
           filters.language === 'en' ? category.nameEn : 
           category.name;
  }, [filters.language]);

  // Show loading state until store is initialized
  if (!isInitialized ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erreur</h2>
          <p className="text-slate-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-2">
                  <TreePine className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  DariMeuble
                </span>
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                <Input
                  placeholder={t.searchProducts}
                  value={filters.search}
                  onChange={(e) => updateSearch(e.target.value)}
                  className="pl-10 w-full sm:w-64 border-slate-300 focus:border-blue-600"
                />
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-600 lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {t.filters}
                </Button>

                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateLanguage('fr')}
                    className={`text-xs sm:text-sm ${filters.language === 'fr' ? 'bg-blue-100 text-blue-600' : 'text-slate-600'}`}
                  >
                    FR
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateLanguage('ar')}
                    className={`text-xs sm:text-sm ${filters.language === 'ar' ? 'bg-blue-100 text-blue-600' : 'text-slate-600'}`}
                  >
                    AR
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateLanguage('en')}
                    className={`text-xs sm:text-sm ${filters.language === 'en' ? 'bg-blue-100 text-blue-600' : 'text-slate-600'}`}
                  >
                    EN
                  </Button>
                </div>

                <Button variant="ghost" size="sm" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50 relative" 
                onClick={() => window.location.href="/card"}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-64 space-y-4 sm:space-y-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <Card className="border-slate-200 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">{t.categories}</h3>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => updateCategory('all')}
                    className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors text-sm sm:text-base ${
                      filters.categoryId === 'all'
                        ? 'bg-blue-100 text-blue-800'
                        : 'hover:bg-blue-50 text-slate-700'
                    }`}
                  >
                    <span>{t.allProducts}</span>
                    <span className="text-xs sm:text-sm text-blue-600">({totalCount})</span>
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => updateCategory(category.id)}
                      className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors text-sm sm:text-base ${
                        filters.categoryId === category.id
                          ? 'bg-blue-100 text-blue-800'
                          : 'hover:bg-blue-50 text-slate-700'
                      }`}
                    >
                      <span>{getCategoryName(category)}</span>
                      <span className="text-xs sm:text-sm text-blue-600">({category._count?.products || 0})</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.priceRange}</h3>
                <div className="space-y-4">
                  <Slider
                    value={[filters.minPrice, filters.maxPrice]}
                    onValueChange={([min, max]) => updatePriceRange(min, max)}
                    max={priceRange.max}
                    min={priceRange.min}
                    step={5000}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-xs sm:text-sm text-slate-700">
                    <span>{formatPrice(filters.minPrice)}</span>
                    <span>{formatPrice(filters.maxPrice)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {availableMaterials.length > 0 && (
              <Card className="border-slate-200 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.material}</h3>
                  <div className="space-y-2">
                    {availableMaterials.slice(0, 5).map((material, index) => (
                      <Label key={index} className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" className="rounded border-slate-300" />
                        <span className="text-slate-700">{material}</span>
                      </Label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <span className="text-sm sm:text-base text-slate-700">
                  {`${totalCount} ${t.productsFound}`}
                </span>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Select value={filters.sortBy} onValueChange={updateSortBy}>
                <SelectTrigger className="w-full sm:w-48 border-slate-300 focus:border-blue-600">
                  <SelectValue placeholder={t.sortBy} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">{t.mostPopular}</SelectItem>
                  <SelectItem value="price-low">{t.priceLowHigh}</SelectItem>
                  <SelectItem value="price-high">{t.priceHighLow}</SelectItem>
                  <SelectItem value="rating">{t.highestRated}</SelectItem>
                  <SelectItem value="name">{t.nameAZ}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">{t.noProducts}</p>
                <Button onClick={resetFilters} className="mt-4">
                  {t.resetFilters}
                </Button>
              </div>
            ) : (
              <div className={`grid gap-4 sm:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map(product => {
                  const images = getProductImages(product);
                  const mainImage = images[0] || 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=500&h=400';
                  
                  return (
                    <Card 
                      key={product.id} 
                      className={`group cursor-pointer hover:shadow-2xl transition-all duration-500 border-slate-200 hover:border-blue-300 transform hover:scale-105 ${
                        viewMode === 'list' ? 'sm:flex' : ''
                      }`}
                    >
                      <CardContent className={`p-0 ${viewMode === 'list' ? 'sm:flex w-full' : ''}`}>
                        <div className={`relative overflow-hidden ${
                          viewMode === 'list' ? 'sm:w-48 sm:flex-shrink-0' : 'rounded-t-lg'
                        }`}>
                          <Image
                            src={mainImage}
                            alt={getProductName(product)}
                            width={400}
                            height={300}
                            className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
                              viewMode === 'list' ? 'w-full h-48 sm:h-full' : 'w-full h-48 sm:h-56'
                            }`}
                            loading="lazy"
                          />
                          <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                            <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm">
                              {getProductBadge(product, filters.language)}
                            </Badge>
                          </div>
                          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex space-x-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-white/80 hover:bg-white p-1 sm:p-2"
                            >
                              <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm sm:text-base">{t.outOfStock}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className={`p-4 sm:p-6 ${viewMode === 'list' ? 'sm:flex-1' : ''}`}>
                          <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {getProductName(product, filters.language)}
                          </h3>
                          
                          <div className="flex items-center mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-xs sm:text-sm text-slate-600 ml-2">
                              ({product.reviewCount} {t.reviews})
                            </span>
                          </div>

                          <div className="text-xs sm:text-sm text-slate-600 mb-3 space-y-1">
                            <p>{t.material}: {getProductMaterial(product, filters.language)}</p>
                            <p className="hidden sm:block">{product.dimensions}</p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                {formatPrice(product.price)}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-xs sm:text-sm text-slate-500 line-through">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button 
                              size="sm" 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm"
                              disabled={product.stock === 0}
                              onClick={() => addToCart(product)}
                            >
                              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                              {t.addToCart}
                            </Button>
                            <Link href={`/products/${product.id}`}>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50"
                              >
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-12 flex justify-center">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-600 text-xs sm:text-sm px-2 sm:px-3"
                    disabled={currentPage === 1}
                    onClick={() => updatePage(currentPage - 1)}
                  >
                    {t.previous}
                  </Button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button 
                        key={pageNum}
                        size="sm" 
                        variant={currentPage === pageNum ? "default" : "outline"}
                        className={currentPage === pageNum ? 
                          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 sm:px-4" :
                          "border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-600 px-3 sm:px-4"
                        }
                        onClick={() => updatePage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-600 text-xs sm:text-sm px-2 sm:px-3"
                    disabled={currentPage === totalPages}
                    onClick={() => updatePage(currentPage + 1)}
                  >
                    {t.next}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .rtl {
          direction: rtl;
        }
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
