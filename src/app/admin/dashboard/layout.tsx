'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  Building2,
  Info,
  LogOut,
  Mail,
  Newspaper,
  Package,
  Settings,
  Tag,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading, firestore, auth } = useFirebase();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until Firebase has checked the auth state
    }

    if (!user) {
      // If no user, redirect to login.
      router.replace('/admin');
      return;
    }

    // If user is found, verify if they are an admin
    if (firestore && auth) {
      const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
      getDoc(adminRoleRef).then(adminDoc => {
        if (adminDoc.exists()) {
          setIsAuthorized(true);
        } else {
          // Not an admin, show error, sign out, and redirect
          toast({
            variant: 'destructive',
            title: 'Unauthorized',
            description: "You don't have permission to access the admin dashboard.",
          });
          signOut(auth).finally(() => {
            router.replace('/admin');
          });
        }
      }).catch(error => {
          console.error("Error checking admin status:", error);
          toast({
              variant: 'destructive',
              title: 'Verification Error',
              description: "Could not verify your admin status.",
          });
           signOut(auth).finally(() => {
            router.replace('/admin');
          });
      }).finally(() => {
        setIsVerifying(false);
      });
    } else {
        // This case should not happen if FirebaseProvider is set up correctly
        toast({
            variant: 'destructive',
            title: 'Firebase Not Ready',
            description: 'Could not connect to Firebase services.',
        });
        setIsVerifying(false);
        router.replace('/');
    }
  }, [user, isUserLoading, firestore, auth, router, toast]);

  if (isUserLoading || isVerifying) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-4 text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  if (!isAuthorized) {
      // This state is a fallback, user should have been redirected.
      // It prevents rendering children if authorization fails.
      return null;
  }

  return <>{children}</>;
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { auth } = useFirebase();
  
  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push('/admin');
  };

  return (
    <AdminAuthGuard>
      <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Package className="h-6 w-6" />
                <span className="">TMLUZON Admin</span>
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Package className="h-4 w-4" />
                  Products
                </Link>
                <Link
                  href="/admin/dashboard/services"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Briefcase className="h-4 w-4" />
                  Services
                </Link>
                <Link
                  href="/admin/dashboard/pricelist"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Tag className="h-4 w-4" />
                  Pricelist
                </Link>
               <Link
                href="/admin/dashboard/brands"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Building2 className="h-4 w-4" />
                Brands
              </Link>
              <Link
                href="/admin/dashboard/about-us"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Info className="h-4 w-4" />
                About Us
              </Link>
              <Link
                href="/admin/dashboard/news"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Newspaper className="h-4 w-4" />
                News
              </Link>
              <Link
                href="/admin/dashboard/inquiries"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                Inquiries
              </Link>
              <Link
                href="/admin/dashboard/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Site Settings
              </Link>
              </nav>
            </div>
            <div className="mt-auto p-4">
              <Button size="sm" className="w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col overflow-auto">
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
