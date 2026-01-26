"use client";

import Link from 'next/link';
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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PricelistFile, PricelistData } from "@/lib/types";
import { useCollection, useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function PricelistPage() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const pricelistsQuery = useMemoFirebase(
        () => (firestore ? collection(firestore, 'pricelists') : null),
        [firestore]
    );
    const { data: pricelists, isLoading } = useCollection<PricelistData>(pricelistsQuery);

    const handleDelete = (pricelistId: string) => {
        if (!firestore || !pricelistId) return;
        if (confirm('Are you sure you want to delete this pricelist? This action cannot be undone.')) {
            deleteDocumentNonBlocking(doc(firestore, 'pricelists', pricelistId));
            toast({ title: 'Pricelist Deleted', description: 'The pricelist has been successfully removed.' });
        }
    };


    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Pricelists</h1>
                <div className="ml-auto">
                    <Button asChild>
                        <Link href="/admin/dashboard/pricelist/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Pricelist
                        </Link>
                    </Button>
                </div>
            </div>
            <Card>
                 <CardHeader>
                    <div>
                        <CardTitle>Manage Pricelists</CardTitle>
                        <CardDescription>Add, edit, or delete PDF pricelists.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Brand</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>File Name</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-64" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            )}
                            {!isLoading && pricelists?.map((pricelist) => (
                                <TableRow key={pricelist.id}>
                                    <TableCell className="font-medium">{pricelist.brand}</TableCell>
                                    <TableCell>{pricelist.title}</TableCell>
                                    <TableCell>{pricelist.fileName}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                   <Link href={`/admin/dashboard/pricelist/${pricelist.id}/edit`}>Edit</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(pricelist.id)}>
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {!isLoading && pricelists?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">No pricelists found.</TableCell>
                                </TableRow>
                             )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
