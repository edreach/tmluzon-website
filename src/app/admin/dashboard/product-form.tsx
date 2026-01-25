"use client";

import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";
import { Sparkles, Trash2, Upload } from "lucide-react";
import { enhanceProductDescription } from "@/ai/flows/ai-product-description-augmentation";
import { useRouter } from "next/navigation";
import { useFirestore, useStorage } from "@/firebase";
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { z } from "zod";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

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

const ProductFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  type: z.string().min(2, "Type must be at least 2 characters."),
  brand: z.string().min(2, "Brand must be at least 2 characters."),
  subType: z.string().min(2, "Sub-type must be at least 2 characters."),
  imageUrls: z.array(z.string().url()).min(1, "At least one image is required."),
  specifications: z.array(z.object({ name: z.string(), value: z.string()})).optional(),
});


export default function ProductForm({ product: initialProduct }: ProductFormProps) {
  const [product, setProduct] = useState(initialProduct);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const storage = useStorage();

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(initialProduct.imageUrls);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
 

  useEffect(() => {
    setProduct(initialProduct);
    setImageUrls(initialProduct.imageUrls);
  }, [initialProduct]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
    }
  };

  const handleUploadImages = async () => {
    if (imageFiles.length === 0 || !storage) return;
    setIsUploading(true);
    setUploadProgress({});

    const uploadPromises = imageFiles.map(file => {
      return new Promise<string>((resolve, reject) => {
        const sRef = storageRef(storage, `products/${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(sRef, file);

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
          },
          (error) => {
            console.error(`Upload failed for ${file.name}:`, error);
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    });

    try {
      const urls = await Promise.all(uploadPromises);
      setImageUrls(prev => [...prev, ...urls]);
      setImageFiles([]);
      toast({
        title: 'Upload complete',
        description: `${urls.length} image(s) have been uploaded.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'Some images failed to upload. Please check the console and storage rules.',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
      setImageUrls(prev => prev.filter(url => url !== urlToRemove));
  };
  
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    if (!firestore) {
        toast({ title: 'Error', description: 'Firestore is not available.', variant: 'destructive' });
        setIsSaving(false);
        return;
    }

    const productToSave = {
        ...product,
        imageUrls: imageUrls,
        price: Number(product.price) || 0,
    };

    const parsed = ProductFormSchema.safeParse(productToSave);

    if (!parsed.success) {
      toast({
        title: "Validation Error",
        description: parsed.error.errors.map((e) => e.message).join(", "),
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }

    try {
      const isNew = product.id === 'new';
      
      if (isNew) {
        const { id, ...dataToSave } = parsed.data;
        await addDoc(collection(firestore, 'products'), dataToSave);
      } else {
        await setDoc(doc(firestore, 'products', product.id), parsed.data);
      }
      
      toast({
          title: 'Product Saved',
          description: 'Your product has been saved successfully.',
      });

      router.push('/admin/dashboard');

    } catch (error: any) {
        console.error("Error saving product: ", error);
        toast({
            title: 'Save Error',
            description: error.message || 'An unexpected error occurred.',
            variant: 'destructive',
        });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" value={product.name} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" name="price" type="number" value={product.price} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" name="brand" value={product.brand || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Input id="type" name="type" value={product.type || ''} onChange={handleInputChange} />
        </div>
         <div className="space-y-2 md:col-span-2">
            <Label htmlFor="subType">Sub-Type</Label>
            <Input id="subType" name="subType" value={product.subType || ''} onChange={handleInputChange} />
        </div>
      </div>
      
       <div className="space-y-2">
        <Label htmlFor="images">Product Images</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {imageUrls.map((url, index) => (
                <div key={index} className="relative aspect-square">
                    <Image src={url} alt={`Product image ${index + 1}`} fill className="object-cover rounded-md border" />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 z-10" onClick={() => handleRemoveImage(url)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <div className="relative aspect-square flex items-center justify-center border-2 border-dashed rounded-md">
                <Label htmlFor="image-upload" className="cursor-pointer p-4 flex flex-col items-center justify-center text-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-2">Add images</span>
                </Label>
                <Input id="image-upload" type="file" multiple className="sr-only" onChange={handleFileChange} disabled={isUploading} accept="image/*"/>
            </div>
        </div>

        {imageFiles.length > 0 && (
            <div className="space-y-2">
                <Button type="button" onClick={handleUploadImages} disabled={isUploading}>
                    {isUploading ? `Uploading...` : `Upload ${imageFiles.length} image(s)`}
                </Button>
                <div className="text-sm text-muted-foreground">
                    {imageFiles.map(f => f.name).join(', ')}
                </div>
            </div>
        )}
        {isUploading && (
            <div className="space-y-2 mt-2">
                {Object.entries(uploadProgress).map(([name, progress]) => (
                    <div key={name}>
                        <p className="text-sm text-muted-foreground">{name}</p>
                        <Progress value={progress} className="w-full h-2" />
                    </div>
                ))}
            </div>
        )}
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
      <Button type="submit" disabled={isSaving || isUploading}>
        {isSaving ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
}
