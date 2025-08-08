'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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