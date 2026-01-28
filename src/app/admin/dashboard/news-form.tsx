
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
import { Trash2, Upload, Star } from 'lucide-react';

const NewsFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  date: z.string().min(1, 'Date is required.'),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
  imageUrls: z.array(z.string().url()).optional(),
  imageHint: z.string().optional(),
});

export default function NewsForm({ article: initialArticle }: { article: NewsArticle }) {
  const [article, setArticle] = useState(initialArticle);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const storage = useStorage();

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(initialArticle.imageUrls || []);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setArticle(initialArticle);
    setImageUrls(initialArticle.imageUrls || []);
  }, [initialArticle]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArticle((prev) => ({ ...prev, [name]: value }));
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

    if (!firestore) {
        toast({ title: 'Error', description: 'Firestore is not available.', variant: 'destructive' });
        setIsSaving(false);
        return;
    }
    
    let finalImageUrls = [...imageUrls];

    if (imageFiles.length > 0 && storage) {
        setIsUploading(true);
        setUploadProgress({});
        
        try {
            const uploadedUrls = await Promise.all(
                imageFiles.map(file => new Promise<string>((resolve, reject) => {
                    const sRef = storageRef(storage, `news/${Date.now()}-${file.name}`);
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
    
    const articleToSave = { ...article, imageUrls: finalImageUrls };
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
    router.refresh();
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
        <Label htmlFor="images">Article Images</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {imageUrls.map((url, index) => (
                <div key={index} className="relative aspect-square group/image">
                    <Image src={url} alt={`Article image ${index + 1}`} fill className="object-cover rounded-md border" />
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
