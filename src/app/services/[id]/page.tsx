
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AddToCartButton from '@/components/add-to-cart-button';
import { getServiceById } from '@/lib/data-server';
import ProductImageGallery from '@/components/product-image-gallery';
import type { Product } from '@/lib/types';


export default async function ServiceDetailPage({ params }: { params: { id: string }}) {
  const service = await getServiceById(params.id);

  const serviceAsProduct: Product | null = service ? {
    id: service.id,
    name: service.name,
    description: service.description,
    imageUrls: service.imageUrls || [],
    // Dummy values for required Product fields
    brand: 'TMLUZON',
    type: 'Service',
    subType: 'Service',
    specifications: [],
    stockStatus: 'In Stock',
    discontinued: false,
  } : null;
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <Button variant="ghost" asChild className="mb-8">
            <Link href="/services">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Services
            </Link>
        </Button>
      
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <ProductImageGallery imageUrls={service.imageUrls} productName={service.name} />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl lg:text-4xl font-bold font-headline mb-2">{service?.name}</h1>
            <div className="text-lg text-foreground/80 space-y-4 whitespace-pre-wrap mb-6">
              <p>{service?.description}</p>
            </div>
             <div className="flex flex-col gap-4 mt-auto">
                {serviceAsProduct && <AddToCartButton product={serviceAsProduct} />}
            </div>
          </div>
        </div>
      
    </div>
  );
}
