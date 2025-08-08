// /model/admin.ts
"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Dashboard Overview Data
export async function getDashboardStats() {
  try {
    const [totalOrders, totalProducts, activeManagers, totalRevenue] = await Promise.all([
      // Total Orders
      prisma.order.count(),
      
      // Total Products
      prisma.product.count({
        where: { isActive: true }
      }),
      
      // Active Managers
      prisma.manager.count({
        where: { isActive: true }
      }),
      
      // Total Revenue (sum of all delivered orders)
      prisma.order.aggregate({
        where: { 
          status: 'DELIVERED',
          paymentStatus: 'PAID'
        },
        _sum: { totalAmount: true }
      })
    ]);

    const inactiveManagers = await prisma.manager.count({
      where: { isActive: false }
    });

    return {
      success: true,
      data: {
        totalOrders,
        totalProducts,
        activeManagers,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        inactiveManagers
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      success: false,
      error: 'Failed to fetch dashboard stats'
    };
  }
}

// Recent Activity
export async function getRecentActivity() {
  try {
    const [recentManagers, recentOrders, recentProducts] = await Promise.all([
      // Recent managers
      prisma.manager.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          category: true
        }
      }),
      
      // Recent orders
      prisma.order.findMany({
        take: 3,
        orderBy: { updatedAt: 'desc' },
        include: {
          manager: {
            include: { user: true }
          }
        }
      }),
      
      // Recent products
      prisma.product.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true
        }
      })
    ]);

    const activities = [
      ...recentManagers.map(manager => ({
        id: `manager-${manager.id}`,
        type: 'manager',
        message: `Nouveau gestionnaire ${manager.user.firstName} ${manager.user.lastName} ajouté pour la catégorie ${manager.category.name}`,
        timestamp: manager.createdAt,
        color: 'green'
      })),
      
      ...recentOrders.map(order => ({
        id: `order-${order.id}`,
        type: 'order',
        message: `Commande ${order.orderNumber} mise à jour${order.manager ? ` par ${order.manager.user.firstName} ${order.manager.user.lastName}` : ''}`,
        timestamp: order.updatedAt,
        color: 'blue'
      })),
      
      ...recentProducts.map(product => ({
        id: `product-${product.id}`,
        type: 'product',
        message: `Nouveau produit ${product.name} ajouté à la catégorie ${product.category.name}`,
        timestamp: product.createdAt,
        color: 'orange'
      }))
    ];

    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    return {
      success: true,
      data: sortedActivities
    };
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return {
      success: false,
      error: 'Failed to fetch recent activity'
    };
  }
}

// Get all managers with their stats
export async function getManagers() {
  try {
    const managers = await prisma.manager.findMany({
      include: {
        user: true,
        category: true,
        orders: {
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedManagers = managers.map(manager => ({
      id: manager.id,
      name: `${manager.user.firstName} ${manager.user.lastName}`,
      email: manager.user.email,
      category: manager.category.name,
      orders: manager.orders.length,
      status: manager.isActive ? 'Active' : 'Inactive',
      createdAt: manager.createdAt.toISOString().split('T')[0]
    }));

    return {
      success: true,
      data: formattedManagers
    };
  } catch (error) {
    console.error('Error fetching managers:', error);
    return {
      success: false,
      error: 'Failed to fetch managers'
    };
  }
}

// Create new manager
export async function createManager(formData: FormData) {
  try {
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const categoryId = formData.get('categoryId') as string;
    const password = formData.get('password') as string;

    // Validate required fields
    if (!firstName || !lastName || !email || !categoryId || !password) {
      return {
        success: false,
        error: 'Tous les champs sont requis'
      };
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return {
        success: false,
        error: 'Un utilisateur avec cet email existe déjà'
      };
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create user first
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          role: 'MANAGER'
        }
      });

      // Create manager
      const manager = await tx.manager.create({
        data: {
          userId: user.id,
          categoryId,
          isActive: true
        },
        include: {
          user: true,
          category: true
        }
      });

      return {
        id: manager.id,
        name: `${manager.user.firstName} ${manager.user.lastName}`,
        email: manager.user.email,
        category: manager.category.name,
        orders: 0,
        status: 'Active',
        createdAt: manager.createdAt.toISOString().split('T')[0]
      };
    });

    revalidatePath('/admin/dashboard');
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error creating manager:', error);
    return {
      success: false,
      error: 'Erreur lors de la création du gestionnaire'
    };
  }
}

