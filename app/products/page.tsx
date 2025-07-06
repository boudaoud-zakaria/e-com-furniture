'use client';

import { useState, useEffect } from 'react';
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
  Plus,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const products = [
  {
    id: 1,
    name: { fr: 'Table à Manger en Chêne Rustique', ar: 'طاولة طعام من خشب البلوط الريفي', en: 'Rustic Oak Dining Table' },
    price: 89900,
    originalPrice: 129900,
    image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=500&h=400',
    category: 'tables',
    rating: 4.8,
    reviews: 124,
    badge: { fr: 'Meilleure Vente', ar: 'الأكثر مبيعاً', en: 'Best Seller' },
    inStock: true,
    dimensions: '180cm x 90cm x 75cm',
    material: { fr: 'Bois de Chêne', ar: 'خشب البلوط', en: 'Oak Wood' }
  },
  {
    id: 2,
    name: { fr: 'Armoire Moderne en Noyer', ar: 'خزانة حديثة من خشب الجوز', en: 'Modern Walnut Cabinet' },
    price: 64900,
    originalPrice: 84900,
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=500&h=400',
    category: 'cabinets',
    rating: 4.9,
    reviews: 87,
    badge: { fr: 'Nouveau', ar: 'جديد', en: 'New' },
    inStock: true,
    dimensions: '120cm x 40cm x 180cm',
    material: { fr: 'Bois de Noyer', ar: 'خشب الجوز', en: 'Walnut Wood' }
  },
  {
    id: 3,
    name: { fr: 'Chaise de Travail Ergonomique', ar: 'كرسي عمل مريح', en: 'Ergonomic Work Chair' },
    price: 29900,
    originalPrice: 39900,
    image: 'https://media.but.fr/images_produits/p-xl/0033616060076_AMB1.jpg',
    category: 'chairs',
    rating: 4.7,
    reviews: 203,
    badge: { fr: 'Promotion', ar: 'تخفيض', en: 'Sale' },
    inStock: true,
    dimensions: '60cm x 60cm x 110cm',
    material: { fr: 'Bois de Hêtre', ar: 'خشب الزان', en: 'Beech Wood' }
  },
  {
    id: 4,
    name: { fr: 'Bibliothèque Minimaliste', ar: 'مكتبة بسيطة', en: 'Minimalist Bookshelf' },
    price: 44900,
    originalPrice: 54900,
    image: 'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=500&h=400',
    category: 'shelves',
    rating: 4.6,
    reviews: 156,
    badge: { fr: 'Populaire', ar: 'شائع', en: 'Popular' },
    inStock: true,
    dimensions: '80cm x 30cm x 200cm',
    material: { fr: 'Bois de Pin', ar: 'خشب الصنوبر', en: 'Pine Wood' }
  },
  {
    id: 5,
    name: { fr: 'Bureau Exécutif', ar: 'مكتب تنفيذي', en: 'Executive Desk' },
    price: 79900,
    originalPrice: 99900,
    image: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=500&h=400',
    category: 'desks',
    rating: 4.8,
    reviews: 98,
    badge: { fr: 'Premium', ar: 'مميز', en: 'Premium' },
    inStock: false,
    dimensions: '160cm x 80cm x 75cm',
    material: { fr: 'Bois d\'Acajou', ar: 'خشب الماهوجني', en: 'Mahogany Wood' }
  },
  {
    id: 6,
    name: { fr: 'Fauteuil Vintage', ar: 'كرسي عتيق', en: 'Vintage Armchair' },
    price: 54900,
    originalPrice: 69900,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTyVyigG2TjOSc6IqHDond5puIsD7ncrcOnw&s',
    category: 'chairs',
    rating: 4.7,
    reviews: 89,
    badge: { fr: 'Classique', ar: 'كلاسيكي', en: 'Classic' },
    inStock: true,
    dimensions: '75cm x 70cm x 95cm',
    material: { fr: 'Cuir & Chêne', ar: 'جلد وبلوط', en: 'Leather & Oak' }
  }
];

