
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutGrid, List } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductListProps {
    allProducts: Product[];
    uniqueBrands: string[];
    uniqueTypes: string[];
    uniqueSubTypes: string[];
}

export default function ProductList({ allProducts, uniqueBrands, uniqueTypes, uniqueSubTypes }: ProductListProps) {
  
  const [products, setProducts] = React.useState<Product[]>(allProducts);
  const [view, setView] = React.useState('grid');
  
  // state for filters
  const [brand, setBrand] = React.useState('All Brands');
  const [type, setType] = React.useState('All Types');
  const [subType, setSubType] = React.useState('All Sub-Types');
  const [sortBy, setSortBy] = React.useState('name-asc');

  React.useEffect(() => {
    let filtered = allProducts || [];

    if (brand !== 'All Brands') {
      filtered = filtered.filter((p) => p.brand === brand);
    }
    if (type !== 'All Types') {
      filtered = filtered.filter((p) => p.type === type);
    }
    if (subType !== 'All Sub-Types') {
      filtered = filtered.filter((p) => p.subType === subType);
    }
    
    // Sorting logic
    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'name-asc') {
            return a.name.localeCompare(b.name);
        }
        if (sortBy === 'name-desc') {
            return b.name.localeCompare(a.name);
        }
        return 0;
    });

    setProducts(sorted);
  }, [brand, type, subType, sortBy, allProducts]);
  
  const itemsPerPage = 16;
  const totalResults = products.length;
  const shownCount = Math.min(itemsPerPage, totalResults);

  return (
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
                {uniqueBrands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
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
                {uniqueTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
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
                {uniqueSubTypes.map((st) => <SelectItem key={st} value={st}>{st}</SelectItem>)}
                </SelectContent>
            </Select>
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
                <SelectValue placeholder="Sort by name" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="name-asc">Sort by name: A-Z</SelectItem>
                <SelectItem value="name-desc">Sort by name: Z-A</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>

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
        </main>
    </div>
  );
}

