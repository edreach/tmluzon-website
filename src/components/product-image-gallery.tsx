
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

interface ProductImageGalleryProps {
    imageUrls: string[];
    productName: string;
}

export default function ProductImageGallery({ imageUrls, productName }: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        if (imageUrls && imageUrls.length > 0) {
            setSelectedImage(imageUrls[0]);
        } else {
            setSelectedImage(null);
        }
    }, [imageUrls]);

    if (!imageUrls) {
        return <Skeleton className="aspect-square w-full rounded-xl" />;
    }

    const displayImage = selectedImage || (imageUrls.length > 0 ? imageUrls[0] : `https://picsum.photos/seed/${productName}/800/800`);

    return (
        <div>
            <div className="relative aspect-square w-full bg-muted rounded-xl overflow-hidden shadow-lg">
                <Image
                    src={displayImage}
                    alt={productName}
                    fill
                    className="object-cover"
                    data-ai-hint="product image"
                    key={displayImage} // Force re-render on image change
                />
            </div>
            {imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {imageUrls.map((url, index) => (
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
    );
}

