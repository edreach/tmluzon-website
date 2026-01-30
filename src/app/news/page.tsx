
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { NewsArticleData } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';
import { getNews } from '@/lib/data-server';

export default async function NewsPage() {
  const newsItems = await getNews();

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
            News &amp; Updates
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Stay informed with our latest articles, announcements, and special offers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems?.map((item: NewsArticleData & { id: string }) => (
            <Link href={`/news/${item.id}`} key={item.id} className="block">
              <Card className="overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <div className="relative w-full h-48 bg-muted">
                  {item.imageUrls && item.imageUrls.length > 0 ? (
                      <Image
                      src={item.imageUrls[0]}
                      alt={item.title}
                      fill
                      className="object-cover"
                      data-ai-hint={item.imageHint}
                      />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
                  )}
                </div>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(item.date), 'MMMM d, yyyy')}
                  </p>
                  <div className="text-sm text-muted-foreground mt-4 flex-grow whitespace-pre-wrap line-clamp-3">{item.content}</div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {newsItems?.length === 0 && (
            <p className='text-center text-muted-foreground md:col-span-2 lg:col-span-3'>
                No news articles have been posted yet.
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
