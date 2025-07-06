// This should be your main page.tsx file (SERVER COMPONENT)
import ProductPageClient from './ProductPageClient';

const productData = {
  1: {
    id: 1,
    name: { fr: 'Table à Manger en Chêne Rustique', ar: 'طاولة طعام من خشب البلوط الريفي', en: 'Rustic Oak Dining Table' },
    // ... rest of your product data
  },
  2: {
    id: 2,
    name: { fr: 'Chaise Ergonomique', ar: 'كرسي مريح', en: 'Ergonomic Chair' },
    // ... add more products as needed
  }
};

// This function is required for static export with dynamic routes
export async function generateStaticParams() {
  return Object.keys(productData).map((id) => ({
    id: id,
  }));
}

// Server component that passes data to client component
export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductPageClient params={params} />;
  // return (<div> hello {params.id} </div>)
}