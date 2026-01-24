'use client';

import * as React from 'react';
import Link from 'next/link';
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
import { productListings as allProducts } from '@/lib/data';
import type { ProductListingItem } from '@/lib/types';

export default function ProductsPage() {
  const [products, setProducts] = React.useState<ProductListingItem[]>(allProducts);
  const [view, setView] = React.useState('grid');
  
  const maxPrice = React.useMemo(() => Math.max(...allProducts.map(p => p.price), 100000), []);
  const [priceRange, setPriceRange] = React.useState([0, maxPrice]);

  // Get unique values for filters
  const brands = ['All Brands', ...Array.from(new Set(allProducts.map((p) => p.brand)))];
  const types = ['All Types', ...Array.from(new Set(allProducts.map((p) => p.type)))];
  const subTypes = ['All Sub-Types', ...Array.from(new Set(allProducts.map((p) => p.subType)))];

  // state for filters
  const [brand, setBrand] = React.useState('All Brands');
  const [type, setType] = React.useState('All Types');
  const [subType, setSubType] = React.useState('All Sub-Types');
  const [sortBy, setSortBy] = React.useState('popularity');

  React.useEffect(() => {
    let filtered = allProducts;

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
  }, [brand, type, subType, priceRange, sortBy]);
  
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, itemsPerPage).map((product) => (
                <Card key={product.id} className="overflow-hidden group">
                  <div className="bg-muted h-48 flex items-center justify-center text-muted-foreground relative">
                    No Image
                  </div>
                  <CardContent className="p-4 bg-white">
                    <h3 className="font-semibold text-sm truncate text-slate-800">{product.name}</h3>
                    <ul className="mt-1 text-xs text-muted-foreground list-disc pl-4">
                        <li>{product.description}</li>
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
