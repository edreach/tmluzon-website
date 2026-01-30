
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface NewsImageGalleryProps {
    imageUrls: string[];
    title: string;
    imageHint?: string;
}

export default function NewsImageGallery({ imageUrls, title, imageHint }: NewsImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        if (imageUrls && imageUrls.length > 0) {
            setSelectedImage(imageUrls[0]);
        } else {
            setSelectedImage(null);
        }
    }, [imageUrls]);

    const displayImage = selectedImage || (imageUrls.length > 0 ? imageUrls[0] : null);

    if (!imageUrls || imageUrls.length === 0) {
        return null;
    }

    return (
        <div>
            <div className="relative aspect-video w-full bg-muted rounded-xl overflow-hidden not-prose">
                {displayImage && <Image
                    src={displayImage}
                    alt={title}
                    fill
                    className="object-cover"
                    data-ai-hint={imageHint || 'news article'}
                    key={displayImage}
                />}
            </div>
            {imageUrls.length > 1 && (
            <div className="grid grid-cols-4 gap-4 mt-4 not-prose">
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

