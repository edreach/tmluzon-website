"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chrome } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

function GoogleSignInButton({
  onClick,
  pending,
}: {
  onClick: () => void;
  pending: boolean;
}) {
  return (
    <Button
      disabled={pending}
      className="w-full"
      onClick={onClick}
      variant="outline"
    >
      <Chrome className="mr-2 h-4 w-4" />
      {pending ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
}

export default function AdminLoginPage() {
  const { toast } = useToast();
  const auth = useAuth();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push("/admin/dashboard");
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The useEffect will handle the redirect
    } catch (error: any) {
      console.error("Google sign-in failed", error);
      toast({
        title: "Login Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsLoggingIn(false);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Admin Login</CardTitle>
          <CardDescription>
            Sign in using your Google account to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* The login is handled by the Google SSO button in the footer */}
        </CardContent>
        <CardFooter>
          <GoogleSignInButton
            onClick={handleGoogleSignIn}
            pending={isLoggingIn}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
