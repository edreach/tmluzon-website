'use client';

import { useDoc, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { InquiryData } from '@/lib/types';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

export default function InquiryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const firestore = useFirestore();
  
    const inquiryRef = useMemoFirebase(
      () => (firestore && id ? doc(firestore, 'inquiries', id) : null),
      [firestore, id]
    );
    const { data: inquiry, isLoading } = useDoc<InquiryData>(inquiryRef);

    const handleStatusChange = (newStatus: 'New' | 'Viewed' | 'Completed') => {
        if (!inquiryRef) return;
        updateDocumentNonBlocking(inquiryRef, { status: newStatus });
        toast({
            title: 'Status Updated',
            description: `Inquiry marked as ${newStatus}.`,
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-36" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle><Skeleton className="h-8 w-1/2" /></CardTitle>
                                <CardDescription><Skeleton className="h-4 w-1/4" /></CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-40 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle><Skeleton className="h-6 w-3/4" /></CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    if (!inquiry) {
        return notFound();
    }

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Inquiries
            </Button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>Inquired Items</CardTitle>
                                    <CardDescription>
                                        Date: {format(new Date(inquiry.inquiryDate), 'PPpp')}
                                    </CardDescription>
                                </div>
                                <Select value={inquiry.status} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Set status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="New">New</SelectItem>
                                        <SelectItem value="Viewed">Viewed</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product Name</TableHead>
                                        <TableHead className="text-right">Quantity</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inquiry.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.productName}</TableCell>
                                            <TableCell className="text-right">{item.quantity}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {inquiry.message && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Message</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {inquiry.message}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                           <div className="font-medium">{inquiry.customerName}</div>
                           <div>
                                <a href={`mailto:${inquiry.customerEmail}`} className="text-primary hover:underline">
                                    {inquiry.customerEmail}
                                </a>
                           </div>
                           <div>
                                <a href={`tel:${inquiry.customerContact}`} className="text-primary hover:underline">
                                    {inquiry.customerContact}
                                </a>
                           </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
