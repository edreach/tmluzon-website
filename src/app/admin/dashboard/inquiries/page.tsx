'use client';

import * as React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Inquiry } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function InquiriesPage() {
    const firestore = useFirestore();
    const inquiriesQuery = useMemoFirebase(
        () => (firestore ? query(collection(firestore, 'inquiries'), orderBy('inquiryDate', 'desc')) : null),
        [firestore]
    );
    const { data: inquiries, isLoading } = useCollection<Inquiry>(inquiriesQuery);

    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Inquiries</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Customer Inquiries</CardTitle>
                    <CardDescription>
                        List of received orders from customers.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Items</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-40 mt-1" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                                </TableRow>
                            ))}
                            {!isLoading && inquiries?.map((inquiry) => (
                                <TableRow key={inquiry.id}>
                                    <TableCell>
                                        <div className="font-medium">{inquiry.customerName}</div>
                                        <div className="text-sm text-muted-foreground">{inquiry.customerEmail}</div>
                                    </TableCell>
                                    <TableCell>{inquiry.customerContact}</TableCell>
                                    <TableCell>{format(new Date(inquiry.inquiryDate), 'PP')}</TableCell>
                                    <TableCell>
                                        <Badge variant={inquiry.status === 'New' ? 'default' : inquiry.status === 'Viewed' ? 'secondary' : 'outline'}>
                                            {inquiry.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{inquiry.items.length}</TableCell>
                                </TableRow>
                            ))}
                            {!isLoading && inquiries?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No inquiries found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
