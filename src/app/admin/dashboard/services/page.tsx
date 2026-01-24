import Link from 'next/link';
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
import { serviceListings } from "@/lib/data";
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ServicesPage() {
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
                    <CardTitle>Service Catalog</CardTitle>
                    <CardDescription>Manage your services here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {serviceListings.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell className="font-medium">{service.name}</TableCell>
                                    <TableCell>{service.description.substring(0, 100)}...</TableCell>
                                    <TableCell className="text-right">₱{service.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
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
