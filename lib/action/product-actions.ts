'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        customizations: true,
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  } finally {
    await prisma.$disconnect();
  }
}

export async function addToCartAction(productData: {
  productId: string;
  productName: string;
  quantity: number;
  selectedFinish: string;
  dimensions: { length: number; width: number; height: number };
  customPrice: number;
  totalPrice: number;
}) {
  try {
    // Here you would typically save to database if user is logged in
    // For now, we'll just return success
    console.log('Adding to cart:', productData);
    
    // You can add database logic here later, for example:
    // - Save to cart table if user is logged in
    // - Update stock if needed
    // - Log the action
    
    return { 
      success: true, 
      message: 'Product added to cart!',
      data: productData
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return {
      success: false,
      message: 'Failed to add product to cart'
    };
  }
}

// Add this function to your product-actions.ts file

export async function addReview(reviewData: {
  userId?: string; // Optional for guest users
  productId: string;
  rating: number;
  comment?: string;
  customerName?: string; // For guest users
  customerEmail?: string; // For guest users
}) {
  try {
    let review;
    
    if (reviewData.userId) {
      // For registered users - check if they already reviewed
      const existingReview = await prisma.review.findUnique({
        where: {
          userId_productId: {
            userId: reviewData.userId,
            productId: reviewData.productId
          }
        }
      });

      if (existingReview) {
        return {
          success: false,
          message: 'You have already reviewed this product'
        };
      }

      review = await prisma.review.create({
        data: {
          userId: reviewData.userId,
          productId: reviewData.productId,
          rating: reviewData.rating,
          comment: reviewData.comment || '',
          isVerified: false
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });
    } else {
      // For guest users, create a temporary user account or handle differently
      // Option 1: Create a temporary user (recommended)
      const tempUser = await prisma.user.create({
        data: {
          email: reviewData.customerEmail || `guest-${Date.now()}@temp.local`,
          firstName: reviewData.customerName?.split(' ')[0] || 'Guest',
          lastName: reviewData.customerName?.split(' ').slice(1).join(' ') || 'User',
          phone: null,
          role: 'CUSTOMER'
        }
      });

      review = await prisma.review.create({
        data: {
          userId: tempUser.id,
          productId: reviewData.productId,
          rating: reviewData.rating,
          comment: reviewData.comment || '',
          isVerified: false
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });
    }

    // Update product rating and review count
    const allReviews = await prisma.review.findMany({
      where: { productId: reviewData.productId }
    });
    
    const averageRating = allReviews.length > 0 
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length 
      : 0;

    await prisma.product.update({
      where: { id: reviewData.productId },
      data: {
        rating: averageRating,
        reviewCount: allReviews.length
      }
    });

    return {
      success: true,
      message: 'Review added successfully!',
      data: review
    };
  } catch (error) {
    console.error('Error adding review:', error);
    return {
      success: false,
      message: 'Failed to add review'
    };
  } finally {
    await prisma.$disconnect();
  }
}