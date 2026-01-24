"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";

interface AddToCartButtonProps {
    product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-md border p-1">
            <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >
            <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity(q => q + 1)}
            >
            <Plus className="h-4 w-4" />
            </Button>
        </div>
        <Button onClick={handleAddToCart} className="flex-1" variant="outline">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
        </Button>
    </div>
  );
}
