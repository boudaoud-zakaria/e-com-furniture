'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// Get manager data with products and orders
export async function getManagerData(managerId: string) {
  try {
    const manager = await prisma.manager.findUnique({
      where: { id: managerId },
      include: {
        user: true,
        category: true,
        orders: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        product: {
          include: {
            category: true,
            reviews: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!manager) {
      throw new Error('Manager not found');
    }

    return manager;
  } catch (error) {
    console.error('Error fetching manager data:', error);
    throw error;
  }
}

// Get manager statistics
export async function getManagerStats(managerId: string) {
  try {
    const [totalOrders, pendingOrders, completedOrders, totalProducts] = await Promise.all([
      prisma.order.count({
        where: { managerId }
      }),
      prisma.order.count({
        where: { 
          managerId,
          status: { in: ['PENDING', 'CONFIRMED'] }
        }
      }),
      prisma.order.count({
        where: { 
          managerId,
          status: 'DELIVERED'
        }
      }),
      prisma.product.count({
        where: { managerId }
      })
    ]);

    const urgentOrders = await prisma.order.count({
      where: {
        managerId,
        priority: { in: ['HIGH', 'URGENT'] },
        status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] }
      }
    });

    const lowStockProducts = await prisma.product.count({
      where: {
        managerId,
        stock: { lte: 5 }
      }
    });

    const outOfStockProducts = await prisma.product.count({
      where: {
        managerId,
        stock: 0
      }
    });

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalProducts,
      urgentOrders,
      lowStockProducts,
      outOfStockProducts
    };
  } catch (error) {
    console.error('Error fetching manager stats:', error);
    throw error;
  }
}

// Create new product
export async function createProduct(managerId: string, productData: {
  name: string;
  nameAr: string;
  nameEn: string;
  description: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  material: string;
  materialAr: string;
  materialEn: string;
  dimensions: string;
  images: string[];
  stock: number;
  isFeatured?: boolean;
}) {
  try {
    const { categoryId, ...restProductData } = productData;
    
    // Validate managerId is provided
    if (!managerId) {
      throw new Error('Manager ID is required');
    }

    // Verify manager exists
    const manager = await prisma.manager.findUnique({
      where: { id: managerId }
    });

    if (!manager) {
      throw new Error('Manager not found');
    }

    const product = await prisma.product.create({
      data: {
        ...restProductData,
        managerId,
        images: JSON.stringify(productData.images),
        price: Math.round(productData.price * 100), // Convert to centimes
        originalPrice: productData.originalPrice ? Math.round(productData.originalPrice * 100) : null,
        categoryId,
      },
      include: {
        category: true,
        manager: true,
        reviews: true
      }
    });

    revalidatePath(`/dashboard/manager/${managerId}`);
    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}
// Update product
export async function updateProduct(productId: string, managerId: string, productData: Partial<{
  name: string;
  nameAr: string;
  nameEn: string;
  description: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  material: string;
  materialAr: string;
  materialEn: string;
  dimensions: string;
  images: string[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
}>) {
  try {
    if (!managerId) {
      throw new Error('Manager ID is required');
    }
    
    const updateData: any = { ...productData };
    
    if (productData.price) {
      updateData.price = Math.round(productData.price * 100);
    }
    
    if (productData.originalPrice) {
      updateData.originalPrice = Math.round(productData.originalPrice * 100);
    }
    
    if (productData.images) {
      updateData.images = JSON.stringify(productData.images);
    }

    const product = await prisma.product.update({
      where: { 
        id: productId,
        managerId // Ensure manager can only update their own products
      },
      data: updateData,
      include: {
        category: true,
        reviews: true
      }
    });

    revalidatePath(`/dashboard/manager/${managerId}`);
    return product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

// Delete product
export async function deleteProduct(productId: string, managerId: string) {
  try {
    if (!managerId) {
      throw new Error('Manager ID is required');
    }
    
    // Check if product has any orders
    const productWithOrders = await prisma.product.findUnique({
      where: { 
        id: productId,
        managerId 
      },
      include: {
        orderItems: true,
        reviews: true,
        wishlistItems: true
      }
    });

    if (!productWithOrders) {
      throw new Error('Product not found or unauthorized');
    }

    // Delete all orders that have relation with this product
    if (productWithOrders.orderItems.length > 0) {
      // Get all unique order IDs that contain this product
      const orderIds = [...new Set(productWithOrders.orderItems.map(item => item.orderId))];
      
      // Delete all orders that contain this product (will cascade delete order items)
      await prisma.order.deleteMany({
        where: { 
          id: { in: orderIds }
        }
      });
    }

    // Proceed with deletion (cascade will handle reviews and wishlist items)
    await prisma.product.delete({
      where: { 
        id: productId,
        managerId 
      }
    });

    revalidatePath(`/dashboard/manager/${managerId}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, managerId: string, status: string, priority?: string) {
  try {
    if (!managerId) {
      throw new Error('Manager ID is required');
    }
    
    const updateData: any = { status };
    if (priority) {
      updateData.priority = priority;
    }

    const order = await prisma.order.update({
      where: { 
        id: orderId,
        managerId // Ensure manager can only update their own orders
      },
      data: updateData,
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    revalidatePath(`/dashboard/manager/${managerId}`);
    return order;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

// Get all categories for product creation
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

}
