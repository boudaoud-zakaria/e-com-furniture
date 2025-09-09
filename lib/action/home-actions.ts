'use server';

import { PrismaClient } from '@prisma/client';

// Create a singleton instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Cache for categories (valid for 5 minutes)
let categoriesCache: any = null;
let categoriesCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getCategories() {
  try {
    // Return cached data if still valid
    if (categoriesCache && Date.now() - categoriesCacheTime < CACHE_DURATION) {
      return categoriesCache;
    }

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { 
            products: {
              where: { isActive: true }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      image: category.image || 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      count: category._count.products,
      _count: { products: category._count.products }
    }));

    // Update cache
    categoriesCache = formattedCategories;
    categoriesCacheTime = Date.now();

    return formattedCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { 
        isActive: true, 
        isFeatured: true 
      },
      include: { 
        category: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            nameEn: true
          }
        }
      },
      orderBy: { salesCount: 'desc' },
      take: 6 // Show top 6 featured products
    });

    return products.map(product => ({
      id: product.id,
      name: {
        fr: product.name,
        ar: product.nameAr,
        en: product.nameEn
      },
      price: product.price,
      originalPrice: product.originalPrice || Math.round(product.price * 1.3),
      image: (() => {
        try {
          const images = JSON.parse(product.images || '[]');
          return images[0] || 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=500&h=400';
        } catch {
          return 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=500&h=400';
        }
      })(),
      rating: product.rating,
      reviews: product.reviewCount,
      badge: {
        fr: product.salesCount > 50 ? 'Meilleure Vente' : 'Nouveau',
        ar: product.salesCount > 50 ? 'الأكثر مبيعاً' : 'جديد',
        en: product.salesCount > 50 ? 'Best Seller' : 'New'
      },
      stock: product.stock || 0,
      reviewCount: product.reviewCount || 0,
      dimensions: product.dimensions || 'N/A',
      material: product.material || 'Wood'
    }));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

// Add these additional optimized functions that your store might need

export async function getPriceRange() {
  try {
    const result = await prisma.product.aggregate({
      where: { isActive: true },
      _min: { price: true },
      _max: { price: true }
    });

    return {
      min: result._min.price || 0,
      max: result._max.price || 150000
    };
  } catch (error) {
    console.error('Error fetching price range:', error);
    return { min: 0, max: 150000 };
  }
}

export async function getMaterials(language: 'fr' | 'ar' | 'en' = 'fr') {
  try {
    const products = await prisma.product.findMany({
      where: { 
        isActive: true,
        material: { not: undefined }
      },
      select: { material: true },
      distinct: ['material']
    });

    return products
      .map(p => p.material)
      .filter(Boolean)
      .slice(0, 10); // Limit to 10 materials
  } catch (error) {
    console.error('Error fetching materials:', error);
    return [];
  }
}
