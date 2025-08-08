'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  TreePine,
  Package,
  Truck,
  CreditCard,
  Heart,
  X,
  Menu,
  Shield,
  Clock,
  Star
} from 'lucide-react';
import { useTransition } from 'react';
import { getCartProducts } from '../../lib/action/cart-actions';
import Link from 'next/link';

const translations = {
  fr: {
    shoppingCart: 'Panier d\'Achat',
    emptyCart: 'Votre panier est vide',
    emptyCartDesc: 'Ajoutez des produits à votre panier pour commencer vos achats',
    continueShopping: 'Continuer les Achats',
    quantity: 'Quantité',
    price: 'Prix',
    total: 'Total',
    subtotal: 'Sous-total',
    shipping: 'Livraison',
    tax: 'TVA',
    orderTotal: 'Total Commande',
    proceedToCheckout: 'Procéder au Paiement',
    removeItem: 'Supprimer l\'article',
    updateCart: 'Mettre à jour le panier',
    freeShipping: 'Livraison Gratuite',
    estimatedTax: 'TVA Estimée',
    cartSummary: 'Résumé du Panier',
    saveForLater: 'Sauvegarder pour plus tard',
    moveToWishlist: 'Ajouter à la liste de souhaits',
    da: 'DA',
    items: 'articles',
    promoCode: 'Code Promo',
    enterCode: 'Entrez votre code',
    apply: 'Appliquer',
    secureDelivery: 'Livraison sécurisée',
    freeDelivery: 'Livraison gratuite',
    securePayment: 'Paiement sécurisé',
    inStock: 'En Stock',
    finish: 'Finition',
    dimensions: 'Dimensions'
  },
  ar: {
    shoppingCart: 'سلة التسوق',
    emptyCart: 'سلة التسوق فارغة',
    emptyCartDesc: 'أضف منتجات إلى سلتك لبدء التسوق',
    continueShopping: 'متابعة التسوق',
    quantity: 'الكمية',
    price: 'السعر',
    total: 'المجموع',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    tax: 'الضريبة',
    orderTotal: 'إجمالي الطلب',
    proceedToCheckout: 'المتابعة للدفع',
    removeItem: 'إزالة العنصر',
    updateCart: 'تحديث السلة',
    freeShipping: 'شحن مجاني',
    estimatedTax: 'ضريبة مقدرة',
    cartSummary: 'ملخص السلة',
    saveForLater: 'حفظ لوقت لاحق',
    moveToWishlist: 'إضافة لقائمة الأمنيات',
    da: 'دج',
    items: 'عناصر',
    promoCode: 'كود الخصم',
    enterCode: 'أدخل الكود',
    apply: 'تطبيق',
    secureDelivery: 'توصيل آمن',
    freeDelivery: 'توصيل مجاني',
    securePayment: 'دفع آمن',
    inStock: 'متوفر',
    finish: 'اللمسة الأخيرة',
    dimensions: 'الأبعاد'
  },
  en: {
    shoppingCart: 'Shopping Cart',
    emptyCart: 'Your cart is empty',
    emptyCartDesc: 'Add products to your cart to start shopping',
    continueShopping: 'Continue Shopping',
    quantity: 'Quantity',
    price: 'Price',
    total: 'Total',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    tax: 'Tax',
    orderTotal: 'Order Total',
    proceedToCheckout: 'Proceed to Checkout',
    removeItem: 'Remove item',
    updateCart: 'Update cart',
    freeShipping: 'Free Shipping',
    estimatedTax: 'Estimated Tax',
    cartSummary: 'Cart Summary',
    saveForLater: 'Save for later',
    moveToWishlist: 'Move to wishlist',
    da: 'DA',
    items: 'items',
    promoCode: 'Promo Code',
    enterCode: 'Enter your code',
    apply: 'Apply',
    secureDelivery: 'Secure delivery',
    freeDelivery: 'Free delivery',
    securePayment: 'Secure payment',
    inStock: 'In Stock',
    finish: 'Finish',
    dimensions: 'Dimensions'
  }
};


