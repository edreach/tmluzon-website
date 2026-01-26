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
import type { Service } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';


export default function ServicesPage() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const servicesQuery = useMemoFirebase(
        () => (firestore ? collection(firestore, 'services') : null),
        [firestore]
    );
    const { data: services, isLoading } = useCollection<Service>(servicesQuery);

    const handleDelete = (serviceId: string) => {
        if (!firestore || !serviceId) return;
        if (confirm('Are you sure you want to delete this service?')) {
            deleteDoc(doc(firestore, 'services', serviceId))
                .then(() => {
                    toast({ title: 'Service Deleted', description: 'The service has been successfully removed.' });
                })
                .catch((error) => {
                    console.error("Error deleting document: ", error);
                    toast({ variant: 'destructive', title: 'Error', description: 'There was a problem deleting the service.' });
                });
        }
    };


    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Services</h1>
                <div className="ml-auto">
                    <Button asChild>
                        <Link href="/admin/dashboard/services/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Service
                        </Link>
                    </Button>
                </div>
            </div>
            <Card>
                 <CardHeader>
                    <div>
                        <CardTitle>Service Catalog</CardTitle>
                        <CardDescription>Manage your services here.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            )}
                            {!isLoading && services?.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell className="font-medium">{service.name}</TableCell>
                                    <TableCell>{service.description.substring(0, 100)}...</TableCell>
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
                                                   <Link href={`/admin/dashboard/services/${service.id}/edit`}>Edit</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(service.id)}>
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {!isLoading && services?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24">No services found.</TableCell>
                                </TableRow>
                             )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
