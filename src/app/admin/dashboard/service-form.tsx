
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Service } from "@/lib/types";
import { Sparkles } from "lucide-react";
import { enhanceProductDescription } from "@/ai/flows/ai-product-description-augmentation";
import { useRouter } from "next/navigation";
import { useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { z } from "zod";

interface ServiceFormProps {
  service: Service;
}

const ServiceFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  description: z.string().min(10, "Description must be at least 10 characters."),
});

export default function ServiceForm({ service: initialService }: ServiceFormProps) {
  const [service, setService] = useState(initialService);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();

  useEffect(() => {
    setService(initialService);
  }, [initialService]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setService(prev => ({ ...prev, [name]: value }));
  };

  const handleAiEnhance = async () => {
    setIsAiLoading(true);
    try {
        const result = await enhanceProductDescription({ productDescription: service.description });
        if (result.enhancedProductDescription) {
            setService(prev => ({...prev, description: result.enhancedProductDescription}));
            toast({
                title: 'Description Enhanced!',
                description: 'The service description has been updated with AI.',
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

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    if (!firestore) {
        toast({ title: 'Error', description: 'Firestore is not available.', variant: 'destructive' });
        setIsSaving(false);
        return;
    }

    const serviceToValidate = {
        ...service,
        price: Number(service.price) || 0,
    };

    const parsed = ServiceFormSchema.safeParse(serviceToValidate);

    if (!parsed.success) {
      toast({
        title: "Validation Error",
        description: parsed.error.errors.map((e) => e.message).join(", "),
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }

    const isNew = service.id === 'new';
    
    if (isNew) {
      addDocumentNonBlocking(collection(firestore, 'services'), parsed.data);
    } else {
      setDocumentNonBlocking(doc(firestore, 'services', service.id), parsed.data, { merge: true });
    }
    
    toast({
        title: 'Service Saved',
        description: 'Your service has been saved successfully.',
    });

    router.push('/admin/dashboard/services');
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Service Name</Label>
        <Input id="name" name="name" value={service.name} onChange={handleInputChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input id="price" name="price" type="number" value={service.price} onChange={handleInputChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={service.description}
          onChange={handleInputChange}
          rows={6}
        />
        <Button type="button" variant="outline" size="sm" onClick={handleAiEnhance} disabled={isAiLoading}>
            <Sparkles className={`mr-2 h-4 w-4 ${isAiLoading ? 'animate-spin' : ''}`} />
            {isAiLoading ? 'Enhancing...' : 'Enhance with AI'}
        </Button>
      </div>
      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Service"}
      </Button>
    </form>
  );
}
