"use client";

import { useAuth, useFirestore, useUser } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

export default function AdminLoginPage() {
    const auth = useAuth();
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && user) {
            router.push('/admin/dashboard');
        }
    }, [user, isUserLoading, router]);

    const handleGoogleSignIn = async () => {
        if (!auth || !firestore) return;
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const authUser = result.user;

            if (authUser) {
                 // After successful sign-in, check if a user profile exists in Firestore.
                const userDocRef = doc(firestore, "users", authUser.uid);
                const userDocSnap = await getDoc(userDocRef);

                // If the user profile doesn't exist, create it.
                if (!userDocSnap.exists()) {
                    await setDoc(userDocRef, {
                        uid: authUser.uid,
                        name: authUser.displayName,
                        email: authUser.email,
                    });
                }
            }
            // After successful sign-in, the auth guard in the dashboard layout will handle redirection.
        } catch (error) {
            console.error("Error during Google sign-in:", error);
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <div className="w-full max-w-sm text-center">
                <h1 className="text-3xl font-bold mb-2">TMLUZON Admin</h1>
                <p className="text-muted-foreground mb-8">Sign in to access the dashboard.</p>
                <Button onClick={handleGoogleSignIn} className="w-full" size="lg">
                    <Chrome className="mr-2 h-5 w-5" />
                    Sign in with Google
                </Button>
            </div>
        </div>
    );
}
