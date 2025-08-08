'use server'

import { prisma } from '@/lib/prisma'
import { Product, Category, Review, ProductCustomization } from '@prisma/client'

// Types for enhanced data structures
export type ProductWithDetails = Product & {
  category: Category
  reviews: Review[]
  customizations: ProductCustomization[]
  _count: {
    reviews: number
    orderItems: number
  }
}

export type CategoryWithCount = Category & {
  _count: {
    products: number
  }
}

// ============================================================================
// PRODUCT FUNCTIONS
// ============================================================================

/**
 * Get all products with filtering, sorting, and pagination
 */
export async function getProducts(params: {
  search?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'popularity' | 'price-low' | 'price-high' | 'rating' | 'name'
  page?: number
  limit?: number
  language?: 'fr' | 'ar' | 'en'
}) {
  const {
    search,
    categoryId,
    minPrice = 0,
    maxPrice = 999999999,
    sortBy = 'popularity',
    page = 1,
    limit = 12,
    language = 'fr'
  } = params

  try {
    const where: any = {
      isActive: true,
      price: {
        gte: minPrice,
        lte: maxPrice
      }
    }

    // Add search filter
    if (search) {
      const searchFields = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { nameAr: { contains: search, mode: 'insensitive' } },
          { nameEn: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { descriptionAr: { contains: search, mode: 'insensitive' } },
          { descriptionEn: { contains: search, mode: 'insensitive' } }
        ]
      }
      where.AND = [searchFields]
    }

    // Add category filter
    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId
    }

    // Define sorting
    let orderBy: any = {}
    switch (sortBy) {
      case 'price-low':
        orderBy = { price: 'asc' }
        break
      case 'price-high':
        orderBy = { price: 'desc' }
        break
      case 'rating':
        orderBy = { rating: 'desc' }
        break
      case 'name':
        orderBy = language === 'ar' ? { nameAr: 'asc' } : 
                  language === 'en' ? { nameEn: 'asc' } : 
                  { name: 'asc' }
        break
      default: // popularity
        orderBy = { salesCount: 'desc' }
        break
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: true,
          reviews: {
            take: 5,
            orderBy: { createdAt: 'desc' }
          },
          customizations: true,
          _count: {
            select: {
              reviews: true,
              orderItems: true
            }
          }
        }
      }),
      prisma.product.count({ where })
    ])

    return {
      products: products as ProductWithDetails[],
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products')
  }
}

/**
 * Get a single product by ID with all details
 */
export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id, isActive: true },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        customizations: true,
        _count: {
          select: {
            reviews: true,
            orderItems: true
          }
        }
      }
    })

    if (!product) {
      throw new Error('Product not found')
    }

    return product as ProductWithDetails
  } catch (error) {
    console.error('Error fetching product:', error)
    throw new Error('Failed to fetch product')
  }
}

/**
 * Get featured products for homepage
 */
export async function getFeaturedProducts(limit: number = 8) {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true
      },
      orderBy: {
        salesCount: 'desc'
      },
      take: limit,
      include: {
        category: true,
        reviews: {
          take: 3,
          orderBy: { createdAt: 'desc' }
        },
        customizations: true,
        _count: {
          select: {
            reviews: true,
            orderItems: true
          }
        }
      }
    })

    return products as ProductWithDetails[]
  } catch (error) {
    console.error('Error fetching featured products:', error)
    throw new Error('Failed to fetch featured products')
  }
}

/**
 * Get related products based on category
 */
export async function getRelatedProducts(productId: string, categoryId: string, limit: number = 4) {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        categoryId,
        id: { not: productId }
      },
      orderBy: {
        salesCount: 'desc'
      },
      take: limit,
      include: {
        category: true,
        reviews: {
          take: 3,
          orderBy: { createdAt: 'desc' }
        },
        customizations: true,
        _count: {
          select: {
            reviews: true,
            orderItems: true
          }
        }
      }
    })

    return products as ProductWithDetails[]
  } catch (error) {
    console.error('Error fetching related products:', error)
    throw new Error('Failed to fetch related products')
  }
}

// ============================================================================
// CATEGORY FUNCTIONS
// ============================================================================

/**
 * Get all active categories with product counts
 */
