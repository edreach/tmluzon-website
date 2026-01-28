
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Service } from "@/lib/types";
import { Sparkles, Trash2, Upload, Star } from "lucide-react";
import { enhanceProductDescription } from "@/ai/flows/ai-product-description-augmentation";
import { useRouter } from "next/navigation";
import { useFirestore, useStorage, addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase";
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from "firebase/storage";
import { collection, doc } from "firebase/firestore";
import { z } from "zod";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

interface ServiceFormProps {
  service: Service;
}

const ServiceFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  imageUrls: z.array(z.string().url()).optional(),
});

export default function ServiceForm({ service: initialService }: ServiceFormProps) {
  const [service, setService] = useState(initialService);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const storage = useStorage();

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(initialService.imageUrls || []);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setService(initialService);
    setImageUrls(initialService.imageUrls || []);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
      setImageUrls(prev => prev.filter(url => url !== urlToRemove));
  };

  const handleSetPrimaryImage = (urlToMakePrimary: string) => {
    setImageUrls(prev => [
        urlToMakePrimary,
        ...prev.filter(url => url !== urlToMakePrimary)
    ]);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    if (!firestore || !storage) {
        toast({ title: 'Error', description: 'Firebase is not available.', variant: 'destructive' });
        setIsSaving(false);
        return;
    }

    let finalImageUrls = [...imageUrls];

    if (imageFiles.length > 0) {
        setIsUploading(true);
        setUploadProgress({});
        
        try {
            const uploadedUrls = await Promise.all(
                imageFiles.map(file => new Promise<string>((resolve, reject) => {
                    const sRef = storageRef(storage, `services/${Date.now()}-${file.name}`);
                    const uploadTask = uploadBytesResumable(sRef, file);
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
                        },
                        (error) => reject(error),
                        () => getDownloadURL(uploadTask.snapshot.ref).then(resolve)
                    );
                }))
            );
            finalImageUrls = [...finalImageUrls, ...uploadedUrls];
            setImageFiles([]);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: 'Some images failed to upload. Please try again.',
            });
            setIsUploading(false);
            setIsSaving(false);
            return;
        } finally {
            setIsUploading(false);
        }
    }

    const serviceToSave = {
      ...service,
      imageUrls: finalImageUrls,
    };

    const { id, ...serviceDataToValidate } = serviceToSave;

    const parsed = ServiceFormSchema.safeParse(serviceDataToValidate);

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
        <Label htmlFor="images">Service Images</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {imageUrls.map((url, index) => (
                <div key={index} className="relative aspect-square group/image">
                    <Image src={url} alt={`Service image ${index + 1}`} fill className="object-cover rounded-md border" />
                    <div className="absolute top-1 right-1 flex flex-col gap-1 z-10">
                        <Button type="button" variant="destructive" size="icon" className="h-6 w-6" onClick={() => handleRemoveImage(url)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button 
                            type="button" 
                            variant={index === 0 ? "secondary" : "ghost"} 
                            size="icon" 
                            className="h-6 w-6 bg-background/70 hover:bg-background"
                            onClick={() => handleSetPrimaryImage(url)}
                            title="Mark as primary image"
                        >
                            <Star className={`h-4 w-4 ${index === 0 ? 'text-yellow-400 fill-yellow-400' : 'text-foreground/50'}`} />
                        </Button>
                    </div>
                    {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5 rounded-b-md">
                            Primary
                        </div>
                    )}
                </div>
            ))}
            <div className="relative aspect-square flex items-center justify-center border-2 border-dashed rounded-md">
                <Label htmlFor="image-upload" className="cursor-pointer p-4 flex flex-col items-center justify-center text-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-2">Add images</span>
                </Label>
                <Input id="image-upload" type="file" multiple className="sr-only" onChange={handleFileChange} disabled={isUploading || isSaving} accept="image/*"/>
            </div>
        </div>

        {imageFiles.length > 0 && (
            <div className="text-sm text-muted-foreground mt-2">
                New files to upload: {imageFiles.map(f => f.name).join(', ')}
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
          value={service.description}
          onChange={handleInputChange}
          rows={6}
        />
        <Button type="button" variant="outline" size="sm" onClick={handleAiEnhance} disabled={isAiLoading}>
            <Sparkles className={`mr-2 h-4 w-4 ${isAiLoading ? 'animate-spin' : ''}`} />
            {isAiLoading ? 'Enhancing...' : 'Enhance with AI'}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isSaving || isUploading}>
            {isSaving ? "Saving..." : "Save Service"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/dashboard/services')} disabled={isSaving || isUploading}>
            Cancel
        </Button>
      </div>
    </form>
  );
}
