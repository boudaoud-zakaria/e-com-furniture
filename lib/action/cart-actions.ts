'use server';

import { prisma } from '@/lib/prisma'; // Adjust import path as needed

export async function getCartProducts(productIds: string[]) {
  try {
    if (!productIds || productIds.length === 0) {
      return [];
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds
        },
        isActive: true
      },
      include: {
        category: true,
        customizations: true,
        reviews: {
          include: {
            user: true
          }
        }
      }
    });

    // Transform the data to match your frontend structure
    return products.map(product => ({
      id: product.id,
      name: {
        fr: product.name,
        ar: product.nameAr,
        en: product.nameEn
      },
      price: product.price,
      originalPrice: product.originalPrice || product.price * 1.3,
      images: JSON.parse(product.images || '[]'),
      rating: product.rating,
      reviews: product.reviewCount,
      category: product.categoryId,
      material: {
        fr: product.material,
        ar: product.materialAr,
        en: product.materialEn
      },
      description: {
        fr: product.description,
        ar: product.descriptionAr,
        en: product.descriptionEn
      },
      inStock: product.stock > 0,
      stock: product.stock
    }));
  } catch (error) {
    console.error('Error fetching cart products:', error);
    throw new Error('Failed to fetch cart products');
  }
}
