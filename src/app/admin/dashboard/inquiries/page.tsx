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

type Inquiry = {
    id: string;
    customer: {
        name: string;
        email: string;
    };
    date: string;
    total: number;
    status: "New" | "Viewed" | "Completed";
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
};

const inquiries: Inquiry[] = [
    {
        id: "INQ-001",
        customer: {
            name: "John Doe",
            email: "john.doe@example.com",
        },
        date: "2024-07-29",
        total: 258.00,
        status: "New",
        items: [
            { name: "Aero Minimalist Lamp", quantity: 2, price: 129.00 },
        ],
    },
    {
        id: "INQ-002",
        customer: {
            name: "Jane Smith",
            email: "jane.smith@example.com",
        },
        date: "2024-07-28",
        total: 129.00,
        status: "Viewed",
        items: [
            { name: "Aero Minimalist Lamp", quantity: 1, price: 129.00 },
        ],
    },
    {
        id: "INQ-003",
        customer: {
            name: "Michael Johnson",
            email: "michael.j@example.com",
        },
        date: "2024-07-27",
        total: 387.00,
        status: "Completed",
        items: [
            { name: "Aero Minimalist Lamp", quantity: 3, price: 129.00 },
        ],
    },
];

export default function InquiriesPage() {
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
                                <TableHead>Inquiry ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inquiries.map((inquiry) => (
                                <TableRow key={inquiry.id}>
                                    <TableCell className="font-medium">{inquiry.id}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{inquiry.customer.name}</div>
                                        <div className="text-sm text-muted-foreground">{inquiry.customer.email}</div>
                                    </TableCell>
                                    <TableCell>{inquiry.date}</TableCell>
                                    <TableCell>
                                        <Badge variant={inquiry.status === 'New' ? 'default' : inquiry.status === 'Viewed' ? 'secondary' : 'outline'}>
                                            {inquiry.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">₱{inquiry.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
