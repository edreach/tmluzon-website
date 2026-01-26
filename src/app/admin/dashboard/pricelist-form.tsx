
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { PricelistFile } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useFirestore, useStorage, addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase";
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from "firebase/storage";
import { Progress } from "@/components/ui/progress";
import { z } from "zod";
import { collection, doc } from "firebase/firestore";
import { FileText, Upload } from "lucide-react";

const PricelistFormSchema = z.object({
  brand: z.string().min(2, "Brand must be at least 2 characters."),
  title: z.string().min(3, "Title must be at least 3 characters."),
  fileUrl: z.string().url("A file must be uploaded."),
  fileName: z.string().min(1, "A file must be uploaded."),
});

export default function PricelistForm({ pricelist: initialPricelist }: { pricelist: PricelistFile }) {
  const [pricelist, setPricelist] = useState(initialPricelist);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const storage = useStorage();

  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
 

  useEffect(() => {
    setPricelist(initialPricelist);
  }, [initialPricelist]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPricelist(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    if (!firestore || !storage) {
        toast({ title: 'Error', description: 'Firebase is not available.', variant: 'destructive' });
        setIsSaving(false);
        return;
    }

    let pricelistToSave = { ...pricelist };

    // If a new file is selected, upload it first
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);

      const sRef = storageRef(storage, `pricelists/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(sRef, file);

      try {
        await new Promise<void>((resolve, reject) => {
            uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error(`Upload failed for ${file.name}:`, error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              pricelistToSave.fileUrl = downloadURL;
              pricelistToSave.fileName = file.name;
              resolve();
            }
          );
        });
      } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Upload Failed',
            description: 'Could not upload the file. Please try again.',
        });
        setIsSaving(false);
        setIsUploading(false);
        return;
      }

      setIsUploading(false);
    }

    const parsed = PricelistFormSchema.safeParse(pricelistToSave);
    if (!parsed.success) {
      toast({
        title: "Validation Error",
        description: parsed.error.errors.map((e) => e.message).join(", "),
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }

    const isNew = pricelist.id === 'new';
    
    if (isNew) {
      addDocumentNonBlocking(collection(firestore, 'pricelists'), parsed.data);
    } else {
      setDocumentNonBlocking(doc(firestore, 'pricelists', pricelist.id), parsed.data, { merge: true });
    }
    
    toast({
        title: 'Pricelist Saved',
        description: 'Your pricelist has been saved successfully.',
    });

    router.push('/admin/dashboard/pricelist');
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
            <Label htmlFor="brand">Brand Name</Label>
            <Input id="brand" name="brand" value={pricelist.brand} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="title">Display Title</Label>
            <Input id="title" name="title" value={pricelist.title} onChange={handleInputChange} />
        </div>
      </div>
      
       <div className="space-y-2">
        <Label htmlFor="file">Pricelist PDF</Label>
        {pricelist.fileUrl && !file && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground border p-2 rounded-md">
                <FileText className="h-4 w-4" />
                <span>Current file: {pricelist.fileName}</span>
                <Button variant="link" asChild className="p-0 h-auto">
                    <a href={pricelist.fileUrl} target="_blank" rel="noopener noreferrer">View</a>
                </Button>
            </div>
        )}
        <div className="relative flex items-center justify-center border-2 border-dashed rounded-md p-4">
            <Label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center text-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-2">{file ? file.name : (pricelist.id === 'new' ? 'Select PDF file' : 'Select new PDF to replace')}</span>
            </Label>
            <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={isUploading || isSaving} accept="application/pdf"/>
        </div>

        {isUploading && (
            <div className="space-y-2 mt-2">
                <p className="text-sm text-muted-foreground">{file?.name}</p>
                <Progress value={uploadProgress} className="w-full h-2" />
            </div>
        )}
      </div>

      <Button type="submit" disabled={isSaving || isUploading}>
        {isSaving ? "Saving..." : "Save Pricelist"}
      </Button>
    </form>
  );
}
    
