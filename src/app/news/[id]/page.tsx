'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { NewsArticleData } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { notFound, useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function NewsArticleDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const firestore = useFirestore();

  const articleRef = useMemoFirebase(
    () => (firestore && id ? doc(firestore, 'news', id) : null),
    [firestore, id]
  );
  const { data: article, isLoading } = useDoc<NewsArticleData>(articleRef);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (article?.imageUrls && article.imageUrls.length > 0) {
      setSelectedImage(article.imageUrls[0]);
    } else {
      setSelectedImage(null);
    }
  }, [article]);


  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <Skeleton className="h-10 w-48 mb-12" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/4 mb-8" />
        <Skeleton className="aspect-video w-full rounded-xl mb-8" />
        <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!isLoading && !article) {
    notFound();
  }
  
  const displayImage = selectedImage || (article?.imageUrls?.[0] ? article.imageUrls[0] : null);
  const hasImages = article && article.imageUrls && article.imageUrls.length > 0;

  return (
    <div className="bg-background">
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
            <Button variant="ghost" asChild className="mb-8">
                <Link href="/news">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to News
                </Link>
            </Button>
        
            {article && (
                <article className="prose lg:prose-xl dark:prose-invert max-w-none">
                    <h1>{article.title}</h1>
                    <p className="text-muted-foreground">{format(new Date(article.date), 'MMMM d, yyyy')}</p>

                    {hasImages && (
                         <div>
                            <div className="relative aspect-video w-full bg-muted rounded-xl overflow-hidden not-prose">
                                {displayImage && <Image
                                    src={displayImage}
                                    alt={article.title}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={article.imageHint || 'news article'}
                                    key={displayImage}
                                />}
                            </div>
                            {article.imageUrls && article.imageUrls.length > 1 && (
                            <div className="grid grid-cols-4 gap-4 mt-4 not-prose">
                                {article.imageUrls.map((url, index) => (
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
                    )}
                   
                    <div className="whitespace-pre-wrap mt-8">{article.content}</div>
                </article>
            )}
        </div>
    </div>
  );
}