// Delete manager
export async function deleteManager(managerId: string) {
  try {
    await prisma.manager.delete({
      where: { id: managerId }
    });
    
    revalidatePath('/admin/dashboard');
    
    return {
      success: true,
      message: 'Gestionnaire supprimé avec succès'
    };
  } catch (error) {
    console.error('Error deleting manager:', error);
    return {
      success: false,
      error: 'Erreur lors de la suppression du gestionnaire'
    };
  }
}

// Toggle manager status
export async function toggleManagerStatus(managerId: string) {
  try {
    const manager = await prisma.manager.findUnique({
      where: { id: managerId }
    });

    if (!manager) {
      return {
        success: false,
        error: 'Gestionnaire non trouvé'
      };
    }

    const updatedManager = await prisma.manager.update({
      where: { id: managerId },
      data: { isActive: !manager.isActive },
      include: {
        user: true,
        category: true,
        orders: {
          select: { id: true }
        }
      }
    });

    revalidatePath('/admin/dashboard');

    return {
      success: true,
      data: {
        id: updatedManager.id,
        name: `${updatedManager.user.firstName} ${updatedManager.user.lastName}`,
        email: updatedManager.user.email,
        category: updatedManager.category.name,
        orders: updatedManager.orders.length,
        status: updatedManager.isActive ? 'Active' : 'Inactive',
        createdAt: updatedManager.createdAt.toISOString().split('T')[0]
      }
    };
  } catch (error) {
    console.error('Error toggling manager status:', error);
    return {
      success: false,
      error: 'Erreur lors de la mise à jour du statut'
    };
  }
}

// Get all categories with their stats
// export async function getCategories() {
//   try {
//     const categories = await prisma.category.findMany({
//       include: {
//         products: {
//           select: { id: true }
//         },
//         managers: {
//           include: {
//             user: true,
//             orders: {
//               select: { id: true }
//             }
//           }
//         }
//       },
//       orderBy: { name: 'asc' }
//     });

//     const formattedCategories = categories.map(category => ({
//       id: category.id,
//       name: category.name,
//       manager: category.managers.length > 0 
//         ? `${category.managers[0].user.firstName} ${category.managers[0].user.lastName}`
//         : 'Non assigné',
//       products: category.products.length,
//       orders: category.managers.reduce((total, manager) => total + manager.orders.length, 0),
//       isActive: category.isActive
//     }));

//     return {
//       success: true,
//       data: formattedCategories
//     };
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     return {
//       success: false,
//       error: 'Failed to fetch categories'
//     };
//   }
// }

// Get available categories for manager assignment
export async function getAvailableCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true
      },
      orderBy: { name: 'asc' }
    });

    return {
      success: true,
      data: categories
    };
  } catch (error) {
    console.error('Error fetching available categories:', error);
    return {
      success: false,
      error: 'Failed to fetch available categories'
    };
  }
}

// Updated getCategories function to include all required fields
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          select: { id: true }
        },
        managers: {
          include: {
            user: true,
            orders: {
              select: { id: true }
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
      description: category.description,
      image: category.image,
      manager: category.managers.length > 0 
        ? `${category.managers[0].user.firstName} ${category.managers[0].user.lastName}`
        : 'Non assigné',
      products: category.products.length,
      orders: category.managers.reduce((total, manager) => total + manager.orders.length, 0),
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }));

    return {
      success: true,
      data: formattedCategories
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      success: false,
      error: 'Failed to fetch categories'
    };
  }
}

// Updated createCategory function to handle file uploads properly
export async function createCategory(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const nameAr = formData.get('nameAr') as string;
    const nameEn = formData.get('nameEn') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File;

    if (!name || !nameAr || !nameEn) {
      return { success: false, error: 'Nom, Nom Arabe et Nom Anglais sont requis' };
    }

    // Check if category with this name already exists
    const existingCategory = await prisma.category.findFirst({
      where: { name }
    });

    if (existingCategory) {
      return { 
        success: false, 
        error: 'Une catégorie avec ce nom existe déjà' 
      };
    }

    console.log("image name : " , imageFile.name);
    

    // Handle image upload if provided
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'categories');

      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Write file to disk
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      imageUrl = `/uploads/categories/${fileName}`;
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        nameAr,
        nameEn,
        description: description || null,
        image: imageUrl,
        isActive: true // Ensure isActive is set
      }
    });

    revalidatePath('/admin/dashboard');

    return {
      success: true,
      data: {
        id: newCategory.id,
        name: newCategory.name,
        nameAr: newCategory.nameAr,
        nameEn: newCategory.nameEn,
        description: newCategory.description,
        image: newCategory.image,
        manager: 'Non assigné',
        products: 0,
        orders: 0,
        isActive: newCategory.isActive,
        createdAt: newCategory.createdAt,
        updatedAt: newCategory.updatedAt
      }
    };
  } catch (error) {
    console.error('Error creating category:', error);
    return {
      success: false,
      error: 'Erreur lors de la création de la catégorie'
    };
  }
}

