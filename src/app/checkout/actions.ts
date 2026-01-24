"use server";

import { z } from "zod";
import type { CartItem } from "@/lib/types";

const OrderSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z.string().min(5, { message: "Address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State is required." }),
  zip: z.string().min(5, { message: "Valid ZIP code is required." }),
  cart: z.string(),
});

export async function processOrder(
  prevState: { message: string, success: boolean },
  formData: FormData
) {
  const parsed = OrderSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    zip: formData.get("zip"),
    cart: formData.get("cart"),
  });

  if (!parsed.success) {
    return {
      message: parsed.error.errors.map((e) => e.message).join(", "),
      success: false,
    };
  }

  const { email, name, address, city, state, zip } = parsed.data;
  const cart: CartItem[] = JSON.parse(parsed.data.cart);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // In a real application, you would process payment here with a service like Stripe.
  // Then, you would send an order confirmation email.
  
  console.log("--- New Order Received ---");
  console.log(`Customer: ${name} (${email})`);
  console.log(`Shipping Address: ${address}, ${city}, ${state} ${zip}`);
  console.log("--- Items ---");
  cart.forEach(item => {
    console.log(`- ${item.product.name} (x${item.quantity}) - $${(item.product.price * item.quantity).toFixed(2)}`);
  });
  console.log(`--- Total: $${(subtotal + 5.00).toFixed(2)} ---`);
  console.log("SIMULATING: Sending order confirmation to store owner and customer.");
  
  // For demonstration, we'll just return a success message.
  return { message: "Order placed successfully!", success: true };
}
