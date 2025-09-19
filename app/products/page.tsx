import { Suspense } from 'react';
import { 
  fetchProducts, 
  getInitialData,
  fetchCategories 
} from '@/lib/action/home-actions';
import ProductsClient from './ProductsClient';
// import ProductsLoading from './ProductsLoading';

// 🚀 Server Component - This runs on the server
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { 
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    page?: string;
    lang?: string;
  }
}) {
  console.log('🏁 ProductsPage Server Component starting...');
  
  // Parse search params
  const filters = {
    search: searchParams.search || '',
    categoryId: searchParams.category || 'all',
    minPrice: searchParams.minPrice ? parseInt(searchParams.minPrice) : 0,
    maxPrice: searchParams.maxPrice ? parseInt(searchParams.maxPrice) : 999999,
    sortBy: searchParams.sortBy || 'popularity',
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: 12
  };

  const language = (searchParams.lang as 'fr' | 'ar' | 'en') || 'fr';

  // 🚀 Load data on the server (FAST!)
  try {
    const [initialData, productsData] = await Promise.all([
      getInitialData(),
      fetchProducts(filters)
    ]);

    console.log(`✅ Server loaded ${productsData.totalCount} products in page ${productsData.currentPage}`);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <ProductsClient
          initialData={initialData}
          productsData={productsData}
          initialFilters={filters}
          initialLanguage={language}
        />
      </div>
    );
  } catch (error) {
    console.error('❌ Error in ProductsPage:', error);
    
    // Fallback with empty data
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <ProductsClient
          initialData={{ categories: [], priceRange: { min: 0, max: 150000 }, materials: [] }}
          productsData={{ products: [], totalCount: 0, totalPages: 0, currentPage: 1 }}
          initialFilters={filters}
          initialLanguage={language}
        />
      </div>
    );
  }
}

// 🚀 Loading component for Suspense
export function ProductsPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading products...</p>
      </div>
    </div>
  );
}