const categories = [
  { id: 'all', name: { fr: 'Tous les Produits', ar: 'جميع المنتجات', en: 'All Products' }, count: 120 },
  { id: 'tables', name: { fr: 'Tables', ar: 'طاولات', en: 'Tables' }, count: 24 },
  { id: 'chairs', name: { fr: 'Chaises', ar: 'كراسي', en: 'Chairs' }, count: 18 },
  { id: 'cabinets', name: { fr: 'Armoires', ar: 'خزائن', en: 'Cabinets' }, count: 15 },
  { id: 'beds', name: { fr: 'Lits', ar: 'أسرة', en: 'Beds' }, count: 12 },
  { id: 'shelves', name: { fr: 'Étagères', ar: 'أرفف', en: 'Shelves' }, count: 20 },
  { id: 'desks', name: { fr: 'Bureaux', ar: 'مكاتب', en: 'Desks' }, count: 9 }
];

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
    da: 'DA'
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
    da: 'دج'
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
    da: 'DA'
  }
};

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'ar' | 'en'>('fr');
  const [cart, setCart] = useState<any[]>([]);

  const t = translations[language];
  const isRTL = language === 'ar';

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name[language].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name[language].localeCompare(b.name[language]));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, priceRange, sortBy, language]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const addToCart = (product: any) => {
    setCart(prev => [...prev, { ...product, quantity: 1, id: Date.now() }]);
    // Show success message
    alert(`${product.name[language]} ajouté au panier!`);
  };

  const buyNow = (product: any) => {
    // Redirect to order page with product
    window.location.href = `/order?product=${product.id}`;
  };

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
                BoisCraft
              </span>
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
              <Input
                placeholder={t.searchProducts}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  onClick={() => setLanguage('fr')}
                  className={`text-xs sm:text-sm ${language === 'fr' ? 'bg-blue-100 text-blue-600' : 'text-slate-600'}`}
                >
                  FR
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage('ar')}
                  className={`text-xs sm:text-sm ${language === 'ar' ? 'bg-blue-100 text-blue-600' : 'text-slate-600'}`}
                >
                  AR
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage('en')}
                  className={`text-xs sm:text-sm ${language === 'en' ? 'bg-blue-100 text-blue-600' : 'text-slate-600'}`}
                >
                  EN
                </Button>
              </div>

              <Button variant="ghost" size="sm" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50 relative">
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
              <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.categories}</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors text-sm sm:text-base ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-800'
                        : 'hover:bg-blue-50 text-slate-700'
                    }`}
                  >
                    <span>{category.name[language]}</span>
                    <span className="text-xs sm:text-sm text-blue-600">({category.count})</span>
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
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={150000}
                  min={0}
                  step={5000}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-700">
                  <span>{formatPrice(priceRange[0])} {t.da}</span>
                  <span>{formatPrice(priceRange[1])} {t.da}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.material}</h3>
              <div className="space-y-2">
                {[
                  { fr: 'Bois de Chêne', ar: 'خشب البلوط', en: 'Oak Wood' },
                  { fr: 'Bois de Noyer', ar: 'خشب الجوز', en: 'Walnut Wood' },
                  { fr: 'Bois de Pin', ar: 'خشب الصنوبر', en: 'Pine Wood' },
                  { fr: 'Bois d\'Acajou', ar: 'خشب الماهوجني', en: 'Mahogany Wood' },
                  { fr: 'Bois de Hêtre', ar: 'خشب الزان', en: 'Beech Wood' }
                ].map((material, index) => (
                  <Label key={index} className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded border-slate-300" />
                    <span className="text-slate-700">{material[language]}</span>
                  </Label>
                ))}
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
                {filteredProducts.length} {t.productsFound}
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

            <Select value={sortBy} onValueChange={setSortBy}>
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
          <div className={`grid gap-4 sm:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map(product => (
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
                      src={product.image}
                      alt={product.name[language]}
                      width={400}
                      height={300}
                      className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
                        viewMode === 'list' ? 'w-full h-48 sm:h-full' : 'w-full h-48 sm:h-56'
                      }`}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                      <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm">
                        {product.badge[language]}
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
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm sm:text-base">{t.outOfStock}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className={`p-4 sm:p-6 ${viewMode === 'list' ? 'sm:flex-1' : ''}`}>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {product.name[language]}
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
                        ({product.reviews} {t.reviews})
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-600 mb-3 space-y-1">
                      <p>{t.material}: {product.material[language]}</p>
                      <p className="hidden sm:block">{product.dimensions}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {formatPrice(product.price)} {t.da}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-500 line-through">
                          {formatPrice(product.originalPrice)} {t.da}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm "
                        disabled={!product.inStock}
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-2  " />
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
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 sm:mt-12 flex justify-center">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-600 text-xs sm:text-sm px-2 sm:px-3">
                {t.previous}
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 sm:px-4">1</Button>
              <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-600 px-3 sm:px-4">2</Button>
              <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-600 px-3 sm:px-4">3</Button>
              <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-600 text-xs sm:text-sm px-2 sm:px-3">
                {t.next}
              </Button>
            </div>
          </div>
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