'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { SiteSettings } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AboutPage() {
  const firestore = useFirestore();
  const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'admin/dashboard/settings/tmluzon') : null, [firestore]);
  const { data: siteSettings, isLoading } = useDoc<SiteSettings>(settingsRef);

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
            About Us
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Learn more about our story, our mission, and our commitment to quality.
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert mx-auto bg-card p-8 rounded-xl shadow-sm">
            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                </div>
            ) : (
                 <div dangerouslySetInnerHTML={{ __html: siteSettings?.aboutUsContent?.replace(/\n/g, '<br />') || "Content coming soon." }} />
            )}
        </div>
      </div>
    </div>
  );
}
