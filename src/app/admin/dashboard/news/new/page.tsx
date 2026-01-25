import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NewsForm from '../../news-form';
import type { NewsArticle } from '@/lib/types';
import { format } from 'date-fns';

export default function NewArticlePage() {
  const newArticle: NewsArticle = {
    id: 'new',
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    content: '',
    imageUrl: '',
    imageHint: '',
  };

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Create Article</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New Article Details</CardTitle>
          <CardDescription>Fill out the form to add a new article to your site.</CardDescription>
        </CardHeader>
        <CardContent>
          <NewsForm article={newArticle} />
        </CardContent>
      </Card>
    </>
  );
}
