'use client';

import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const firestore = useFirestore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (searchParams.get('unauthorized') === 'true') {
      toast({
        title: 'Unauthorized',
        description: 'You do not have permission to access the admin dashboard.',
        variant: 'destructive',
      });
      // Replace the URL to remove the query parameter
      router.replace('/admin');
    }
  }, [searchParams, toast, router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error('Email Sign-In Error:', error);
      toast({
        title: 'Sign-In Failed',
        description: error.message || 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) return;
    const provider = new GoogleAuthProvider();
    setIsLoading(true);
    try {
      // It's a good practice to sign out any existing user before starting a new sign-in flow
      // This can prevent issues with session management.
      await signOut(auth);

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // After successful authentication, check if the user exists in our 'users' collection.
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If the user document doesn't exist, create it.
        // This ensures all authenticated users are represented in our database,
        // which is useful for user management in the dashboard.
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
        });
         toast({
          title: 'Profile Created',
          description: 'Your user profile was created. Only admins can access the dashboard.',
        });
      }

      router.push('/admin/dashboard');

    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      toast({
        title: 'Sign-In Failed',
        description: error.message || 'An unexpected error occurred during sign-in.',
        variant: 'destructive',
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-sm p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground">Sign in to manage your site</p>
        </div>
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="admin@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={isLoading}>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.519-3.317-11.28-7.962l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
