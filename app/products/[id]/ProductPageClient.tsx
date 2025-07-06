// Create a new file: ProductPageClient.tsx
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
  Star, 
  ShoppingCart, 
  Heart,
  Share2,
  TreePine,
  ArrowLeft,
  Plus,
  Minus,
  Ruler,
  Palette,
  Package,
  Truck,
  Shield,
  CheckCircle,
  Globe,
  Menu,  // Add this
  X      // Add this
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const productData = {
  1: {
    id: 1,
    name: { fr: 'Table à Manger en Chêne Rustique', ar: 'طاولة طعام من خشب البلوط الريفي', en: 'Rustic Oak Dining Table' },
    price: 89900,
    originalPrice: 129900,
    images: [
      'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTyVyigG2TjOSc6IqHDond5puIsD7ncrcOnw&s'
    ],
    rating: 4.8,
    reviews: 124,
    category: 'tables',
    material: { fr: 'Chêne Massif', ar: 'خشب البلوط الصلب', en: 'Solid Oak' },
    description: {
      fr: 'Cette magnifique table à manger en chêne rustique apportera une touche d\'élégance naturelle à votre salle à manger. Fabriquée à partir de chêne massif de haute qualité, elle est conçue pour durer des générations.',
      ar: 'ستضفي طاولة الطعام الريفية الرائعة هذه من خشب البلوط لمسة من الأناقة الطبيعية على غرفة الطعام الخاصة بك. مصنوعة من خشب البلوط الصلب عالي الجودة، وهي مصممة لتدوم لأجيال.',
      en: 'This beautiful rustic oak dining table will bring a touch of natural elegance to your dining room. Made from high-quality solid oak, it is designed to last for generations.'
    },
    features: {
      fr: ['Chêne massif 100%', 'Finition naturelle', 'Résistant aux rayures', 'Assemblage traditionnel'],
      ar: ['خشب البلوط الصلب 100%', 'تشطيب طبيعي', 'مقاوم للخدوش', 'تجميع تقليدي'],
      en: ['100% Solid Oak', 'Natural Finish', 'Scratch Resistant', 'Traditional Assembly']
    },
    dimensions: {
      length: { min: 120, max: 300, default: 180 },
      width: { min: 70, max: 120, default: 90 },
      height: { min: 70, max: 80, default: 75 }
    },
    finishes: [
      { id: 'natural', name: { fr: 'Naturel', ar: 'طبيعي', en: 'Natural' }, color: '#D2B48C' },
      { id: 'dark', name: { fr: 'Foncé', ar: 'داكن', en: 'Dark' }, color: '#8B4513' },
      { id: 'light', name: { fr: 'Clair', ar: 'فاتح', en: 'Light' }, color: '#F5DEB3' }
    ],
    inStock: true,
    deliveryTime: { fr: '2-3 semaines', ar: '2-3 أسابيع', en: '2-3 weeks' }
  }
};

