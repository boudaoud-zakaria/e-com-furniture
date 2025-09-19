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

// Types for better type safety
interface ProductFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}

interface ProductsResponse {
  products: any[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// 🚀 NEW: Optimized product fetching with server-side filtering and pagination
export async function fetchProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  try {
    const {
      search = '',
      categoryId = 'all',
      minPrice = 0,
      maxPrice = 999999,
      sortBy = 'popularity',
      page = 1,
      limit = 12
    } = filters;

    console.log('🔍 Server-side filtering with:', filters);

    // Build where clause
    const where: any = {
      isActive: true,
      price: {
        gte: minPrice,
        lte: maxPrice
      }
    };

    // Category filter
    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }

    // Search filter
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { nameAr: { contains: searchTerm, mode: 'insensitive' } },
        { nameEn: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { material: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' };
    switch (sortBy) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'name':
        orderBy = { name: 'asc' };
        break;
      default: // popularity
        orderBy = { salesCount: 'desc' };
        break;
    }

    // Execute queries in parallel
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
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
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    console.log(`✅ Found ${totalCount} products, showing page ${page}/${totalPages}`);

    return {
      products,
      totalCount,
      totalPages,
      currentPage: page
    };

  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return {
      products: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1
    };
  }
}

// 🚀 NEW: Get initial data for the page (categories, price range, etc.)
export async function getInitialData() {
  try {
    console.log('🔄 Loading initial data...');
    
    const [categories, priceRange, materials] = await Promise.all([
      fetchCategories(),
      fetchPriceRange(),
      fetchMaterials()
    ]);

    return {
      categories,
      priceRange,
      materials
    };
  } catch (error) {
    console.error('❌ Error loading initial data:', error);
    return {
      categories: [],
      priceRange: { min: 0, max: 150000 },
      materials: []
    };
  }
}

// 🚀 NEW: Get categories with product counts (optimized)
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
      productCount: category._count.products
    }));

    console.log(`✅ Cached ${categoriesCache.length} categories`);
    return categoriesCache;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
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

    console.log("✅ Cached price range:", priceRangeCache);
    return priceRangeCache;
  } catch (error) {
    console.error('❌ Error fetching price range:', error);
    return { min: 0, max: 150000 };
  }
}

// Fetch materials (with caching)
// Fetch materials (with caching) - FIXED VERSION
export async function fetchMaterials() {
  if (materialsCache) {
    return materialsCache;
  }

  try {
    const products = await prisma.product.findMany({
      where: { 
        isActive: true,
        // Since material is required (String, not String?), we filter for non-empty strings
        material: { 
          not: "",  // Changed from null to empty string
          // Alternative: you could also use { notIn: ["", " "] } to exclude empty and whitespace
        }
      },
      select: { material: true },
      distinct: ['material'],
      take: 20
    });

    materialsCache = products
      .map(p => p.material)
      .filter(material => material && material.trim() !== '') // Extra safety filter
      .filter(Boolean) as string[];

    console.log(`✅ Cached ${materialsCache.length} materials`);
    return materialsCache;
  } catch (error) {
    console.error('❌ Error fetching materials:', error);
    return [];
  }
}

// Clear cache function
export async function clearCache() {
  categoriesCache = null;
  priceRangeCache = null;
  materialsCache = null;
  console.log("🗑️ Cache cleared");
}

// Keep existing functions for backward compatibility
export async function fetchAllProducts() {
  console.log('⚠️ Warning: fetchAllProducts is deprecated. Use fetchProducts() instead.');
  const result = await fetchProducts({ limit: 1000 });
  return result.products;
}

export async function getCategories() {
  return fetchCategories();
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
      take: 6
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
    console.error('❌ Error fetching featured products:', error);
    return [];
  }
}
