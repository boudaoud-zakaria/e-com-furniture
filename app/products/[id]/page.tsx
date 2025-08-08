import { PrismaClient } from '@prisma/client';
import ProductPageClient from './ProductPageClient';

const prisma = new PrismaClient();

export async function generateStaticParams() {
  const productsData = await prisma.product.findMany({
    select: {
      id: true,
    },
  });
  return productsData.map((product) => ({
    id: product.id.toString(),
  }));
}

// Use the exact interface that Next.js 15 expects
interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  return <ProductPageClient id={id} />;
}