"use client";

import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser } from "@/firebase";
import { signInAnonymously } from "firebase/auth";
import { useRouter } from "next/navigation";

function LoginButton({ onClick, pending }: { onClick: () => void, pending: boolean }) {
  return (
    <Button disabled={pending} className="w-full" onClick={onClick}>
      {pending ? "Logging in..." : "Login"}
      <LogIn className="ml-2 h-4 w-4" />
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
            router.push('/admin/dashboard');
        }
    }, [user, isUserLoading, router]);

    const handleLogin = async () => {
        setIsLoggingIn(true);
        try {
            await signInAnonymously(auth);
            // The useEffect will handle the redirect
        } catch (error: any) {
            console.error("Anonymous sign-in failed", error);
            toast({
                title: 'Login Failed',
                description: error.message || 'An unexpected error occurred.',
                variant: 'destructive',
            });
            setIsLoggingIn(false);
        }
    };
    
    // Prevent rendering the login page if the user is already logged in or we are still checking
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
              Click 'Login' to proceed with anonymous authentication for this demo.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required disabled placeholder="demo@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required disabled />
            </div>
          </CardContent>
          <CardFooter>
            <LoginButton onClick={handleLogin} pending={isLoggingIn} />
          </CardFooter>
        </Card>
    </div>
  );
}