// Updated updateCategory function to handle file uploads
// Updated updateCategory function to handle file uploads
export async function updateCategory(id: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const nameAr = formData.get('nameAr') as string;
    const nameEn = formData.get('nameEn') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File;

    if (!name || !nameAr || !nameEn) {
      return { success: false, error: 'Nom, Nom Arabe et Nom Anglais sont requis' };
    }

    // Prepare update data
    const updateData: any = {
      name,
      nameAr,
      nameEn,
      description: description || null
    };

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'categories');

      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Write file to disk
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      // Add the image URL to update data
      updateData.image = `/uploads/categories/${fileName}`;
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        products: {
          select: { id: true }
        },
        managers: {
          include: {
            user: true,
            orders: {
              select: { id: true }
            }
          }
        }
      }
    });

    revalidatePath('/admin/dashboard');

    return { 
      success: true,
      data: {
        id: updatedCategory.id,
        name: updatedCategory.name,
        nameAr: updatedCategory.nameAr,
        nameEn: updatedCategory.nameEn,
        description: updatedCategory.description,
        image: updatedCategory.image,
        manager: updatedCategory.managers.length > 0 
          ? `${updatedCategory.managers[0].user.firstName} ${updatedCategory.managers[0].user.lastName}`
          : 'Non assigné',
        products: updatedCategory.products.length,
        orders: updatedCategory.managers.reduce((total, manager) => total + manager.orders.length, 0),
        isActive: updatedCategory.isActive,
        createdAt: updatedCategory.createdAt,
        updatedAt: updatedCategory.updatedAt
      }
    };
  } catch (error) {
    console.error('Error updating category:', error);
    return {
      success: false,
      error: 'Erreur lors de la mise à jour de la catégorie'
    };
  }
}

// Function to toggle category status
export async function toggleCategoryStatus(categoryId: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return {
        success: false,
        error: 'Catégorie non trouvée'
      };
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { isActive: !category.isActive },
      include: {
        products: {
          select: { id: true }
        },
        managers: {
          include: {
            user: true,
            orders: {
              select: { id: true }
            }
          }
        }
      }
    });

    revalidatePath('/dashboard/admin');

    return {
      success: true,
      data: {
        id: updatedCategory.id,
        name: updatedCategory.name,
        nameAr: updatedCategory.nameAr,
        nameEn: updatedCategory.nameEn,
        description: updatedCategory.description,
        image: updatedCategory.image,
        manager: updatedCategory.managers.length > 0 
          ? `${updatedCategory.managers[0].user.firstName} ${updatedCategory.managers[0].user.lastName}`
          : 'Non assigné',
        products: updatedCategory.products.length,
        orders: updatedCategory.managers.reduce((total, manager) => total + manager.orders.length, 0),
        isActive: updatedCategory.isActive,
        createdAt: updatedCategory.createdAt,
        updatedAt: updatedCategory.updatedAt
      }
    };
  } catch (error) {
    console.error('Error toggling category status:', error);
    return {
      success: false,
      error: 'Erreur lors de la mise à jour du statut'
    };
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    // First check if the category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return {
        success: false,
        error: 'Catégorie non trouvée'
      };
    }

    // Check if category has associated products
    const productCount = await prisma.product.count({
      where: { categoryId }
    });

    if (productCount > 0) {
      return {
        success: false,
        error: 'Impossible de supprimer : la catégorie contient des produits'
      };
    }

    // Check if category has assigned managers
    const managerCount = await prisma.manager.count({
      where: { categoryId }
    });

    if (managerCount > 0) {
      return {
        success: false,
        error: 'Impossible de supprimer : la catégorie est assignée à des gestionnaires'
      };
    }

    // Delete the category
    await prisma.category.delete({
      where: { id: categoryId }
    });

    // Delete associated image file if exists
    if (category.image) {
      try {
        const fs = require('fs');
        const path = require('path');
        const imagePath = path.join(process.cwd(), 'public', category.image);
        
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (fileError) {
        console.error('Error deleting image file:', fileError);
        // Continue even if file deletion fails
      }
    }

    revalidatePath('/dashboard/admin');
    
    return {
      success: true,
      message: 'Catégorie supprimée avec succès'
    };
  } catch (error) {
    console.error('Error deleting category:', error);
    return {
      success: false,
      error: 'Erreur lors de la suppression de la catégorie'
    };
  }
}