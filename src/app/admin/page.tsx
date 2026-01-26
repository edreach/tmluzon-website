'use client';

import { useToast } from '@/hooks/use-toast';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Successful login will trigger the useEffect to redirect
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.code === 'auth/invalid-credential' 
            ? 'Incorrect email or password.'
            : error.message || 'An unknown error occurred.',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };
  
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
            <div className="mx-auto mb-4 h-20 w-48 relative">
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
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoggingIn}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoggingIn}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
          <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                  </span>
              </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoggingIn}>
               {isLoggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                  <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                      <path
                      fill="currentColor"
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-3.88 1.62-4.57 0-8.28-3.71-8.28-8.28s3.71-8.28 8.28-8.28c2.48 0 4.22.98 5.57 2.25l2.45-2.3-2.6-2.58C16.92 1.36 14.86 0 12.48 0 5.88 0 .04 5.84.04 12.5s5.84 12.5 12.44 12.5c3.22 0 5.75-1.08 7.63-2.96 1.93-1.93 2.58-4.63 2.58-6.78 0-.85-.08-1.56-.2-2.24H12.48z"
                      />
                  </svg>
               )}
              Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
