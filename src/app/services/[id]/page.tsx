'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { ServiceData } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { notFound, useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function ServiceDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const firestore = useFirestore();

  const serviceRef = useMemoFirebase(
    () => (firestore && id ? doc(firestore, 'services', id) : null),
    [firestore, id]
  );
  const { data: service, isLoading } = useDoc<ServiceData>(serviceRef);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (service?.imageUrls && service.imageUrls.length > 0) {
      setSelectedImage(service.imageUrls[0]);
    } else {
      setSelectedImage(null);
    }
  }, [service]);


  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
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
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-12 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && !service) {
    notFound();
  }
  
  const displayImage = selectedImage || `https://picsum.photos/seed/${id}/800/800`;
  const hasImages = service && service.imageUrls && service.imageUrls.length > 0;

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
            <div className="relative aspect-square w-full bg-muted rounded-xl overflow-hidden">
                {service && (
                  <Image
                      src={displayImage}
                      alt={service.name}
                      fill
                      className="object-cover"
                      data-ai-hint="service technician"
                      key={displayImage}
                  />
                )}
            </div>
             {hasImages && service.imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {service.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(url)}
                    className={cn(
                      'overflow-hidden rounded-lg border-2 transition-colors',
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
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl lg:text-4xl font-bold font-headline mb-4">{service?.name}</h1>
            <div className="text-lg text-foreground/80 space-y-4 whitespace-pre-wrap">
              <p>{service?.description}</p>
            </div>
            <Button size="lg" className="mt-8" asChild>
              <a href={`mailto:tmluzon.engineering@gmail.com?subject=Inquiry about ${service?.name}`}>
                Inquire About This Service
              </a>
            </Button>
          </div>
        </div>
      
    </div>
  );
}
