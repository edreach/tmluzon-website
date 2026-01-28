'use client';

import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { doc } from 'firebase/firestore';
import type { SiteSettings } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Fetch site settings for logo
  const firestore = useFirestore();
  const settingsRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'admin/dashboard/settings/tmluzon') : null),
    [firestore]
  );
  const { data: siteSettings, isLoading: isLoadingSettings } = useDoc<SiteSettings>(settingsRef);


  useEffect(() => {
    // If user is already logged in, redirect them to the dashboard.
    // The dashboard layout will handle admin verification.
    if (!isUserLoading && user) {
      router.replace('/admin/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleLogin = async () => {
    if (!auth) return;
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Successful login will trigger the useEffect to redirect
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <Link href="/" className="block">
              <div className="mx-auto mb-4 h-24 w-64 relative">
                {isLoadingSettings ? (
                  <Skeleton className="h-full w-full" />
                ) : siteSettings?.logoUrl ? (
                  <Image
                    src={siteSettings.logoUrl}
                    alt="Company Logo"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                    Company Logo
                  </div>
                )}
              </div>
            </Link>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Sign in with your Google account to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoggingIn}>
               {isLoggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                  <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                      <path
                      fill="currentColor"
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-3.88 1.62-4.57 0-8.28-3.71-8.28-8.28s3.71-8.28 8.28-8.28c2.48 0 4.22.98 5.57 2.25l2.45-2.3-2.6-2.58C16.92 1.36 14.86 0 12.48 0 5.88 0 .04 5.84.04 12.5s5.84 12.5 12.44 12.5c3.22 0 5.75-1.08 7.63-2.96 1.93-1.93 2.58-4.63 2.58-6.78 0-.85-.08-1.56-.2-2.24H12.48z"
                      />
                  </svg>
               )}
              Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