const translations = {
  fr: {
    backToProducts: 'Retour aux Produits',
    customizeProduct: 'Personnaliser le Produit',
    dimensions: 'Dimensions',
    length: 'Longueur',
    width: 'Largeur',
    height: 'Hauteur',
    finish: 'Finition',
    quantity: 'Quantité',
    addToCart: 'Ajouter au Panier',
    buyNow: 'Acheter Maintenant',
    features: 'Caractéristiques',
    description: 'Description',
    reviews: 'Avis',
    delivery: 'Livraison',
    warranty: 'Garantie',
    inStock: 'En Stock',
    deliveryTime: 'Délai de Livraison',
    freeDelivery: 'Livraison Gratuite',
    yearWarranty: 'Garantie 10 ans',
    handcrafted: 'Fait Main',
    cm: 'cm',
    totalPrice: 'Prix Total',
    customization: 'Personnalisation',
    material: 'Matériau',
    da: 'DA'
  },
  ar: {
    backToProducts: 'العودة للمنتجات',
    customizeProduct: 'تخصيص المنتج',
    dimensions: 'الأبعاد',
    length: 'الطول',
    width: 'العرض',
    height: 'الارتفاع',
    finish: 'التشطيب',
    quantity: 'الكمية',
    addToCart: 'أضف للسلة',
    buyNow: 'اشتري الآن',
    features: 'المميزات',
    description: 'الوصف',
    reviews: 'التقييمات',
    delivery: 'التوصيل',
    warranty: 'الضمان',
    inStock: 'متوفر',
    deliveryTime: 'وقت التوصيل',
    freeDelivery: 'توصيل مجاني',
    yearWarranty: 'ضمان 10 سنوات',
    handcrafted: 'صنع يدوي',
    cm: 'سم',
    totalPrice: 'السعر الإجمالي',
    customization: 'التخصيص',
    material: 'المادة',
    da: 'دج'
  },
  en: {
    backToProducts: 'Back to Products',
    customizeProduct: 'Customize Product',
    dimensions: 'Dimensions',
    length: 'Length',
    width: 'Width',
    height: 'Height',
    finish: 'Finish',
    quantity: 'Quantity',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    features: 'Features',
    description: 'Description',
    reviews: 'Reviews',
    delivery: 'Delivery',
    warranty: 'Warranty',
    inStock: 'In Stock',
    deliveryTime: 'Delivery Time',
    freeDelivery: 'Free Delivery',
    yearWarranty: '10 Year Warranty',
    handcrafted: 'Handcrafted',
    cm: 'cm',
    totalPrice: 'Total Price',
    customization: 'Customization',
    material: 'Material',
    da: 'DA'
  }
};

