'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Brand } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useFirestore, useStorage } from '@/firebase';
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import { Progress } from '@/components/ui/progress';
import { z } from 'zod';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import { Trash2, Upload } from 'lucide-react';

const BrandFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  logoUrl: z.string().url('A logo image must be uploaded.'),
  websiteUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  imageHint: z.string().optional(),
});

export default function BrandForm({ brand: initialBrand }: { brand: Brand }) {
  const [brand, setBrand] = useState(initialBrand);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const storage = useStorage();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setBrand(initialBrand);
  }, [initialBrand]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBrand((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setBrand(prev => ({ ...prev, logoUrl: '' }));
    setImageFile(null);
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    if (!firestore) {
      toast({ title: 'Error', description: 'Firestore is not available.', variant: 'destructive' });
      setIsSaving(false);
      return;
    }

    let brandToSave = { ...brand };

    if (imageFile && storage) {
      setIsUploading(true);
      setUploadProgress(0);
      const sRef = storageRef(storage, `brands/${Date.now()}-${imageFile.name}`);
      const uploadTask = uploadBytesResumable(sRef, imageFile);

      try {
        const downloadURL = await new Promise<string>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => reject(error),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });
        brandToSave.logoUrl = downloadURL;
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: 'Could not upload the image. Please try again.',
        });
        setIsSaving(false);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const parsed = BrandFormSchema.safeParse(brandToSave);
    if (!parsed.success) {
      toast({
        title: 'Validation Error',
        description: parsed.error.errors.map((e) => e.message).join(', '),
        variant: 'destructive',
      });
      setIsSaving(false);
      return;
    }

    try {
      const isNew = brand.id === 'new';
      const { id, ...dataToSave } = parsed.data;

      if (isNew) {
        await addDoc(collection(firestore, 'brands'), dataToSave);
      } else {
        await setDoc(doc(firestore, 'brands', brand.id), dataToSave);
      }

      toast({
        title: 'Brand Saved',
        description: 'The brand has been saved successfully.',
      });

      router.push('/admin/dashboard/brands');
      router.refresh(); // To ensure the layout re-fetches any data if needed
    } catch (error: any) {
      console.error('Error saving brand: ', error);
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
      <div className="space-y-2">
        <Label htmlFor="name">Brand Name</Label>
        <Input id="name" name="name" value={brand.name} onChange={handleInputChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="websiteUrl">Website URL (Optional)</Label>
        <Input id="websiteUrl" name="websiteUrl" value={brand.websiteUrl || ''} onChange={handleInputChange} placeholder="https://example.com" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="logo">Brand Logo</Label>
        {brand.logoUrl && (
          <div className="relative aspect-video w-full max-w-sm bg-muted rounded-md border p-2">
            <Image src={brand.logoUrl} alt="Brand logo" fill className="object-contain" />
            <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 z-10" onClick={handleRemoveImage}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="relative flex items-center justify-center border-2 border-dashed rounded-md p-4">
          <Label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center justify-center text-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-2">
              {imageFile ? imageFile.name : 'Select an image'}
            </span>
          </Label>
          <Input id="logo-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={isUploading || isSaving} accept="image/*" />
        </div>
        {isUploading && (
          <div className="space-y-2 mt-2">
            <p className="text-sm text-muted-foreground">{imageFile?.name}</p>
            <Progress value={uploadProgress} className="w-full h-2" />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
          <Label htmlFor="imageHint">Image Hint (for AI)</Label>
          <Input id="imageHint" name="imageHint" value={brand.imageHint || ''} onChange={handleInputChange} placeholder="e.g. 'company logo'"/>
      </div>

      <Button type="submit" disabled={isSaving || isUploading}>
        {isSaving ? 'Saving...' : 'Save Brand'}
      </Button>
    </form>
  );
}
