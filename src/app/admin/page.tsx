"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLoginPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin/dashboard');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <p>Loading dashboard...</p>
        </div>
    );
}

    