export async function getCategories() {
  try {
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
    })

    return categories as CategoryWithCount[]
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id, isActive: true },
      include: {
        _count: {
          select: {
            products: {
              where: { isActive: true }
            }
          }
        }
      }
    })

    if (!category) {
      throw new Error('Category not found')
    }

    return category as CategoryWithCount
  } catch (error) {
    console.error('Error fetching category:', error)
    throw new Error('Failed to fetch category')
  }
}

// ============================================================================
// SEARCH AND FILTER FUNCTIONS
// ============================================================================

/**
 * Get price range for products (min and max prices)
 */
export async function getPriceRange(categoryId?: string) {
  try {
    const where: any = { isActive: true }
    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId
    }

    const result = await prisma.product.aggregate({
      where,
      _min: { price: true },
      _max: { price: true }
    })

    return {
      min: result._min.price || 0,
      max: result._max.price || 150000
    }
  } catch (error) {
    console.error('Error fetching price range:', error)
    return { min: 0, max: 150000 }
  }
}

/**
 * Get available materials for filtering
 */
export async function getMaterials(language: 'fr' | 'ar' | 'en' = 'fr') {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: {
        material: true,
        materialAr: true,
        materialEn: true
      },
      distinct: ['material']
    })

    const materialField = language === 'ar' ? 'materialAr' : 
                         language === 'en' ? 'materialEn' : 
                         'material'

    return products.map(p => p[materialField]).filter(Boolean)
  } catch (error) {
    console.error('Error fetching materials:', error)
    return []
  }
}

/**
 * Search products with autocomplete suggestions
 */
export async function searchProducts(query: string, language: 'fr' | 'ar' | 'en' = 'fr', limit: number = 5) {
  try {
    if (!query || query.length < 2) {
      return []
    }

    const searchField = language === 'ar' ? 'nameAr' : 
                       language === 'en' ? 'nameEn' : 
                       'name'

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        [searchField]: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        name: true,
        nameAr: true,
        nameEn: true,
        price: true,
        images: true
      },
      take: limit,
      orderBy: {
        salesCount: 'desc'
      }
    })

    return products
  } catch (error) {
    console.error('Error searching products:', error)
    return []
  }
}

// ============================================================================
// WISHLIST FUNCTIONS (for registered users)
// ============================================================================

/**
 * Add product to wishlist
 */
export async function addToWishlist(userId: string, productId: string, customizations?: string) {
  try {
    const wishlistItem = await prisma.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId
        }
      },
      update: {
        customizations
      },
      create: {
        userId,
        productId,
        customizations
      }
    })

    return wishlistItem
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    throw new Error('Failed to add to wishlist')
  }
}

/**
 * Remove product from wishlist
 */
export async function removeFromWishlist(userId: string, productId: string) {
  try {
    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    throw new Error('Failed to remove from wishlist')
  }
}

/**
 * Get user's wishlist
 */
export async function getUserWishlist(userId: string) {
  try {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            _count: {
              select: {
                reviews: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return wishlistItems
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    throw new Error('Failed to fetch wishlist')
  }
}

// ============================================================================
// REVIEW FUNCTIONS
// ============================================================================

/**
 * Get reviews for a product
 */
export async function getProductReviews(productId: string, page: number = 1, limit: number = 10) {
  try {
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.review.count({ where: { productId } })
    ])

    return {
      reviews,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    throw new Error('Failed to fetch reviews')
  }
}

/**
 * Add a review for a product
 */
export async function addProductReview(userId: string, productId: string, rating: number, comment?: string) {
  try {
    // Check if user has purchased this product
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: 'DELIVERED'
        }
      }
    })

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment,
        isVerified: !!hasPurchased
      }
    })

    // Update product rating
    await updateProductRating(productId)

    return review
  } catch (error) {
    console.error('Error adding review:', error)
    throw new Error('Failed to add review')
  }
}

/**
 * Update product rating based on reviews
 */
async function updateProductRating(productId: string) {
  try {
    const result = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true }
    })

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: result._avg.rating || 0,
        reviewCount: result._count.rating || 0
      }
    })
  } catch (error) {
    console.error('Error updating product rating:', error)
  }
}

// ============================================================================