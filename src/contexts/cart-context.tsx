"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { InquiryCartItem, Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface InquiryContextType {
  inquiry: InquiryCartItem[];
  addToInquiry: (product: Product, quantity: number) => void;
  removeFromInquiry: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearInquiry: () => void;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [inquiry, setInquiry] = useState<InquiryCartItem[]>([]);
  const { toast } = useToast();

  const addToInquiry = (product: Product, quantity: number) => {
    setInquiry((prevInquiry) => {
      const existingItem = prevInquiry.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevInquiry.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevInquiry, { product, quantity }];
    });
    toast({
      title: "Added to inquiry",
      description: `${quantity} x ${product.name}`,
    });
  };

  const removeFromInquiry = (productId: string) => {
    setInquiry((prevInquiry) => prevInquiry.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromInquiry(productId);
      return;
    }
    setInquiry((prevInquiry) =>
      prevInquiry.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearInquiry = () => {
    setInquiry([]);
  }

  return (
    <InquiryContext.Provider value={{ inquiry, addToInquiry, removeFromInquiry, updateQuantity, clearInquiry }}>
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiry() {
  const context = useContext(InquiryContext);
  if (context === undefined) {
    throw new Error("useInquiry must be used within a InquiryProvider");
  }
  return context;
}
