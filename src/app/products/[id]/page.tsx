
import { getProductById } from '@/lib/data-server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, Clock, XCircle, ArrowLeft } from 'lucide-react';
import AddToCartButton from '@/components/add-to-cart-button';
import ProductImageGallery from '@/components/product-image-gallery';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import type { Metadata, ResolvingMetadata } from 'next'
 
type Props = {
  params: { id: string }
}
 
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id
  const product = await getProductById(id);
 
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string }}) {
  const id = params.id;
  const product = await getProductById(id);

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
            <ProductImageGallery imageUrls={product.imageUrls} productName={product.name} />
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

            {product && product.stockStatus !== 'Out of Stock' && <AddToCartButton product={product} />}

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

