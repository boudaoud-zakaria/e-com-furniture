'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createOrder(formData: FormData) {
  try {
    // Extract form data
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const phone = formData.get('phone') as string
    const wilaya = formData.get('wilaya') as string
    const isCart = formData.get('isCart') === 'true'

    let products = []
    let managerId = null
    let totalOrderAmount = 0

    if (isCart) {
      // Handle multiple products from cart
      const productsData = JSON.parse(formData.get('products') as string)
      
      for (const productData of productsData) {
        const product = await prisma.product.findUnique({
          where: { id: productData.id },
          include: { manager: true }
        })

        if (!product) {
          throw new Error(`Product with ID ${productData.id} not found`)
        }

        // Use the first product's manager for the order
        if (!managerId) {
          managerId = product.managerId
        }

        const itemTotal = productData.price * productData.quantity
        totalOrderAmount += itemTotal

        products.push({
          product,
          quantity: productData.quantity,
          finish: productData.finish,
          dimensions: productData.dimensions,
          price: productData.price,
          itemTotal
        })
      }
    } else {
      // Handle single product (existing logic)
      const productId = formData.get('productId') as string
      const quantity = parseInt(formData.get('quantity') as string)
      const finish = formData.get('finish') as string
      const dimensions = formData.get('dimensions') as string

      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { manager: true }
      })

      if (!product) {
        throw new Error('Product not found')
      }

      managerId = product.managerId
      const itemTotal = product.price * quantity
      totalOrderAmount += itemTotal

      products.push({
        product,
        quantity,
        finish,
        dimensions,
        price: product.price,
        itemTotal
      })
    }

    // Calculate delivery price by wilaya
    const deliveryPrices: { [key: string]: number } = {
      'alger': 0,
      'oran': 0,
      'blida': 1000,
      'boumerdes': 2000,
      'bejaia': 3000
    }

    const deliveryPrice = deliveryPrices[wilaya.toLowerCase()] || 2500

    // Generate order number
    const orderNumber = `ORD-${new Date().getFullYear()}-${Date.now()}`

    // Calculate final total
    const finalTotal = totalOrderAmount + deliveryPrice

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        managerId,
        totalAmount: finalTotal,
        deliveryPrice,
        customerFirstName: firstName,
        customerLastName: lastName,
        customerEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@temp.com`,
        customerPhone: phone,
        deliveryAddress: 'Address placeholder',
        deliveryCity: wilaya,
        deliveryPostalCode: '00000',
        deliveryZone: wilaya,
        deliveryService: 'Standard',
        guestTrackingCode: `TRACK-${Date.now()}`,
        items: {
          create: products.map(({ product, quantity, finish, dimensions, price, itemTotal }) => ({
            productId: product.id,
            productName: product.name,
            quantity,
            unitPrice: price,
            totalPrice: itemTotal,
            customizations: JSON.stringify({ 
              finish, 
              dimensions: typeof dimensions === 'string' ? dimensions : JSON.parse(dimensions) 
            })
          }))
        }
      },
      include: {
        items: true
      }
    })

    revalidatePath('/order')
    
    return { 
      success: true, 
      orderId: order.id,
      orderNumber: order.orderNumber,
      trackingCode: order.guestTrackingCode
    }
  } catch (error) {
    console.error('Error creating order:', error)
    return { success: false, error: 'Failed to create order' }
  }
}