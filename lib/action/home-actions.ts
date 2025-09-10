'use server'

import { PrismaClient } from '@prisma/client';

// Singleton pattern
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Cache for static data
let categoriesCache: any[] | null = null;
let priceRangeCache: { min: number; max: number } | null = null;
let materialsCache: string[] | null = null;

// Fetch ALL products at once (no filtering, no pagination)
export async function fetchAllProducts() {
  try {
    console.log("Fetching ALL products...");

    const products = await prisma.product.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        nameAr: true,
        nameEn: true,
        description: true,
        price: true,
        originalPrice: true,
        categoryId: true,
        material: true,
        dimensions: true,
        images: true,
        rating: true,
        reviewCount: true,
        stock: true,
        salesCount: true,
        isFeatured: true,
        isActive: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return products;

  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
}

// Fetch categories (with caching)
export async function fetchCategories() {
  if (categoriesCache) {
    return categoriesCache;
  }

  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        nameAr: true,
        nameEn: true,
        image: true,
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

    // return categories;

    categoriesCache = categories.map(category => ({
      id: category.id,
      name: category.name,
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      image: category.image,
      count: category._count.products
    }));

    console.log(`Cached ${categoriesCache.length} categories`);
    return categoriesCache;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Fetch price range (with caching)
export async function fetchPriceRange() {
  if (priceRangeCache) {
    return priceRangeCache;
  }

  try {
    const result = await prisma.product.aggregate({
      where: { isActive: true },
      _min: { price: true },
      _max: { price: true }
    });

    priceRangeCache = {
      min: result._min.price || 0,
      max: result._max.price || 150000
    };

    console.log("Cached price range:", priceRangeCache);
    return priceRangeCache;
  } catch (error) {
    console.error('Error fetching price range:', error);
    return { min: 0, max: 150000 };
  }
}

// Fetch materials (with caching)
export async function fetchMaterials() {
  if (materialsCache) {
    return materialsCache;
  }

  try {
    const products = await prisma.product.findMany({
      where: { 
        isActive: true,
        material: { not: undefined }
      },
      select: { material: true },
      distinct: ['material'],
      take: 10
    });

    materialsCache = products
      .map(p => p.material)
      .filter(Boolean);

    console.log(`Cached ${materialsCache.length} materials`);
    return materialsCache;
  } catch (error) {
    console.error('Error fetching materials:', error);
    return [];
  }
}

// Clear cache function (call when data is updated)
export async function clearCache() {
  categoriesCache = null;
  priceRangeCache = null;
  materialsCache = null;
  console.log("Cache cleared");
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      image: category.image || 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      _count: {
        products: category._count.products
      }
    }));
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
        category: true
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
      }
    }));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}
