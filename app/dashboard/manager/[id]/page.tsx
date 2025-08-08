// This should be your main page.tsx file (SERVER COMPONENT)
import ManagerDashboard from "./managerDashboard";

// Define your product data with actual IDs you want to support
const productData = {
  'cmctsij3m0002d3vs4lsexf2z': {
    id: 'cmctsij3m0002d3vs4lsexf2z',
    // ... rest of your product data
  },
  // Add more products with their actual IDs as needed
};

// This function is required for static export with dynamic routes
export async function generateStaticParams() {
  return Object.entries(productData).map(([id, product]) => ({
    id: product.id, // Use the actual ID from your product data
  }));
}

// Server component that passes data to client component
export default function ProductPage({ params }: { params: { id: string } }) {
  return <ManagerDashboard managerId={params.id} />;
}