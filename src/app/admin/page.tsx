"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useEffect } from "react";
import { login } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} className="w-full">
      {pending ? "Logging in..." : "Login"}
      <LogIn className="ml-2 h-4 w-4" />
    </Button>
  );
}

export default function AdminLoginPage() {
    const [state, formAction] = useActionState(login, { message: ''});
    const { toast } = useToast();

    useEffect(() => {
        if (state?.message) {
            toast({
                title: 'Login Failed',
                description: state.message,
                variant: 'destructive',
            })
        }
    }, [state, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form action={formAction}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Admin Login</CardTitle>
            <CardDescription>
              Password authentication is currently disabled. Click 'Login' to proceed.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required disabled />
            </div>
            {state?.message && (
              <p className="text-sm text-destructive">{state.message}</p>
            )}
          </CardContent>
          <CardFooter>
            <LoginButton />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
