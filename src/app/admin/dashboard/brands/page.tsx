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
import type { Brand, BrandData } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function BrandsPage() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const brandsQuery = useMemoFirebase(
        () => (firestore ? collection(firestore, 'brands') : null),
        [firestore]
    );
    const { data: brands, isLoading } = useCollection<BrandData>(brandsQuery);

    const handleDelete = (brandId: string) => {
        if (!firestore || !brandId) return;
        if (confirm('Are you sure you want to delete this brand?')) {
            deleteDoc(doc(firestore, 'brands', brandId))
                .then(() => {
                    toast({ title: 'Brand Deleted', description: 'The brand has been successfully removed.' });
                })
                .catch((error) => {
                    console.error("Error deleting document: ", error);
                    toast({ variant: 'destructive', title: 'Error', description: 'There was a problem deleting the brand.' });
                });
        }
    };

    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Brands</h1>
                <div className="ml-auto">
                    <Button asChild>
                        <Link href="/admin/dashboard/brands/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Brand
                        </Link>
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Manage Brands</CardTitle>
                        <CardDescription>Add, edit, or delete partner brands.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-24">Logo</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Website URL</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-10 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-64" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            )}
                            {!isLoading && brands?.map((brand) => (
                                <TableRow key={brand.id}>
                                     <TableCell>
                                        <div className="relative h-10 w-16 bg-muted rounded-md border">
                                            <Image src={brand.logoUrl} alt={brand.name} fill className="object-contain p-1"/>
                                        </div>
                                     </TableCell>
                                    <TableCell className="font-medium">{brand.name}</TableCell>
                                    <TableCell>
                                        <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            {brand.websiteUrl}
                                        </a>
                                    </TableCell>
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
                                                   <Link href={`/admin/dashboard/brands/${brand.id}/edit`}>Edit</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(brand.id)}>
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {!isLoading && brands?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">No brands found.</TableCell>
                                </TableRow>
                             )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
