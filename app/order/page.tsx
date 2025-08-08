'use client';

import { useState, useTransition, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ShoppingCart, 
  User, 
  MapPin, 
  ArrowLeft,
  CheckCircle,
  Truck,
  Phone,
  Menu,
  X,
  TreePine
} from 'lucide-react';
import Link from 'next/link';
import { createOrder } from '../../lib/action/order-actions'; // Import your server action

const orderSteps = [
  { id: 1, name: 'Informations', icon: User },
  { id: 2, name: 'Livraison', icon: Truck },
  { id: 3, name: 'Confirmation', icon: CheckCircle }
];

const wilayaOptions = [
  { value: 'alger', label: 'Alger', price: 0 },
  { value: 'oran', label: 'Oran', price: 0 },
  { value: 'blida', label: 'Blida', price: 1000 },
  { value: 'boumerdes', label: 'Boumerdes', price: 2000 },
  { value: 'bejaia', label: 'Bejaia', price: 3000 }
];

function OrderPageContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [orderResult, setOrderResult] = useState<any>(null);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const searchParams = useSearchParams();
  
  // Check if this is a cart order or single product order
  const isCartOrder = searchParams.get('cart') === '1';
  
  // Get URL parameters for single product (fallback)
  const productId = searchParams.get('product') || '';
  const quantity = parseInt(searchParams.get('quantity') || '1');
  const finish = searchParams.get('finish') || 'natural';
  const dimensions = searchParams.get('dimensions') || '{"length":180,"width":90,"height":75}';
  const urlPrice = parseInt(searchParams.get('price') || '89900');

  const [orderData, setOrderData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    wilaya: '',
  });

  // Initialize products based on order type
  useEffect(() => {
  if (isCartOrder) {
    // Handle multiple products from cart
    const totalProducts = parseInt(searchParams.get('total_products') || '0');
    const cartProducts = [];
    let calculatedTotal = 0;
    
    for (let i = 0; i < totalProducts; i++) {
      const product = {
        id: searchParams.get(`product_${i}`) || '',
        quantity: parseInt(searchParams.get(`quantity_${i}`) || '1'),
        finish: searchParams.get(`finish_${i}`) || 'natural',
        dimensions: searchParams.get(`dimensions_${i}`) || '180x95x75 cm',
        price: parseInt(searchParams.get(`price_${i}`) || '89900')
      };
      
      cartProducts.push(product);
      calculatedTotal += product.price * product.quantity;
    }
    
    setProducts(cartProducts);
    setTotalPrice(calculatedTotal);
  } else {
    // Handle single product - use price from URL
    const singleProduct = {
      id: productId,
      quantity: quantity,
      finish: finish,
      dimensions: dimensions,
      price: urlPrice // Use the price from URL
    };
    
    setProducts([singleProduct]);
    setTotalPrice(urlPrice * quantity); // Calculate total using URL price
  }
}, [searchParams, isCartOrder, productId, quantity, finish, dimensions, urlPrice]);

  const selectedWilaya = wilayaOptions.find(w => w.value === orderData.wilaya);
  const deliveryPrice = selectedWilaya?.price || 0;
  const finalTotal = totalPrice + deliveryPrice;

  const handleInputChange = (field: string, value: string) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitOrder = () => {
    startTransition(async () => {
      const formData = new FormData();
      
      // Add customer info
      formData.append('firstName', orderData.firstName);
      formData.append('lastName', orderData.lastName);
      formData.append('phone', orderData.phone);
      formData.append('wilaya', orderData.wilaya);
      
      // Add cart indicator
      formData.append('isCart', isCartOrder.toString());
      
      if (isCartOrder) {
        // Add multiple products data
        formData.append('products', JSON.stringify(products));
      } else {
        // Add single product data (existing logic)
        formData.append('productId', productId);
        formData.append('quantity', quantity.toString());
        formData.append('finish', finish);
        formData.append('dimensions', dimensions);
      }

      const result = await createOrder(formData);
      
      if (result.success) {
        setOrderResult(result);
        setCurrentStep(3);
        
        // Clear cart if it was a cart order
        if (isCartOrder) {
          localStorage.removeItem('cart');
        }
      } else {
        alert('Erreur lors de la création de la commande: ' + result.error);
      }
    });
  };

  // Validation for steps
  const isStep1Valid = orderData.firstName && orderData.lastName && orderData.phone;
  const isStep2Valid = orderData.wilaya;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/products" className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Retour aux produits</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <TreePine className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                DariMeuble
              </span>
            </div>

            <div className="sm:hidden">
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
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 sm:space-x-8 overflow-x-auto">
            {orderSteps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step.id 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-600 text-white' 
                    : 'border-slate-300 text-slate-400'
                }`}>
                  <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className={`ml-2 font-medium text-xs sm:text-sm ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-slate-400'
                }`}>
                  {step.name}
                </span>
                {index < orderSteps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 ml-2 sm:ml-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Customer Information */}
            {currentStep === 1 && (
              <Card className="border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Informations Personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-slate-700">Prénom *</Label>
                      <Input
                        id="firstName"
                        value={orderData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="border-slate-300 focus:border-blue-600"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-slate-700">Nom *</Label>
                      <Input
                        id="lastName"
                        value={orderData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="border-slate-300 focus:border-blue-600"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-slate-700">Téléphone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="phone"
                        value={orderData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10 border-slate-300 focus:border-blue-600"
                        placeholder="0555 123 456"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Delivery Information */}
            {currentStep === 2 && (
              <Card className="border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Informations de Livraison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="wilaya" className="text-slate-700">Wilaya *</Label>
                    <Select value={orderData.wilaya} onValueChange={(value) => handleInputChange('wilaya', value)}>
                      <SelectTrigger className="border-slate-300 focus:border-blue-600">
                        <SelectValue placeholder="Choisir votre wilaya" />
                      </SelectTrigger>
                      <SelectContent>
                        {wilayaOptions.map((wilaya) => (
                          <SelectItem key={wilaya.value} value={wilaya.value}>
                            {wilaya.label} {wilaya.price > 0 ? `(+${wilaya.price} DA)` : '(Gratuit)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedWilaya && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center text-sm text-blue-800">
                        <Truck className="h-4 w-4 mr-2" />
                        Livraison à {selectedWilaya.label}: {selectedWilaya.price === 0 ? 'Gratuite' : `${selectedWilaya.price} DA`}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <Card className="border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Confirmation de Commande
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-green-50 rounded-lg p-6 text-center">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-800 mb-2">
                      Commande Confirmée !
                    </h3>
                    <p className="text-green-700 mb-4">
                      Votre commande a été enregistrée avec succès.
                    </p>
                    {orderResult && (
                      <div className="text-sm text-green-600">
                        <p>Numéro de commande: <strong>{orderResult.orderNumber}</strong></p>
                        <p>Code de suivi: <strong>{orderResult.trackingCode}</strong></p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-800">Récapitulatif de votre commande :</h4>
                    <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Client:</span>
                        <span>{orderData.firstName} {orderData.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Téléphone:</span>
                        <span>{orderData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wilaya:</span>
                        <span>{selectedWilaya?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Articles:</span>
                        <span>{products.reduce((sum, p) => sum + p.quantity, 0)} article(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-semibold">{finalTotal / 100} DA</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => window.location.href = '/products'}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3"
                  >
                    Continuer vos Achats
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            {currentStep < 3 && (
              <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1 || isPending}
                  className="border-slate-300 text-slate-700 order-2 sm:order-1"
                >
                  Précédent
                </Button>
                <Button
                  onClick={currentStep === 2 ? submitOrder : nextStep}
                  disabled={
                    isPending || 
                    (currentStep === 1 && !isStep1Valid) || 
                    (currentStep === 2 && !isStep2Valid)
                  }
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white order-1 sm:order-2"
                >
                  {isPending ? 'Traitement...' : currentStep === 2 ? 'Confirmer la Commande' : 'Suivant'}
                </Button>
              </div>
            )}
          </div>

          {/* Updated Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-slate-200 shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <ShoppingCart className="h-5 w-5 mr-2 text-blue-600" />
                  Récapitulatif
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Display all products */}
                
                <div className="space-y-3">
                  {products.map((product, index) => (
                    <div key={index} className="flex items-center space-x-3 pb-3 border-b border-slate-100 last:border-b-0">
                      <div className="w-12 h-12 bg-slate-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800 text-sm">
                          {isCartOrder ? `Produit ${index + 1}` : 'Table en Chêne Rustique'}
                        </h4>
                        <p className="text-xs text-slate-600">
                          Quantité: {product.quantity}
                        </p>
                        <p className="text-xs text-slate-600">
                          Finition: {product.finish}
                        </p>
                        <div className="text-sm font-medium text-slate-800 mt-1">
                          {new Intl.NumberFormat('fr-DZ', {
                            style: 'decimal',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(product.price * product.quantity)} DA
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2 pt-4 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      Produits ({products.reduce((sum, p) => sum + p.quantity, 0)})
                    </span>
                    <span className="text-slate-800">
                      {new Intl.NumberFormat('fr-DZ', {
                        style: 'decimal',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(totalPrice)} DA
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Livraison</span>
                    <span className="text-slate-800">
                      {deliveryPrice === 0 ? 'Gratuit' : `${deliveryPrice} DA`}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-slate-200">
                    <span className="text-slate-800">Total</span>
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {new Intl.NumberFormat('fr-DZ', {
                        style: 'decimal',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(finalTotal)} DA
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 mt-4">
                  <div className="flex items-center text-sm text-blue-800">
                    <Truck className="h-4 w-4 mr-2" />
                    Paiement à la livraison
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Chargement de votre commande...</p>
        </div>
      </div>
    }>
      <OrderPageContent />
    </Suspense>
  );
}