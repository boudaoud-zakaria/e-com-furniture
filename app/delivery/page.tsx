'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Truck, 
  Clock, 
  DollarSign,
  TreePine,
  ArrowLeft,
  CheckCircle,
  Package,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';

const deliveryZones = [
  { id: 'paris', name: 'Paris Centre', price: 0, time: '1-2 jours', color: 'green' },
  { id: 'idf', name: 'Île-de-France', price: 25, time: '2-3 jours', color: 'blue' },
  { id: 'north', name: 'Nord de la France', price: 45, time: '3-4 jours', color: 'yellow' },
  { id: 'south', name: 'Sud de la France', price: 55, time: '4-5 jours', color: 'orange' },
  { id: 'east', name: 'Est de la France', price: 50, time: '3-4 jours', color: 'purple' },
  { id: 'west', name: 'Ouest de la France', price: 50, time: '3-4 jours', color: 'pink' },
  { id: 'corsica', name: 'Corse', price: 85, time: '5-7 jours', color: 'red' },
  { id: 'international', name: 'International', price: 150, time: '7-14 jours', color: 'gray' }
];

const deliveryServices = [
  {
    id: 'standard',
    name: 'Livraison Standard',
    description: 'Livraison à domicile avec rendez-vous',
    icon: Truck,
    included: ['Livraison à domicile', 'Appel 24h avant', 'Déballage inclus']
  },
  {
    id: 'premium',
    name: 'Livraison Premium',
    description: 'Livraison + installation + évacuation emballages',
    icon: Package,
    price: 75,
    included: ['Tout service standard', 'Installation complète', 'Évacuation emballages', 'Garantie installation']
  },
  {
    id: 'express',
    name: 'Livraison Express',
    description: 'Livraison en 24-48h (selon zone)',
    icon: Clock,
    price: 125,
    included: ['Livraison prioritaire', 'Créneau 2h', 'Installation incluse', 'Service weekend']
  }
];

export default function DeliveryPage() {
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedService, setSelectedService] = useState('standard');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getZoneFromPostalCode = (code: string) => {
    const num = parseInt(code.substring(0, 2));
    if (code.startsWith('75') || code.startsWith('92') || code.startsWith('93') || code.startsWith('94')) return 'paris';
    if (num >= 77 && num <= 95) return 'idf';
    if (num >= 59 && num <= 62 || num >= 80 && num <= 82) return 'north';
    if (num >= 13 && num <= 84) return 'south';
    if (num >= 67 && num <= 90) return 'east';
    if (num >= 22 && num <= 56) return 'west';
    if (code.startsWith('20')) return 'corsica';
    return 'idf';
  };

  const handlePostalCodeChange = (code: string) => {
    setPostalCode(code);
    if (code.length === 5) {
      const zone = getZoneFromPostalCode(code);
      setSelectedZone(zone);
    }
  };

  const selectedZoneData = deliveryZones.find(zone => zone.id === selectedZone);
  const selectedServiceData = deliveryServices.find(service => service.id === selectedService);
  
  const totalDeliveryPrice = (selectedZoneData?.price || 0) + (selectedServiceData?.price || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Retour à l'accueil</span>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-4">
            Livraison & Installation
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Découvrez nos options de livraison et calculez les frais pour votre zone
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Address Form */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Votre Adresse de Livraison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="postalCode" className="text-slate-700">Code Postal</Label>
                <Input
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => handlePostalCodeChange(e.target.value)}
                  placeholder="75001"
                  className="border-slate-300 focus:border-blue-600"
                  maxLength={5}
                />
              </div>
              
              <div>
                <Label htmlFor="address" className="text-slate-700">Adresse Complète</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Rue de la Paix, Paris"
                  className="border-slate-300 focus:border-blue-600"
                />
              </div>

              {selectedZoneData && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-800">{selectedZoneData.name}</h3>
                      <p className="text-sm text-slate-600">Délai: {selectedZoneData.time}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {selectedZoneData.price === 0 ? 'Gratuit' : `${selectedZoneData.price}€`}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery Services */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <Truck className="h-5 w-5 mr-2 text-blue-600" />
                Type de Livraison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {deliveryServices.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    selectedService === service.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <service.icon className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <h3 className="font-medium text-slate-800">{service.name}</h3>
                        <p className="text-sm text-slate-600">{service.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-800">
                        {service.price ? `+${service.price}€` : 'Inclus'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {service.included.map((item, index) => (
                      <div key={index} className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Delivery Zones Map */}
        <Card className="border-slate-200 shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-800">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Zones de Livraison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {deliveryZones.map((zone) => (
                <div
                  key={zone.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    selectedZone === zone.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setSelectedZone(zone.id)}
                >
                  <h3 className="font-medium text-slate-800 mb-2">{zone.name}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Prix:</span>
                      <span className="font-medium text-slate-800">
                        {zone.price === 0 ? 'Gratuit' : `${zone.price}€`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Délai:</span>
                      <span className="font-medium text-slate-800">{zone.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Total Summary */}
        {selectedZoneData && selectedServiceData && (
          <Card className="border-slate-200 shadow-lg mt-8">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                Récapitulatif Livraison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Zone: {selectedZoneData.name}</span>
                  <span className="font-medium text-slate-800">
                    {selectedZoneData.price === 0 ? 'Gratuit' : `${selectedZoneData.price}€`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Service: {selectedServiceData.name}</span>
                  <span className="font-medium text-slate-800">
                    {selectedServiceData.price ? `${selectedServiceData.price}€` : 'Inclus'}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-slate-800">Total Livraison:</span>
                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {totalDeliveryPrice === 0 ? 'Gratuit' : `${totalDeliveryPrice}€`}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-slate-600 mt-2">
                  Délai estimé: {selectedZoneData.time}
                </div>
              </div>
              
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3"
                disabled={!postalCode || !address}
              >
                Confirmer l'Adresse de Livraison
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}