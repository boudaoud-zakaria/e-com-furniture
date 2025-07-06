'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  ShoppingCart, 
  User, 
  MapPin, 
  CreditCard,
  TreePine,
  ArrowLeft,
  CheckCircle,
  Package,
  Truck,
  Calendar,
  Phone,
  Mail,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';

const orderSteps = [
  { id: 1, name: 'Informations', icon: User },
  { id: 2, name: 'Livraison', icon: Truck },
  { id: 3, name: 'Paiement', icon: CreditCard },
  { id: 4, name: 'Confirmation', icon: CheckCircle }
];

export default function OrderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [orderData, setOrderData] = useState({
    // Customer Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Delivery Info
    address: '',
    city: '',
    postalCode: '',
    deliveryDate: '',
    deliveryTime: '',
    specialInstructions: '',
    
    // Product Customization
    dimensions: { length: 180, width: 90, height: 75 },
    finish: 'natural',
    quantity: 1,
    
    // Payment
    paymentMethod: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const productPrice = 899;
  const deliveryPrice = 25;
  const totalPrice = (productPrice * orderData.quantity) + deliveryPrice;

  const handleInputChange = (field: string, value: string) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitOrder = () => {
    console.log('Order submitted:', orderData);
    alert('Commande confirmée ! Vous recevrez un email de confirmation.');
  };

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
                BoisCraft
              </span>
            </div>

            {/* Mobile Menu Button */}
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
                      <Label htmlFor="firstName" className="text-slate-700">Prénom</Label>
                      <Input
                        id="firstName"
                        value={orderData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="border-slate-300 focus:border-blue-600"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-slate-700">Nom</Label>
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
                    <Label htmlFor="email" className="text-slate-700">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={orderData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10 border-slate-300 focus:border-blue-600"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-slate-700">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="phone"
                        value={orderData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10 border-slate-300 focus:border-blue-600"
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
                    <Label htmlFor="address" className="text-slate-700">Adresse</Label>
                    <Input
                      id="address"
                      value={orderData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="border-slate-300 focus:border-blue-600"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-slate-700">Ville</Label>
                      <Input
                        id="city"
                        value={orderData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="border-slate-300 focus:border-blue-600"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode" className="text-slate-700">Code Postal</Label>
                      <Input
                        id="postalCode"
                        value={orderData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        className="border-slate-300 focus:border-blue-600"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deliveryDate" className="text-slate-700">Date de Livraison Souhaitée</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="deliveryDate"
                          type="date"
                          value={orderData.deliveryDate}
                          onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                          className="pl-10 border-slate-300 focus:border-blue-600"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="deliveryTime" className="text-slate-700">Créneau Horaire</Label>
                      <Select value={orderData.deliveryTime} onValueChange={(value) => handleInputChange('deliveryTime', value)}>
                        <SelectTrigger className="border-slate-300 focus:border-blue-600">
                          <SelectValue placeholder="Choisir un créneau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Matin (8h-12h)</SelectItem>
                          <SelectItem value="afternoon">Après-midi (14h-18h)</SelectItem>
                          <SelectItem value="evening">Soirée (18h-20h)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="specialInstructions" className="text-slate-700">Instructions Spéciales</Label>
                    <Textarea
                      id="specialInstructions"
                      value={orderData.specialInstructions}
                      onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                      className="border-slate-300 focus:border-blue-600"
                      placeholder="Étage, code d'accès, instructions particulières..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <Card className="border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800">
                    <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                    Informations de Paiement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-slate-700">Méthode de Paiement</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <button
                        onClick={() => handleInputChange('paymentMethod', 'card')}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          orderData.paymentMethod === 'card'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <CreditCard className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <div className="text-sm font-medium">Carte Bancaire</div>
                      </button>
                      <button
                        onClick={() => handleInputChange('paymentMethod', 'transfer')}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          orderData.paymentMethod === 'transfer'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Package className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <div className="text-sm font-medium">Virement</div>
                      </button>
                    </div>
                  </div>

                  {orderData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber" className="text-slate-700">Numéro de Carte</Label>
                        <Input
                          id="cardNumber"
                          value={orderData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                          className="border-slate-300 focus:border-blue-600"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate" className="text-slate-700">Date d'Expiration</Label>
                          <Input
                            id="expiryDate"
                            value={orderData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                            className="border-slate-300 focus:border-blue-600"
                            placeholder="MM/AA"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv" className="text-slate-700">CVV</Label>
                          <Input
                            id="cvv"
                            value={orderData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value)}
                            className="border-slate-300 focus:border-blue-600"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {orderData.paymentMethod === 'transfer' && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-800 mb-2">Informations de Virement</h4>
                      <div className="space-y-1 text-sm text-slate-600">
                        <p><strong>IBAN:</strong> FR76 1234 5678 9012 3456 7890 123</p>
                        <p><strong>BIC:</strong> BOUSFRPPXXX</p>
                        <p><strong>Bénéficiaire:</strong> BoisCraft SARL</p>
                        <p><strong>Référence:</strong> Commande #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
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
                    <p className="text-green-700">
                      Votre commande a été enregistrée avec succès. Vous recevrez un email de confirmation dans quelques minutes.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-800">Récapitulatif de votre commande :</h4>
                    <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Client:</span>
                        <span>{orderData.firstName} {orderData.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span>{orderData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Adresse:</span>
                        <span>{orderData.address}, {orderData.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Livraison:</span>
                        <span>{orderData.deliveryDate} - {orderData.deliveryTime}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => window.location.href = '/'}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3"
                  >
                    Retour à l'Accueil
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="border-slate-300 text-slate-700 order-2 sm:order-1"
                >
                  Précédent
                </Button>
                <Button
                  onClick={currentStep === 3 ? submitOrder : nextStep}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white order-1 sm:order-2"
                >
                  {currentStep === 3 ? 'Confirmer la Commande' : 'Suivant'}
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-slate-200 shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <ShoppingCart className="h-5 w-5 mr-2 text-blue-600" />
                  Récapitulatif
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
                  <div>
                    <h4 className="font-medium text-slate-800">Table en Chêne Rustique</h4>
                    <p className="text-sm text-slate-600">
                      {orderData.dimensions.length}×{orderData.dimensions.width}×{orderData.dimensions.height} cm
                    </p>
                    <p className="text-sm text-slate-600">Finition: {orderData.finish}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Produit (×{orderData.quantity})</span>
                    <span className="text-slate-800">{productPrice * orderData.quantity}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Livraison</span>
                    <span className="text-slate-800">{deliveryPrice}€</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-slate-200">
                    <span className="text-slate-800">Total</span>
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {totalPrice}€
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 mt-4">
                  <div className="flex items-center text-sm text-blue-800">
                    <Truck className="h-4 w-4 mr-2" />
                    Livraison estimée: 2-3 semaines
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