'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NewsForm from '../../../news-form';
import { notFound, useParams } from 'next/navigation';
import type { NewsArticle } from '@/lib/types';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

function EditNewsArticlePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const firestore = useFirestore();

  const articleRef = useMemoFirebase(
    () => (firestore && id ? doc(firestore, 'news', id) : null),
    [firestore, id]
  );
  const { data: article, isLoading } = useDoc<NewsArticle>(articleRef);

  if (isLoading) {
    return (
      <>
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Edit Article</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-8 w-64" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-96" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-32 w-full" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  if (!article && !isLoading && articleRef) {
    notFound();
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Edit Article</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit: {article?.title}</CardTitle>
          <CardDescription>Update your news article details.</CardDescription>
        </CardHeader>
        <CardContent>{article && <NewsForm article={article} />}</CardContent>
      </Card>
    </>
  );
}

export default EditNewsArticlePage;
