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
import { productListings as allProducts } from "@/lib/data";
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ProductListingItem } from '@/lib/types';


export default function Dashboard() {
    const [itemsPerPage, setItemsPerPage] = React.useState(10);
    const [paginatedProducts, setPaginatedProducts] = React.useState<ProductListingItem[]>([]);

    React.useEffect(() => {
        setPaginatedProducts(allProducts.slice(0, itemsPerPage));
    }, [itemsPerPage]);

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
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Product Catalog</CardTitle>
                        <CardDescription>Manage your products here.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-muted-foreground whitespace-nowrap">Show items:</label>
                        <Select value={String(itemsPerPage)} onValueChange={(value) => setItemsPerPage(Number(value))}>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="30">30</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
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
                            {paginatedProducts.map((product) => (
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
                                                <DropdownMenuItem className="text-destructive">
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
