'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  Info,
  LogOut,
  Mail,
  Newspaper,
  Package,
  Settings,
  Tag,
  Loader2 as Loader,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  // Create a memoized reference to the user's admin role document.
  // This is more efficient than fetching the whole collection.
  const adminRoleRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, 'roles_admin', user.uid) : null),
    [user, firestore]
  );

  const { data: adminRole, isLoading: isLoadingRole } = useDoc(adminRoleRef);
  
  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push('/admin');
  };

  useEffect(() => {
    const isCheckingAuth = isUserLoading || isLoadingRole;
    if (isCheckingAuth) {
      return; // Wait until we have user and role information.
    }

    if (!user) {
      // If no user is logged in, redirect to the login page.
      router.replace('/admin');
      return;
    }

    if (!adminRole) {
      // If the user is logged in but doesn't have an admin role doc, they are not authorized.
      // Sign them out and redirect them.
      signOut(auth).then(() => {
        router.replace('/admin?unauthorized=true');
      });
    }
  }, [user, isUserLoading, adminRole, isLoadingRole, auth, router]);

  const isAuthorizing = isUserLoading || isLoadingRole;

  if (isAuthorizing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader className="h-5 w-5 animate-spin" />
          <span>Authorizing...</span>
        </div>
      </div>
    );
  }

  // Only render the dashboard if the user is an admin.
  // The useEffect handles the redirection, but this prevents a flicker of the UI.
  if (!adminRole) {
    return null;
  }

  return (
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
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Tag className="h-4 w-4" />
                Pricelist
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Info className="h-4 w-4" />
                About Us
              </Link>
              <Link
                href="#"
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
  );
}
