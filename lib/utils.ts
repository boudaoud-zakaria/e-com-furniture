import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Product } from '@prisma/client'

/**
 * Combine class names with tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = 'DA') {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' ' + currency
}

/**
 * Parse JSON fields safely
 */
export function parseJSON(jsonString: string, fallback: any = null) {
  try {
    return JSON.parse(jsonString)
  } catch {
    return fallback
  }
}

/**
 * Get product images array
 */
export function getProductImages(product: Product): string[] {
  return parseJSON(product.images, [])
}

/**
 * Get product dimensions object
 */
export function getProductDimensions(product: Product): { length?: number, width?: number, height?: number } {
  return parseJSON(product.dimensions, {})
}

/**
 * Get localized product name
 */
export function getProductName(product: Product, language: 'fr' | 'ar' | 'en' = 'fr'): string {
  switch (language) {
    case 'ar':
      return product.nameAr || product.name
    case 'en':
      return product.nameEn || product.name
    default:
      return product.name
  }
}

/**
 * Get localized product description
 */
export function getProductDescription(product: Product, language: 'fr' | 'ar' | 'en' = 'fr'): string {
  switch (language) {
    case 'ar':
      return product.descriptionAr || product.description
    case 'en':
      return product.descriptionEn || product.description
    default:
      return product.description
  }
}

/**
 * Get localized material name
 */
export function getProductMaterial(product: Product, language: 'fr' | 'ar' | 'en' = 'fr'): string {
  switch (language) {
    case 'ar':
      return product.materialAr || product.material
    case 'en':
      return product.materialEn || product.material
    default:
      return product.material
  }
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercentage(originalPrice: number, currentPrice: number): number {
  if (!originalPrice || originalPrice <= currentPrice) return 0
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

/**
 * Check if product is on sale
 */
export function isProductOnSale(product: Product): boolean {
  return !!(product.originalPrice && product.originalPrice > product.price)
}

/**
 * Get product badge text
 */
export function getProductBadge(product: Product, language: 'fr' | 'ar' | 'en' = 'fr'): string {
  if (product.isFeatured) {
    return { fr: 'Vedette', ar: 'مميز', en: 'Featured' }[language]
  }
  if (isProductOnSale(product)) {
    return { fr: 'Promotion', ar: 'تخفيض', en: 'Sale' }[language]
  }
  if (product.salesCount > 50) {
    return { fr: 'Populaire', ar: 'شائع', en: 'Popular' }[language]
  }
  return { fr: 'Nouveau', ar: 'جديد', en: 'New' }[language]
}