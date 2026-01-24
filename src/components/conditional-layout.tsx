"use client";

import { usePathname } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';

export function ConditionalHeader() {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith('/admin');

    if (isAdminRoute) {
        return null;
    }

    return <Header />;
}

export function ConditionalFooter() {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith('/admin');

    if (isAdminRoute) {
        return null;
    }

    return <Footer />;
}
