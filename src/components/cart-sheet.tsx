"use client";

import Image from "next/image";
import Link from "next/link";
import { useInquiry } from "@/contexts/cart-context";
import { Button } from "./ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

export default function CartSheetContent() {
  const { inquiry, updateQuantity, removeFromInquiry } = useInquiry();
  const subtotal = inquiry.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  if (inquiry.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <h3 className="text-lg font-semibold">Your inquiry list is empty</h3>
        <p className="text-muted-foreground">
          Looks like you haven't added anything to your inquiry list yet.
        </p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="flex-grow">
        <div className="flex flex-col gap-4 px-6 py-2">
          {inquiry.map((item) => (
            <div key={item.product.id} className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-md">
                {item.product.imageUrls && item.product.imageUrls.length > 0 ? (
                    <Image
                    src={item.product.imageUrls[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">
                  ₱{item.product.price.toFixed(2)}
                </p>
                <div className="mt-2 flex items-center gap-2">
                    <Button
                        variant="outline" size="icon" className="h-6 w-6"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <Button
                        variant="outline" size="icon" className="h-6 w-6"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromInquiry(item.product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t px-6 py-4">
        <div className="flex justify-between font-semibold">
          <span>Subtotal</span>
          <span>₱{subtotal.toFixed(2)}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          You can submit this inquiry to get a quote.
        </p>
        <Button asChild className="mt-4 w-full" size="lg">
          <Link href="/checkout">Submit Inquiry</Link>
        </Button>
      </div>
    </>
  );
}