export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [language, setLanguage] = useState('fr');
  const [promoCode, setPromoCode] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const t = translations[language];
  const isRTL = language === 'ar';

  useEffect(() => {
    const loadCartData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get cart items from localStorage
        const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
        
        if (cartData.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }
        
        // Extract product IDs
        const productIds = [...new Set(cartData.map((item: any) => item.id))];
        
        // Fetch product details using server action
        startTransition(async () => {
          try {
            const products = await getCartProducts(productIds);
            
            // Merge cart data with product details
            const mergedCartItems = cartData.map((cartItem: any) => {
              const product = products.find(p => p.id === cartItem.id);
              
              if (!product) return null;
              
              return {
                id: cartItem.id,
                name: product.name,
                price: cartItem.price || product.price, // Use custom price if available
                image: product.images[0] || '/placeholder-image.jpg',
                quantity: cartItem.quantity,
                customizations: {
                  finish: cartItem.finish || 'Natural',
                  dimensions: typeof cartItem.dimensions === 'string' 
                    ? cartItem.dimensions 
                    : `${cartItem.dimensions?.length || 180}x${cartItem.dimensions?.width || 90}x${cartItem.dimensions?.height || 75} cm`
                },
                inStock: product.inStock,
                rating: product.rating,
                reviews: product.reviews,
                stock: product.stock
              };
            }).filter(Boolean); // Remove null items
            
            setCartItems(mergedCartItems);
          } catch (err) {
            console.error('Error loading cart:', err);
            setError('Failed to load cart items');
          }
        });
      } catch (err) {
        console.error('Error parsing cart data:', err);
        setError('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    loadCartData();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const updateQuantity = (id: any, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    // Update state
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    
    // Update localStorage
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cartData.map((item: any) => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id: any) => {
    // Update state
    setCartItems(items => items.filter(item => item.id !== id));
    
    // Update localStorage
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cartData.filter((item: any) => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const tax = Math.round(subtotal * 0.19); // 19% VAT
  const total = subtotal + shipping + tax;

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const proceedToCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Create URL parameters for multiple products
    const urlParams = new URLSearchParams();
    
    // Add cart indicator
    urlParams.append('cart', '1');
    
    // Add each product's data
    cartItems.forEach((item, index) => {
      urlParams.append(`product_${index}`, item.id);
      urlParams.append(`quantity_${index}`, item.quantity.toString());
      urlParams.append(`finish_${index}`, item.customizations.finish);
      urlParams.append(`dimensions_${index}`, item.customizations.dimensions);
      urlParams.append(`price_${index}`, item.price.toString());
    });
    
    // Add total number of products
    urlParams.append('total_products', cartItems.length.toString());
    
    // Add language
    urlParams.append('language', language);
    
    // Navigate to order page with all cart data
    window.location.href = `/order?${urlParams.toString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors p-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline text-sm font-medium">{t.continueShopping}</span>
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-2 shadow-lg">
                  <TreePine className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  DariMeuble
                </span>
              </div>

              <div className="flex items-center space-x-1">
                {['fr', 'ar', 'en'].map((lang) => (
                  <Button
                    key={lang}
                    variant="ghost"
                    size="sm"
                    onClick={() => setLanguage(lang)}
                    className={`text-xs px-2 py-1 ${language === lang ? 'bg-blue-100 text-blue-600' : 'text-slate-600'}`}
                  >
                    {lang.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full p-6 sm:p-8 w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8">
              <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-blue-600 mx-auto" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">{t.emptyCart}</h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8">{t.emptyCartDesc}</p>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold shadow-lg">
              {t.continueShopping}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors p-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-medium"><Link href="/products">{t.continueShopping}</Link></span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-2 shadow-lg">
                <TreePine className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                DariMeuble
              </span>
            </div>

            <div className="flex items-center space-x-1">
              {['fr', 'ar', 'en'].map((lang) => (
                <Button
                  key={lang}
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage(lang)}
                  className={`text-xs px-2 py-1 ${language === lang ? 'bg-blue-100 text-blue-600' : 'text-slate-600'}`}
                >
                  {lang.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">{t.shoppingCart}</h1>
          <div className="flex items-center justify-between">
            <p className="text-slate-600 text-sm sm:text-base">
              {totalItems} {t.items}
            </p>
            <div className="flex items-center space-x-2">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                {t.freeShipping}
              </div>
            </div>
          </div>
        </div>

        <div className="grid xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="xl:col-span-2">
            <div className="space-y-4 sm:space-y-6">
              {cartItems.map((item) => (
                <Card key={item.id} className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                      {/* Product Image */}
                      <div className="relative w-full lg:w-40 h-40 lg:h-32 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name[language]}
                          className="w-full h-full object-cover rounded-lg"
                          loading="lazy"
                        />
                        <div className="absolute top-2 right-2 lg:hidden">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="bg-white/80 hover:bg-white text-slate-600 hover:text-red-600 p-1 rounded-full"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2 leading-tight">
                              {item.name[language]}
                            </h3>
                            
                            {/* Rating */}
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(item.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-slate-600">
                                {item.rating} ({item.reviews} avis)
                              </span>
                            </div>

                            {/* Customizations */}
                            <div className="text-sm text-slate-600 space-y-1">
                              <p><span className="font-medium">{t.finish}:</span> {item.customizations.finish}</p>
                              <p><span className="font-medium">{t.dimensions}:</span> {item.customizations.dimensions}</p>
                            </div>
                            
                            <div className="flex items-center mt-2">
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                {t.inStock}
                              </Badge>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                              {formatPrice(item.price)} {t.da}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                              Prix unitaire
                            </div>
                          </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-slate-600 font-medium">{t.quantity}:</span>
                            <div className="flex items-center space-x-2 bg-slate-50 rounded-lg p-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0 hover:bg-slate-200"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="text-lg font-medium text-slate-800 min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0 hover:bg-slate-200"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-600 hover:text-blue-600 text-xs sm:text-sm"
                            >
                              <Heart className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">{t.saveForLater}</span>
                            </Button> */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-slate-600 hover:text-red-600 text-xs sm:text-sm hidden lg:flex"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              {t.removeItem}
                            </Button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="border-t border-slate-200 pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 font-medium">{t.total}:</span>
                            <span className="text-xl sm:text-2xl font-bold text-slate-800">
                              {formatPrice(item.price * item.quantity)} {t.da}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
            
          {/* Order Summary */}
          <div className="xl:col-span-1">
            <Card className="border-slate-200 shadow-lg sticky top-24">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="text-slate-800 text-lg sm:text-xl">{t.cartSummary}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">{t.subtotal}:</span>
                  <span className="text-slate-800 font-medium">{formatPrice(subtotal)} {t.da}</span>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-800">{t.orderTotal}:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {formatPrice(subtotal)} {t.da}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="border-t border-slate-200 pt-6">
                <Button 
                  onClick={proceedToCheckout}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-base sm:text-lg font-semibold shadow-lg"
                  disabled={cartItems.length === 0}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  {t.proceedToCheckout}
                </Button>
              </div>

              {/* Security Features - Keep only these */}
              <div className="border-t border-slate-200 pt-6">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Truck className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-slate-700">{t.freeDelivery}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <CreditCard className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-slate-700">{t.securePayment}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        .rtl {
          direction: rtl;
        }
        .rtl .space-x-2 > * + * {
          margin-left: 0;
          margin-right: 0.5rem;
        }
        .rtl .space-x-3 > * + * {
          margin-left: 0;
          margin-right: 0.75rem;
        }
      `}</style>
    </div>
  );
}