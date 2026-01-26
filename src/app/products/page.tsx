'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutGrid, List } from 'lucide-react';
import type { Product, ProductData } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const firestore = useFirestore();

  // Fetch products that are not discontinued
  const productsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'products'), where('discontinued', '!=', true)) : null),
    [firestore]
  );
  const { data: allProducts, isLoading } = useCollection<ProductData>(productsQuery);
  
  const [products, setProducts] = React.useState<Product[]>([]);
  const [view, setView] = React.useState('grid');
  
  const maxPrice = React.useMemo(() => {
      if (!allProducts || allProducts.length === 0) return 100000;
      return Math.max(...allProducts.map(p => p.price), 100000);
  }, [allProducts]);
  const [priceRange, setPriceRange] = React.useState([0, maxPrice]);

  React.useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  // Get unique values for filters
  const brands = React.useMemo(() => ['All Brands', ...Array.from(new Set((allProducts || []).map((p) => p.brand)))], [allProducts]);
  const types = React.useMemo(() => ['All Types', ...Array.from(new Set((allProducts || []).map((p) => p.type)))], [allProducts]);
  const subTypes = React.useMemo(() => ['All Sub-Types', ...Array.from(new Set((allProducts || []).map((p) => p.subType)))], [allProducts]);

  // state for filters
  const [brand, setBrand] = React.useState('All Brands');
  const [type, setType] = React.useState('All Types');
  const [subType, setSubType] = React.useState('All Sub-Types');
  const [sortBy, setSortBy] = React.useState('popularity');

  React.useEffect(() => {
    let filtered = (allProducts as Product[]) || [];

    if (brand !== 'All Brands') {
      filtered = filtered.filter((p) => p.brand === brand);
    }
    if (type !== 'All Types') {
      filtered = filtered.filter((p) => p.type === type);
    }
    if (subType !== 'All Sub-Types') {
      filtered = filtered.filter((p) => p.subType === subType);
    }
    
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting logic
    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'price-asc') {
            return a.price - b.price;
        }
        if (sortBy === 'price-desc') {
            return b.price - a.price;
        }
        // "popularity" is default, no specific sorting for now
        return 0;
    });

    setProducts(sorted);
  }, [brand, type, subType, priceRange, sortBy, allProducts]);
  
  const itemsPerPage = 16;
  const totalResults = products.length;
  const shownCount = Math.min(itemsPerPage, totalResults);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">&gt;</span>
          <span>Products</span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <div className="space-y-6 sticky top-24">
              <h2 className="text-xl font-bold">Product Filters</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Brands</label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Types</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sub Types</label>
                 <Select value={subType} onValueChange={setSubType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Sub-Types" />
                  </SelectTrigger>
                  <SelectContent>
                    {subTypes.map((st) => <SelectItem key={st} value={st}>{st}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Filter by price</label>
                <Slider
                  min={0}
                  max={maxPrice}
                  step={1000}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="mt-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>₱{priceRange[0].toLocaleString('en-US')}</span>
                  <span>₱{priceRange[1].toLocaleString('en-US')}</span>
                </div>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3">
            <h1 className="text-3xl font-bold mb-4">All Products</h1>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4 border-t border-b py-4">
              <div className="flex items-center gap-2">
                <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('grid')}>
                  <LayoutGrid className="h-5 w-5" />
                </Button>
                <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('list')}>
                  <List className="h-5 w-5" />
                </Button>
                <p className="text-sm text-muted-foreground ml-2">Showing 1-{shownCount} of {totalResults} results</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">Show:</label>
                  <Select defaultValue={itemsPerPage.toString()}>
                    <SelectTrigger className="w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16">16</SelectItem>
                      <SelectItem value="32">32</SelectItem>
                      <SelectItem value="64">64</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by popularity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Sort by popularity</SelectItem>
                    <SelectItem value="price-asc">Sort by price: low to high</SelectItem>
                    <SelectItem value="price-desc">Sort by price: high to low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.slice(0, itemsPerPage).map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`} className="block">
                    <Card className="overflow-hidden group h-full transition-shadow duration-300 hover:shadow-lg">
                      <div className="bg-muted h-48 flex items-center justify-center text-muted-foreground relative">
                         {product.imageUrls && product.imageUrls.length > 0 ? (
                          <Image src={product.imageUrls[0]} alt={product.name} fill className="object-cover" />
                        ) : (
                          <span>No Image</span>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground truncate">{product.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
