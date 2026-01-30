
import { getNewsArticleById } from '@/lib/data-server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import NewsImageGallery from '@/components/news-image-gallery';

export default async function NewsArticleDetailPage({ params }: { params: { id: string }}) {
  const article = await getNewsArticleById(params.id);

  return (
    <div className="bg-background">
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
            <Button variant="ghost" asChild className="mb-8">
                <Link href="/news">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to News
                </Link>
            </Button>
        
            <article className="prose lg:prose-xl dark:prose-invert max-w-none">
                <h1>{article.title}</h1>
                <p className="text-muted-foreground">{format(new Date(article.date), 'MMMM d, yyyy')}</p>

                {article.imageUrls && article.imageUrls.length > 0 && (
                    <NewsImageGallery 
                        imageUrls={article.imageUrls}
                        title={article.title}
                        imageHint={article.imageHint}
                    />
                )}
                
                <div className="whitespace-pre-wrap mt-8">{article.content}</div>
            </article>
        </div>
    </div>
  );
}
