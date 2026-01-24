"use client";

import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveProduct } from "./product-actions";
import { useActionState, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";
import { Sparkles } from "lucide-react";
import { enhanceProductDescription } from "@/ai/flows/ai-product-description-augmentation";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Product"}
    </Button>
  );
}

interface ProductFormProps {
  product: Product;
}

export default function ProductForm({ product: initialProduct }: ProductFormProps) {
  const [product, setProduct] = useState(initialProduct);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();
  const [state, formAction] = useActionState(saveProduct, { message: "", success: false });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleAiEnhance = async () => {
    setIsAiLoading(true);
    try {
        const result = await enhanceProductDescription({ productDescription: product.description });
        if (result.enhancedProductDescription) {
            setProduct(prev => ({...prev, description: result.enhancedProductDescription}));
            toast({
                title: 'Description Enhanced!',
                description: 'The product description has been updated with AI.',
            });
        }
    } catch (error) {
        console.error('AI enhancement failed:', error);
        toast({
            title: 'Error',
            description: 'Failed to enhance description.',
            variant: 'destructive',
        });
    } finally {
        setIsAiLoading(false);
    }
  };

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={product.id} />
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" name="name" value={product.name} onChange={handleInputChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input id="price" name="price" type="number" value={product.price} onChange={handleInputChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleInputChange}
          rows={6}
        />
        <Button type="button" variant="outline" size="sm" onClick={handleAiEnhance} disabled={isAiLoading}>
            <Sparkles className={`mr-2 h-4 w-4 ${isAiLoading ? 'animate-spin' : ''}`} />
            {isAiLoading ? 'Enhancing...' : 'Enhance with AI'}
        </Button>
      </div>
      <SubmitButton />
    </form>
  );
}
