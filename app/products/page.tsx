'use client';

import { useEffect, useState, useMemo } from 'react';
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
import { 
  fetchAllProducts,
  fetchCategories,
  fetchPriceRange,
  fetchMaterials
} from '@/lib/action/home-actions';

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

// Utility functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' DA';
};

const getProductImages = (product: any): string[] => {
  if (product.images) {
    try {
      const parsed = JSON.parse(product.images);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [product.images];
    }
  }
  return ['https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=500&h=400'];
};

const getProductName = (product: any, language: string = 'fr'): string => {
  switch (language) {
    case 'ar':
      return product.nameAr || product.name || 'منتج';
    case 'en':
      return product.nameEn || product.name || 'Product';
    default:
      return product.name || product.nameEn || 'Produit';
  }
};

const getProductBadge = (product: any, language: string = 'fr'): string => {
  if (product.salesCount > 50) {
    switch (language) {
      case 'ar': return 'الأكثر مبيعاً';
      case 'en': return 'Best Seller';
      default: return 'Meilleure Vente';
    }
  }
  
  switch (language) {
    case 'ar': return 'جديد';
    case 'en': return 'New';
    default: return 'Nouveau';
  }
};

export default function ProductsPage() {
  // Core data states
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 150000 });
  const [availableMaterials, setAvailableMaterials] = useState<string[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(150000);
  const [sortBy, setSortBy] = useState('popularity');
  const [language, setLanguage] = useState<'fr' | 'ar' | 'en'>('fr');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);

  const t = translations[language];
  const isRTL = language === 'ar';

  // Load cart from localStorage
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

  // Load all data once on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log("Loading all data...");
        // 1️⃣ Fetch products
        const productsData = await fetchAllProducts();
        setAllProducts(productsData);
        setIsLoading(false);

        // 2️⃣ Fetch categories
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);

        // 3️⃣ Fetch price range
        const priceRangeData = await fetchPriceRange();
        setPriceRange(priceRangeData);
        setMinPrice(priceRangeData.min);
        setMaxPrice(priceRangeData.max);

        // 4️⃣ Fetch materials
        const materialsData = await fetchMaterials();
        setAvailableMaterials(materialsData);
      } catch (error) {
        console.error("❌ Error loading data:", error);
      } finally {
      }
    };

    loadData();
  }, []);


  // CLIENT-SIDE FILTERING AND SORTING (super fast!)
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by category
    if (categoryId !== 'all') {
      filtered = filtered.filter(product => product.categoryId === categoryId);
    }

    // Filter by search
    if (search.trim() !== '') {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(product => 
        getProductName(product, language).toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.material && product.material.toLowerCase().includes(searchLower))
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        filtered.sort((a, b) => getProductName(a, language).localeCompare(getProductName(b, language)));
        break;
      default: // popularity
        filtered.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
        break;
    }

    return filtered;
  }, [allProducts, categoryId, search, minPrice, maxPrice, sortBy, language]);

  // CLIENT-SIDE PAGINATION (also super fast!)
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage, productsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);

  // Add to cart function
  const addToCart = (productData: any) => {
    console.log('Adding to cart:', productData);
    
    const cartItem = {
      id: productData.id,
      quantity: 1,
      finish: 'natural',
      dimensions: { length: 180, width: 90, height: 75 },
      price: productData.price,
      addedAt: new Date().toISOString()
    };

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex((item: any) => 
      item.id === productData.id && 
      item.finish === 'natural'
    );

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    setCart(existingCart);

    alert(`${getProductName(productData, language)} ${t.addToCart}!`);
  };

  // Filter handlers (no API calls!)
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = ([min, max]: number[]) => {
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleLanguageChange = (lang: 'fr' | 'ar' | 'en') => {
    setLanguage(lang);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setSearch('');
    setCategoryId('all');
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
    setSortBy('popularity');
    setCurrentPage(1);
  };

  const getCategoryName = (category: any) => {
    switch (language) {
      case 'ar':
        return category.nameAr || category.name;
      case 'en':
        return category.nameEn || category.name;
      default:
        return category.name;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">{t.loading}</p>
        </div>
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
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
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
                    onClick={() => handleLanguageChange('fr')}
                    className={`text-xs sm:text-sm ${language === 'fr' ? 'bg-blue-100 text-blue-600' : 'text-slate-600'}`}
                  >
                    FR
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLanguageChange('ar')}
                    className={`text-xs sm:text-sm ${language === 'ar' ? 'bg-blue-100 text-blue-600' : 'text-slate-600'}`}
                  >
                    AR
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLanguageChange('en')}
                    className={`text-xs sm:text-sm ${language === 'en' ? 'bg-blue-100 text-blue-600' : 'text-slate-600'}`}
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
                    onClick={() => handleCategoryChange('all')}
                    className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors text-sm sm:text-base ${
                      categoryId === 'all'
                        ? 'bg-blue-100 text-blue-800'
                        : 'hover:bg-blue-50 text-slate-700'
                    }`}
                  >
                    <span>{t.allProducts}</span>
                    <span className="text-xs sm:text-sm text-blue-600">({allProducts.length})</span>
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors text-sm sm:text-base ${
                        categoryId === category.id
                          ? 'bg-blue-100 text-blue-800'
                          : 'hover:bg-blue-50 text-slate-700'
                      }`}
                    >
                      <span>{getCategoryName(category)}</span>
                      <span className="text-xs sm:text-sm text-blue-600">
                        ({allProducts.filter(p => p.categoryId === category.id).length})
                      </span>
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
                    value={[minPrice, maxPrice]}
                    onValueChange={handlePriceRangeChange}
                    max={priceRange.max}
                    min={priceRange.min}
                    step={5000}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-xs sm:text-sm text-slate-700">
                    <span>{formatPrice(minPrice)}</span>
                    <span>{formatPrice(maxPrice)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <span className="text-sm sm:text-base text-slate-700">
                  {`${filteredAndSortedProducts.length} ${t.productsFound}`}
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

              <Select value={sortBy} onValueChange={handleSortChange}>
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
            {paginatedProducts.length === 0 ? (
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
                {paginatedProducts.map(product => {
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
                            alt={getProductName(product, language)}
                            width={400}
                            height={300}
                            className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
                              viewMode === 'list' ? 'w-full h-48 sm:h-full' : 'w-full h-48 sm:h-56'
                            }`}
                            loading="lazy"
                          />
                          <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                            <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm">
                              {getProductBadge(product, language)}
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
                            {getProductName(product, language)}
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
                            <p>{t.material}: {product.material || 'Wood'}</p>
                            <p className="hidden sm:block">{product.dimensions || 'N/A'}</p>
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
                    onClick={() => handlePageChange(currentPage - 1)}
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
                        onClick={() => handlePageChange(pageNum)}
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
                    onClick={() => handlePageChange(currentPage + 1)}
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
