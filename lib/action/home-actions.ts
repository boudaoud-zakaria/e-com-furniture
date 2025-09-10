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

    console.log(`Fetched ${products.length} products`);

    // Format products
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      categoryId: product.categoryId,
      images: product.images,
      rating: product.rating || 4.0,
      reviewCount: product.reviewCount || 0,
      stock: product.stock || 0,
      material: product.material,
      dimensions: product.dimensions,
      salesCount: product.salesCount || 0,
      isFeatured: product.isFeatured,
      isActive: product.isActive
    }));

    return formattedProducts;

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
