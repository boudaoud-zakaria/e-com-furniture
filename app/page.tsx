'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Search, 
  User, 
  Menu, 
  ChevronRight, 
  Star,
  ArrowRight,
  TreePine,
  Hammer,
  Truck,
  Shield,
  Globe,
  X
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  { id: 'tables', name: { fr: 'Tables', ar: 'طاولات', en: 'Tables' }, image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', count: 24 },
  { id: 'chairs', name: { fr: 'Chaises', ar: 'كراسي', en: 'Chairs' }, image: 'https://cocktail-scandinave.fr/wp-content/uploads/2023/04/NIWECH3-amb.jpg', count: 18 },
  { id: 'cabinets', name: { fr: 'Armoires', ar: 'خزائن', en: 'Cabinets' }, image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', count: 15 },
  { id: 'beds', name: { fr: 'Lits', ar: 'أسرة', en: 'Beds' }, image: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', count: 12 },
  { id: 'shelves', name: { fr: 'Étagères', ar: 'أرفف', en: 'Shelves' }, image: 'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', count: 20 },
  { id: 'desks', name: { fr: 'Bureaux', ar: 'مكاتب', en: 'Desks' }, image: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', count: 9 }
];

const featuredProducts = [
  {
    id: 1,
    name: { fr: 'Table à Manger en Chêne Rustique', ar: 'طاولة طعام من خشب البلوط الريفي', en: 'Rustic Oak Dining Table' },
    price: 89900,
    originalPrice: 129900,
    image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=500&h=400',
    rating: 4.8,
    reviews: 124,
    badge: { fr: 'Meilleure Vente', ar: 'الأكثر مبيعاً', en: 'Best Seller' }
  },
  {
    id: 2,
    name: { fr: 'Armoire Moderne en Noyer', ar: 'خزانة حديثة من خشب الجوز', en: 'Modern Walnut Cabinet' },
    price: 64900,
    originalPrice: 84900,
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=500&h=400',
    rating: 4.9,
    reviews: 87,
    badge: { fr: 'Nouveau', ar: 'جديد', en: 'New' }
  },
  {
    id: 3,
    name: { fr: 'Chaise de Travail Ergonomique', ar: 'كرسي عمل مريح', en: 'Ergonomic Work Chair' },
    price: 29900,
    originalPrice: 39900,
    image: 'https://media.but.fr/images_produits/p-xl/0033616060076_AMB1.jpg',
    rating: 4.7,
    reviews: 203,
    badge: { fr: 'Promotion', ar: 'تخفيض', en: 'Sale' }
  }
];

const translations = {
  fr: {
    brandName: 'BoisCraft',
    tagline: 'Meubles en Bois Artisanaux',
    heroTitle: 'Meubles en Bois',
    heroSubtitle: 'Artisanaux',
    heroDescription: 'Découvrez notre collection de meubles en bois premium, fabriqués avec soin et conçus pour durer des générations.',
    shopNow: 'Acheter Maintenant',
    viewCatalog: 'Voir le Catalogue',
    happyCustomers: 'Clients Satisfaits',
    yearsExperience: 'Années d\'Expérience',
    products: 'Produits',
    whyChoose: 'Pourquoi Choisir BoisCraft?',
    whyChooseDesc: 'Nous combinons l\'artisanat traditionnel avec un design moderne pour créer des meubles qui résistent à l\'épreuve du temps.',
    handcrafted: 'Artisanal',
    handcraftedDesc: 'Chaque pièce est soigneusement fabriquée par des artisans qualifiés',
    sustainable: 'Durable',
    sustainableDesc: 'Nous utilisons du bois premium d\'origine responsable',
    freeDelivery: 'Livraison Gratuite',
    freeDeliveryDesc: 'Service de livraison et d\'installation gratuit',
    warranty: 'Garantie',
    warrantyDesc: 'Garantie de 10 ans sur tous nos produits',
    browseCategories: 'Parcourir par Catégorie',
    browseCategoriesDesc: 'Explorez notre large gamme de catégories de meubles en bois',
    featuredProducts: 'Produits Vedettes',
    featuredProductsDesc: 'Découvrez nos pièces de mobilier en bois artisanal les plus populaires',
    addToCart: 'Ajouter au Panier',
    buyNow: 'Acheter Maintenant',
    viewCollection: 'Voir la Collection',
    reviews: 'avis',
    quickLinks: 'Liens Rapides',
    customerService: 'Service Client',
    connect: 'Connecter',
    phone: 'Téléphone',
    email: 'Email',
    address: 'Adresse',
    allRightsReserved: 'Tous droits réservés',
    da: 'DA'
  },
  ar: {
    brandName: 'وود كرافت',
    tagline: 'أثاث خشبي مصنوع يدوياً',
    heroTitle: 'أثاث خشبي',
    heroSubtitle: 'مصنوع يدوياً',
    heroDescription: 'اكتشف مجموعتنا من الأثاث الخشبي المميز، المصنوع بعناية والمصمم ليدوم لأجيال.',
    shopNow: 'تسوق الآن',
    viewCatalog: 'عرض الكتالوج',
    happyCustomers: 'عميل سعيد',
    yearsExperience: 'سنة خبرة',
    products: 'منتج',
    whyChoose: 'لماذا تختار وود كرافت؟',
    whyChooseDesc: 'نحن نجمع بين الحرفية التقليدية والتصميم الحديث لإنشاء أثاث يصمد أمام اختبار الزمن.',
    handcrafted: 'مصنوع يدوياً',
    handcraftedDesc: 'كل قطعة مصنوعة بعناية من قبل حرفيين مهرة',
    sustainable: 'مستدام',
    sustainableDesc: 'نستخدم خشب مميز من مصادر مسؤولة',
    freeDelivery: 'توصيل مجاني',
    freeDeliveryDesc: 'خدمة توصيل وتركيب مجانية',
    warranty: 'ضمان',
    warrantyDesc: 'ضمان 10 سنوات على جميع منتجاتنا',
    browseCategories: 'تصفح حسب الفئة',
    browseCategoriesDesc: 'استكشف مجموعتنا الواسعة من فئات الأثاث الخشبي',
    featuredProducts: 'المنتجات المميزة',
    featuredProductsDesc: 'اكتشف قطع الأثاث الخشبي المصنوع يدوياً الأكثر شعبية',
    addToCart: 'أضف للسلة',
    buyNow: 'اشتري الآن',
    viewCollection: 'عرض المجموعة',
    reviews: 'تقييم',
    quickLinks: 'روابط سريعة',
    customerService: 'خدمة العملاء',
    connect: 'تواصل',
    phone: 'هاتف',
    email: 'بريد إلكتروني',
    address: 'عنوان',
    allRightsReserved: 'جميع الحقوق محفوظة',
    da: 'دج'
  },
  en: {
    brandName: 'WoodCraft',
    tagline: 'Handcrafted Wooden Furniture',
    heroTitle: 'Handcrafted',
    heroSubtitle: 'Wooden Furniture',
    heroDescription: 'Discover our collection of premium wooden furniture, handcrafted with care and designed to last generations.',
    shopNow: 'Shop Now',
    viewCatalog: 'View Catalog',
    happyCustomers: 'Happy Customers',
    yearsExperience: 'Years Experience',
    products: 'Products',
    whyChoose: 'Why Choose WoodCraft?',
    whyChooseDesc: 'We combine traditional craftsmanship with modern design to create furniture that stands the test of time.',
    handcrafted: 'Handcrafted',
    handcraftedDesc: 'Each piece is carefully crafted by skilled artisans',
    sustainable: 'Sustainable',
    sustainableDesc: 'We use responsibly sourced premium wood',
    freeDelivery: 'Free Delivery',
    freeDeliveryDesc: 'Complimentary delivery and setup service',
    warranty: 'Warranty',
    warrantyDesc: '10-year warranty on all our products',
    browseCategories: 'Browse by Category',
    browseCategoriesDesc: 'Explore our wide range of wooden furniture categories',
    featuredProducts: 'Featured Products',
    featuredProductsDesc: 'Discover our most popular handcrafted wooden furniture pieces',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    viewCollection: 'View Collection',
    reviews: 'reviews',
    quickLinks: 'Quick Links',
    customerService: 'Customer Service',
    connect: 'Connect',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    allRightsReserved: 'All rights reserved',
    da: 'DA'
  }
};

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'ar' | 'en'>('fr');
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [cart, setCart] = useState<any[]>([]);

  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach(section => observer.observe(section));

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const isRTL = language === 'ar';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const addToCart = (product: any) => {
    setCart(prev => [...prev, { ...product, quantity: 1, id: Date.now() }]);
    alert(`${product.name[language]} ajouté au panier!`);
  };

  const buyNow = (product: any) => {
    window.location.href = `/order?product=${product.id}`;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-2">
                <TreePine className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t.brandName}
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/products" className="text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">
                {t.products}
              </Link>
              <Link href="/" className="text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">
                Catégories
              </Link>
              <Link href="/" className="text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">
                À Propos
              </Link>
              <Link href="/" className="text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">
                Contact
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Globe className="h-4 w-4 mr-1" />
                  {language.toUpperCase()}
                </Button>
                {isMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 py-2 min-w-[120px]">
                    <button
                      onClick={() => { setLanguage('fr'); setIsMenuOpen(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-blue-50 text-slate-700"
                    >
                      Français
                    </button>
                    <button
                      onClick={() => { setLanguage('ar'); setIsMenuOpen(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-blue-50 text-slate-700"
                    >
                      العربية
                    </button>
                    <button
                      onClick={() => { setLanguage('en'); setIsMenuOpen(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-blue-50 text-slate-700"
                    >
                      English
                    </button>
                  </div>
                )}
              </div>

              <Button variant="ghost" size="sm" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                <User className="h-4 w-4" />
              </Button>
              <Link href={'/card'}  className="text-slate-700 hover:text-blue-600 hover:bg-blue-50 relative">
                <ShoppingCart className="h-4 w-4" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs">
                    {cart.length}
                  </Badge>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-purple-600/10" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
          <div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * -0.2}px)` }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              className="space-y-8 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="space-y-6">
                <div className="inline-block">
                  <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-sm font-medium">
                    {t.tagline}
                  </Badge>
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    {t.heroTitle}
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {t.heroSubtitle}
                  </span>
                </h1>
                <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                  {t.heroDescription}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={()=>{window.location.href ='/products'}} 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  {t.shopNow}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:border-blue-600 hover:text-blue-600"
                >
                  {t.viewCatalog}
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">500+</div>
                  <div className="text-sm text-slate-600">{t.happyCustomers}</div>
                </div>
                <div className="text-center transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">15+</div>
                  <div className="text-sm text-slate-600">{t.yearsExperience}</div>
                </div>
                <div className="text-center transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">100+</div>
                  <div className="text-sm text-slate-600">{t.products}</div>
                </div>
              </div>
            </div>

            <div 
              className="relative animate-fade-in-right"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-3xl blur-3xl transform rotate-6" />
              <div className="relative bg-white/20 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30">
                <Image
                  src="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600&h=400"
                  alt="Premium wooden furniture"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features"
        data-animate
        className={`py-24 bg-white transition-all duration-1000 ${
          isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
              {t.whyChoose}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {t.whyChooseDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Hammer, title: t.handcrafted, desc: t.handcraftedDesc, delay: '0.1s' },
              { icon: TreePine, title: t.sustainable, desc: t.sustainableDesc, delay: '0.2s' },
              { icon: Truck, title: t.freeDelivery, desc: t.freeDeliveryDesc, delay: '0.3s' },
              { icon: Shield, title: t.warranty, desc: t.warrantyDesc, delay: '0.4s' }
            ].map((feature, index) => (
              <div 
                key={index}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: feature.delay }}
              >
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-6 w-20 h-20 mx-auto mb-6 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300 transform group-hover:scale-110">
                  <feature.icon className="h-8 w-8 text-blue-600 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section 
        id="categories"
        data-animate
        className={`py-24 bg-gradient-to-br from-slate-50 to-blue-50 transition-all duration-1000 ${
          isVisible.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
              {t.browseCategories}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {t.browseCategoriesDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card 
                key={category.id} 
                className="group cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white transform hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-xl">
                    <Image
                      src={category.image}
                      alt={category.name[language]}
                      width={400}
                      height={300}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        {category.count} items
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                      {category.name[language]}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-medium">{t.viewCollection}</span>
                      <ChevronRight className="h-5 w-5 text-blue-600 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section 
        id="featured"
        data-animate
        className={`py-24 bg-white transition-all duration-1000 ${
          isVisible.featured ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
              {t.featuredProducts}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {t.featuredProductsDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="group cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50 transform hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-xl">
                    <Image
                      src={product.image}
                      alt={product.name[language]}
                      width={400}
                      height={300}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        {product.badge[language]}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                      {product.name[language]}
                    </h3>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-600 ml-2">
                        ({product.reviews} {t.reviews})
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {formatPrice(product.price)} {t.da}
                        </span>
                        <span className="text-sm text-slate-500 line-through">
                          {formatPrice(product.originalPrice)} {t.da}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transform hover:scale-105 transition-all duration-300"
                        onClick={() => addToCart(product)}
                      >
                        {t.addToCart}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                        onClick={() => buyNow(product)}
                      >
                        {t.buyNow}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-2">
                  <TreePine className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">{t.brandName}</span>
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                {t.tagline}
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">{t.quickLinks}</h4>
              <ul className="space-y-3 text-slate-300">
                <li><Link href="/products" className="hover:text-white transition-colors duration-300">{t.products}</Link></li>
                <li><Link href="/categories" className="hover:text-white transition-colors duration-300">Catégories</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors duration-300">À Propos</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors duration-300">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">{t.customerService}</h4>
              <ul className="space-y-3 text-slate-300">
                <li><Link href="/delivery" className="hover:text-white transition-colors duration-300">Livraison</Link></li>
                <li><Link href="/returns" className="hover:text-white transition-colors duration-300">Retours</Link></li>
                <li><Link href="/warranty" className="hover:text-white transition-colors duration-300">Garantie</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors duration-300">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">{t.connect}</h4>
              <ul className="space-y-3 text-slate-300">
                <li>{t.phone}: +213 555 123 456</li>
                <li>{t.email}: info@boiscraft.dz</li>
                <li>{t.address}: 123 Rue du Meuble, Alger</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 {t.brandName}. {t.allRightsReserved}</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
          opacity: 0;
        }

        .rtl {
          direction: rtl;
        }

        .rtl .space-x-3 > * + * {
          margin-left: 0;
          margin-right: 0.75rem;
        }

        .rtl .space-x-4 > * + * {
          margin-left: 0;
          margin-right: 1rem;
        }

        .rtl .space-x-8 > * + * {
          margin-left: 0;
          margin-right: 2rem;
        }
      `}</style>
    </div>
  );
}