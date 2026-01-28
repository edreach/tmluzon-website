"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection } from "firebase/firestore";
import { z } from "zod";
import type { InquiryData } from "@/lib/types";

const OrderSchema = z.object({
  customerEmail: z.string().email(),
  customerName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z.string().min(5, { message: "Address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State is required." }),
  zip: z.string().min(5, { message: "Valid ZIP code is required." }),
});

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();

  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const shipping = 5.0;
  const total = subtotal + shipping;

  useEffect(() => {
    if (cart.length === 0 && !isProcessing) {
      router.push('/');
    }
  }, [cart, router, isProcessing]);

  const handleProcessOrder = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsProcessing(true);

      if (!firestore) {
          toast({ title: "Error", description: "Could not connect to the database.", variant: "destructive" });
          setIsProcessing(false);
          return;
      }

      const formData = new FormData(e.currentTarget);
      const data = {
          customerEmail: formData.get("email") as string,
          customerName: formData.get("name") as string,
          address: formData.get("address") as string,
          city: formData.get("city") as string,
          state: formData.get("state") as string,
          zip: formData.get("zip") as string,
      };

      const parsed = OrderSchema.safeParse(data);

      if (!parsed.success) {
          toast({
              title: "Validation Error",
              description: parsed.error.errors.map((e) => e.message).join(", "),
              variant: "destructive",
          });
          setIsProcessing(false);
          return;
      }

      const inquiryData: InquiryData = {
          customerName: parsed.data.customerName,
          customerEmail: parsed.data.customerEmail,
          shippingAddress: {
            address: parsed.data.address,
            city: parsed.data.city,
            state: parsed.data.state,
            zip: parsed.data.zip,
          },
          inquiryDate: new Date().toISOString(),
          totalAmount: total,
          status: 'New',
          items: cart.map(item => ({
              productId: item.product.id,
              productName: item.product.name,
              quantity: item.quantity,
              price: item.product.price,
          })),
      };

      try {
          addDocumentNonBlocking(collection(firestore, 'inquiries'), inquiryData);
          toast({
              title: "Order Placed!",
              description: "Thank you for your purchase. We've received your order.",
          });
          clearCart();
          router.push("/");
      } catch (error: any) {
          toast({
              title: "Error",
              description: error.message || "Failed to place order.",
              variant: "destructive",
          });
          setIsProcessing(false);
      }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
        </Link>
      </Button>
      <h1 className="text-3xl font-bold mb-8 font-headline">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <form onSubmit={handleProcessOrder} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" type="text" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" type="text" placeholder="123 Main St" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" type="text" placeholder="Anytown" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" type="text" placeholder="CA" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input id="zip" name="zip" type="text" placeholder="12345" required />
              </div>
            </div>
            <Button type="submit" disabled={isProcessing} className="w-full" size="lg">
              {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing Order...</> : "Place Order"}
            </Button>
          </form>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {item.product.imageUrls && item.product.imageUrls.length > 0 ? (
                        <Image src={item.product.imageUrls[0]} alt={item.product.name} width={64} height={64} className="rounded-md" />
                    ) : (
                        <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                    )}
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">₱{(item.product.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t pt-4 space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <p>Subtotal</p>
                <p>₱{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <p>Shipping</p>
                <p>₱{shipping.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>₱{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
