
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { NewsArticle } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useFirestore, useStorage, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import { Progress } from '@/components/ui/progress';
import { z } from 'zod';
import { collection, doc } from 'firebase/firestore';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Trash2, Upload } from 'lucide-react';

const NewsFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  date: z.string().min(1, 'Date is required.'),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  imageHint: z.string().optional(),
});

export default function NewsForm({ article: initialArticle }: { article: NewsArticle }) {
  const [article, setArticle] = useState(initialArticle);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const storage = useStorage();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setArticle(initialArticle);
  }, [initialArticle]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArticle((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setArticle(prev => ({ ...prev, imageUrl: '' }));
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

    let articleToSave = { ...article };

    if (imageFile && storage) {
      setIsUploading(true);
      setUploadProgress(0);
      const sRef = storageRef(storage, `news/${Date.now()}-${imageFile.name}`);
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
        articleToSave.imageUrl = downloadURL;
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

    const parsed = NewsFormSchema.safeParse(articleToSave);
    if (!parsed.success) {
      toast({
        title: 'Validation Error',
        description: parsed.error.errors.map((e) => e.message).join(', '),
        variant: 'destructive',
      });
      setIsSaving(false);
      return;
    }
    
    const isNew = article.id === 'new';

    if (isNew) {
      addDocumentNonBlocking(collection(firestore, 'news'), parsed.data);
    } else {
      setDocumentNonBlocking(doc(firestore, 'news', article.id), parsed.data, { merge: true });
    }

    toast({
      title: 'Article Saved',
      description: 'Your news article has been saved successfully.',
    });

    router.push('/admin/dashboard/news');
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={article.title} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" value={article.date} onChange={handleInputChange} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Featured Image</Label>
        {article.imageUrl && (
          <div className="relative aspect-video w-full max-w-sm">
            <Image src={article.imageUrl} alt="Article image" fill className="object-cover rounded-md border" />
            <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 z-10" onClick={handleRemoveImage}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="relative flex items-center justify-center border-2 border-dashed rounded-md p-4">
          <Label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center text-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-2">
              {imageFile ? imageFile.name : 'Select an image'}
            </span>
          </Label>
          <Input id="image-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={isUploading || isSaving} accept="image/*" />
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
          <Input id="imageHint" name="imageHint" value={article.imageHint || ''} onChange={handleInputChange} placeholder="e.g. 'office building'"/>
      </div>


      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" name="content" value={article.content} onChange={handleInputChange} rows={10} />
      </div>

      <Button type="submit" disabled={isSaving || isUploading}>
        {isSaving ? 'Saving...' : 'Save Article'}
      </Button>
    </form>
  );
}
