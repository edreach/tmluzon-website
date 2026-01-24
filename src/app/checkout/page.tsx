"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { processOrder } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? "Placing Order..." : "Place Order"}
    </Button>
  );
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const [state, formAction] = useActionState(processOrder, {
    message: "",
    success: false,
  });

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const shipping = 5.0;
  const total = subtotal + shipping;

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/');
    }
  }, [cart, router]);
  
  useEffect(() => {
    if (state.success) {
      toast({
        title: "Order Placed!",
        description: "Thank you for your purchase. We've received your order.",
      });
      clearCart();
      router.push("/");
    } else if (state.message) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, clearCart, router, toast]);

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
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="cart" value={JSON.stringify(cart)} />
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
            <SubmitButton />
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
                    <Image src={item.product.images[0].imageUrl} alt={item.product.name} width={64} height={64} className="rounded-md" />
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
