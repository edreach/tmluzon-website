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
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const productsQuery = useMemoFirebase(
        () => (firestore ? collection(firestore, 'products') : null),
        [firestore]
    );
    const { data: products, isLoading } = useCollection<Product>(productsQuery);

    const handleDelete = (productId: string) => {
        if (!firestore || !productId) return;
        if (confirm('Are you sure you want to delete this product?')) {
            deleteDoc(doc(firestore, 'products', productId))
                .then(() => {
                    toast({ title: 'Product Deleted', description: 'The product has been successfully removed.' });
                })
                .catch((error) => {
                    console.error("Error deleting document: ", error);
                    toast({ variant: 'destructive', title: 'Error', description: 'There was a problem deleting the product.' });
                });
        }
    };

    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
                <div className="ml-auto">
                    <Button asChild>
                        <Link href="/admin/dashboard/products/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Product
                        </Link>
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Product Catalog</CardTitle>
                        <CardDescription>Manage your products here.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Brand</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            )}
                            {!isLoading && products?.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{product.brand}</Badge>
                                    </TableCell>
                                    <TableCell>{product.type}</TableCell>
                                    <TableCell className="text-right">₱{product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
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
                                                   <Link href={`/admin/dashboard/products/${product.id}/edit`}>Edit</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product.id)}>
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {!isLoading && products?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">No products found.</TableCell>
                                </TableRow>
                             )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
