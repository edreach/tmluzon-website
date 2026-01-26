'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { Product, ProductData } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { notFound, useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import AddToCartButton from '@/components/add-to-cart-button';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

export default function ProductDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const firestore = useFirestore();

  const productRef = useMemoFirebase(
    () => (firestore && id ? doc(firestore, 'products', id) : null),
    [firestore, id]
  );
  const { data: product, isLoading } = useDoc<ProductData>(productRef);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (product?.imageUrls && product.imageUrls.length > 0) {
      setSelectedImage(product.imageUrls[0]);
    } else {
      setSelectedImage(null);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
        <Skeleton className="h-10 w-48 mb-12" />
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <Skeleton className="aspect-square w-full rounded-xl" />
             <div className="grid grid-cols-4 gap-4 mt-4">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="aspect-square w-full rounded-lg" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && !product) {
    notFound();
  }

  const displayImage = selectedImage || `https://picsum.photos/seed/${id}/800/800`;
  const hasImages = product && product.imageUrls && product.imageUrls.length > 0;
  const fullProduct = product ? { ...product, id } as Product : null;

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
        <Button variant="ghost" asChild className="mb-8">
            <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
            </Link>
        </Button>
      
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="relative aspect-square w-full bg-muted rounded-xl overflow-hidden shadow-lg">
                {product && (
                  <Image
                      src={displayImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      data-ai-hint="product image"
                      key={displayImage} // Force re-render on image change
                  />
                )}
            </div>
             {hasImages && product.imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {product.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(url)}
                    className={cn(
                      'overflow-hidden rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                      selectedImage === url ? 'border-primary' : 'border-transparent'
                    )}
                  >
                    <Image
                      src={url}
                      alt={`Thumbnail ${index + 1}`}
                      width={200}
                      height={200}
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-start justify-between gap-y-2 mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold font-headline">{product?.name}</h1>
                {product?.stockStatus && (
                    <Badge
                        variant={
                            product.stockStatus === 'In Stock' ? 'default' :
                            product.stockStatus === 'Out of Stock' ? 'destructive' :
                            'secondary'
                        }
                        className="text-base"
                    >
                        {product.stockStatus}
                    </Badge>
                )}
            </div>
            <p className="text-2xl font-semibold text-primary mb-4">₱{product?.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <div className="text-base text-foreground/80 space-y-4 mb-6">
              <p>{product?.description}</p>
            </div>
            
            {product?.stockStatus === 'In Stock' && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <CheckCircle className="h-5 w-5" />
                    <span>In Stock & Ready to Ship</span>
                </div>
            )}
            {product?.stockStatus === 'Out of Stock' && (
                 <div className="flex items-center gap-2 text-sm text-destructive mb-6">
                    <XCircle className="h-5 w-5" />
                    <span>Currently unavailable</span>
                </div>
            )}
             {product?.stockStatus === 'Made to Order' && (
                 <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Clock className="h-5 w-5" />
                    <span>Made to order - may take longer to ship</span>
                </div>
            )}

            {fullProduct && product.stockStatus !== 'Out of Stock' && <AddToCartButton product={fullProduct} />}

            {product?.specifications && product.specifications.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Specifications</h3>
                    <Table>
                        <TableBody>
                            {product.specifications.map((spec, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{spec.name}</TableCell>
                                    <TableCell>{spec.value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