export default function ProductPageClient({ params }: { params: { id: string } }) {
  const productId = params.id;
  const [language, setLanguage] = useState<'fr' | 'ar' | 'en'>('fr');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedFinish, setSelectedFinish] = useState('natural');
  const [dimensions, setDimensions] = useState({
    length: 180,
    width: 90,
    height: 75
  });
  const [activeTab, setActiveTab] = useState('description');
  const [cart, setCart] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const product = productData[productId as keyof typeof productData];
  const t = translations[language];
  const isRTL = language === 'ar';

  if (!product) {
    return <div>Product not found</div>;
  }

  const calculatePrice = () => {
    const basePrice = product.price;
    const sizeMultiplier = (dimensions.length * dimensions.width) / (180 * 90);
    const finishMultiplier = selectedFinish === 'dark' ? 1.1 : selectedFinish === 'light' ? 1.05 : 1;
    return Math.round(basePrice * sizeMultiplier * finishMultiplier);
  };

  const totalPrice = calculatePrice() * quantity;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const addToCart = () => {
    const cartItem = {
      ...product,
      quantity,
      selectedFinish,
      dimensions,
      customPrice: calculatePrice(),
      id: Date.now()
    };
    setCart(prev => [...prev, cartItem]);
    alert(`${product.name[language]} ajouté au panier!`);
  };

  const buyNow = () => {
    window.location.href = `/order?product=${product.id}&quantity=${quantity}&finish=${selectedFinish}&dimensions=${JSON.stringify(dimensions)}`;
  };

  return (
  <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${isRTL ? 'rtl' : 'ltr'}`}>
    {/* Header */}
    <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Back Button - Hidden on mobile, shown on larger screens */}
          <div className="hidden sm:flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm lg:text-base">{t.backToProducts}</span>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="sm:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          {/* Logo - Centered on mobile */}
          <div className="flex items-center space-x-2 sm:mx-0 mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-2">
              <TreePine className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              BoisCraft
            </span>
          </div>

          {/* Language Switcher - Desktop */}
          <div className="hidden sm:flex items-center space-x-1 lg:space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage('fr')}
              className={`text-xs lg:text-sm ${language === 'fr' ? 'bg-blue-100 text-blue-600' : 'text-slate-600'}`}
            >
              <Globe className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
              FR
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage('ar')}
              className={`text-xs lg:text-sm ${language === 'ar' ? 'bg-blue-100 text-blue-600' : 'text-slate-600'}`}
            >
              AR
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage('en')}
              className={`text-xs lg:text-sm ${language === 'en' ? 'bg-blue-100 text-blue-600' : 'text-slate-600'}`}
            >
              EN
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-4 pb-4 border-t border-slate-200 pt-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">{t.backToProducts}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600 mr-2">Language:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage('fr')}
                  className={`text-xs ${language === 'fr' ? 'bg-blue-100 text-blue-600' : 'text-slate-600'}`}
                >
                  FR
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage('ar')}
                  className={`text-xs ${language === 'ar' ? 'bg-blue-100 text-blue-600' : 'text-slate-600'}`}
                >
                  AR
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage('en')}
                  className={`text-xs ${language === 'en' ? 'bg-blue-100 text-blue-600' : 'text-slate-600'}`}
                >
                  EN
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        {/* Product Images */}
        <div className="order-1 lg:order-1">
          <div className="space-y-3 sm:space-y-4">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-lg sm:shadow-xl">
              <img
                src={product.images[selectedImage]}
                alt={product.name[language]}
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
              />
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs sm:text-sm">
                  {t.inStock}
                </Badge>
              </div>
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex space-x-2">
                <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white p-2 sm:p-3">
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white p-2 sm:p-3">
                  <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-lg flex-shrink-0 ${
                    selectedImage === index ? 'ring-2 ring-blue-600' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name[language]} ${index + 1}`}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="order-2 lg:order-2 space-y-6 lg:space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">
              {product.name[language]}
            </h1>
            
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                  />
                ))}
              </div>
              <span className="text-slate-600 ml-2 text-sm sm:text-base">
                ({product.reviews} {t.reviews})
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {formatPrice(totalPrice)} {t.da}
              </span>
              <span className="text-base sm:text-lg text-slate-500 line-through">
                {formatPrice(product.originalPrice)} {t.da}
              </span>
              <Badge className="bg-red-100 text-red-800 w-fit">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </Badge>
            </div>

            <p className="text-slate-600 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              {product.description[language]}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600 mb-6 sm:mb-8">
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-2 text-blue-600" />
                <span>{t.handcrafted}</span>
              </div>
              <div className="flex items-center">
                <Truck className="h-4 w-4 mr-2 text-green-600" />
                <span>{t.freeDelivery}</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-purple-600" />
                <span>{t.yearWarranty}</span>
              </div>
            </div>
          </div>

          {/* Customization */}
          <Card className="border-slate-200 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6 flex items-center">
                <Ruler className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                {t.customizeProduct}
              </h3>

              <div className="space-y-4 sm:space-y-6">
                {/* Dimensions */}
                <div>
                  <Label className="text-sm sm:text-base font-medium text-slate-700 mb-3 sm:mb-4 block">
                    {t.dimensions}
                  </Label>
                  <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm text-slate-600">{t.length} ({t.cm})</Label>
                      <Slider
                        value={[dimensions.length]}
                        onValueChange={(value) => setDimensions({...dimensions, length: value[0]})}
                        min={120}
                        max={300}
                        step={10}
                        className="mt-2"
                      />
                      <div className="text-center text-xs sm:text-sm text-slate-600">
                        {dimensions.length} {t.cm}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm text-slate-600">{t.width} ({t.cm})</Label>
                      <Slider
                        value={[dimensions.width]}
                        onValueChange={(value) => setDimensions({...dimensions, width: value[0]})}
                        min={70}
                        max={120}
                        step={5}
                        className="mt-2"
                      />
                      <div className="text-center text-xs sm:text-sm text-slate-600">
                        {dimensions.width} {t.cm}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm text-slate-600">{t.height} ({t.cm})</Label>
                      <Slider
                        value={[dimensions.height]}
                        onValueChange={(value) => setDimensions({...dimensions, height: value[0]})}
                        min={70}
                        max={80}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-center text-xs sm:text-sm text-slate-600">
                        {dimensions.height} {t.cm}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Finish */}
                <div>
                  <Label className="text-sm sm:text-base font-medium text-slate-700 mb-3 sm:mb-4 block flex items-center">
                    <Palette className="h-4 w-4 mr-2 text-blue-600" />
                    {t.finish}
                  </Label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                      { id: 'natural', name: { fr: 'Naturel', ar: 'طبيعي', en: 'Natural' }, color: '#D2B48C' },
                      { id: 'dark', name: { fr: 'Foncé', ar: 'داكن', en: 'Dark' }, color: '#8B4513' },
                      { id: 'light', name: { fr: 'Clair', ar: 'فاتح', en: 'Light' }, color: '#F5DEB3' }
                    ].map((finish) => (
                      <button
                        key={finish.id}
                        onClick={() => setSelectedFinish(finish.id)}
                        className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-300 ${
                          selectedFinish === finish.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mx-auto mb-1 sm:mb-2"
                          style={{ backgroundColor: finish.color }}
                        />
                        <div className="text-xs sm:text-sm font-medium text-slate-700">
                          {finish.name[language]}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <Label className="text-sm sm:text-base font-medium text-slate-700 mb-3 sm:mb-4 block">
                    {t.quantity}
                  </Label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="border-slate-300 w-8 h-8 p-0"
                    >
                      <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <span className="text-base sm:text-lg font-medium text-slate-800 min-w-[2rem] sm:min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="border-slate-300 w-8 h-8 p-0"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add to Cart */}
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-slate-100 rounded-lg p-3 sm:p-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-sm sm:text-base">{t.totalPrice}:</span>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {formatPrice(totalPrice)} {t.da}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg" 
                className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-sm sm:text-lg font-semibold"
                onClick={addToCart}
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {t.addToCart}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 text-sm sm:text-lg font-semibold"
                onClick={buyNow}
              >
                {t.buyNow}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="mt-8 sm:mt-12 lg:mt-16">
        {/* Mobile Tab Selector */}
        <div className="sm:hidden mb-6">
          <select 
            value={activeTab} 
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-700"
          >
            <option value="description">{t.description}</option>
            <option value="features">{t.features}</option>
            <option value="reviews">{t.reviews}</option>
            <option value="delivery">{t.delivery}</option>
          </select>
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden sm:flex space-x-1 mb-6 sm:mb-8 overflow-x-auto">
          {['description', 'features', 'reviews', 'delivery'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap text-sm lg:text-base ${
                activeTab === tab ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : ''
              }`}
            >
              {t[tab]}
            </Button>
          ))}
        </div>

        <Card className="border-slate-200 shadow-lg">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-3 sm:mb-4">{t.description}</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {product.description[language]}
                </p>
                <div className="mt-4 sm:mt-6">
                  <h4 className="font-medium text-slate-800 mb-2 text-sm sm:text-base">{t.material}:</h4>
                  <p className="text-slate-600 text-sm sm:text-base">{product.material[language]}</p>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6">{t.features}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {product.features[language].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                      <span className="text-slate-700 text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6">{t.reviews}</h3>
                <div className="space-y-4 sm:space-y-6">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b border-slate-200 pb-4 sm:pb-6">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="ml-2 font-medium text-slate-800 text-sm sm:text-base">Client {review}</span>
                      </div>
                      <p className="text-slate-600 text-sm sm:text-base">
                        Excellent produit, très bien fini et livraison rapide. Je recommande !
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6">{t.delivery}</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-3">
                    <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    <span className="text-slate-700 text-sm sm:text-base">{t.freeDelivery}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    <span className="text-slate-700 text-sm sm:text-base">{t.deliveryTime}: {product.deliveryTime[language]}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                    <span className="text-slate-700 text-sm sm:text-base">{t.yearWarranty}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>

    <style jsx>{`
      .rtl {
        direction: rtl;
      }
      
      @media (max-width: 640px) {
        .overflow-x-auto {
          scrollbar-width: thin;
          scrollbar-color: #e2e8f0 transparent;
        }
        
        .overflow-x-auto::-webkit-scrollbar {
          height: 4px;
        }
        
        .overflow-x-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background-color: #e2e8f0;
          border-radius: 2px;
        }
      }
    `}</style>
  </div>
);
}