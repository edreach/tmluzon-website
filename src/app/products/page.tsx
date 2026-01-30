
import Link from 'next/link';
import { getProducts } from '@/lib/data-server';
import ProductList from './product-list';

export default async function ProductsPage() {
  
  const allProducts = await getProducts();
  const uniqueBrands = ['All Brands', ...Array.from(new Set((allProducts || []).map((p) => p.brand)))];
  const uniqueTypes = ['All Types', ...Array.from(new Set((allProducts || []).map((p) => p.type)))];
  const uniqueSubTypes = ['All Sub-Types', ...Array.from(new Set((allProducts || []).map((p) => p.subType)))];

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">&gt;</span>
          <span>Products</span>
        </div>
        <ProductList 
            allProducts={allProducts} 
            uniqueBrands={uniqueBrands}
            uniqueTypes={uniqueTypes}
            uniqueSubTypes={uniqueSubTypes}
        />
      </div>
    </div>
  );
}
