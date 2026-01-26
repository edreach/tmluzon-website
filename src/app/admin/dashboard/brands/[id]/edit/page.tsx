"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BrandForm from "../../../brand-form";
import { notFound, useParams } from "next/navigation";
import type { Brand, BrandData } from "@/lib/types";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

function EditBrandPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const firestore = useFirestore();

  const brandRef = useMemoFirebase(
      () => (firestore && id) ? doc(firestore, 'brands', id) : null,
      [firestore, id]
  );
  const { data: brand, isLoading } = useDoc<BrandData>(brandRef);
  
  if (isLoading) {
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Edit Brand</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle><Skeleton className="h-8 w-64" /></CardTitle>
                    <CardDescription><Skeleton className="h-4 w-96" /></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-32 w-full" /></div>
                        <Skeleton className="h-10 w-32" />
                    </div>
                </CardContent>
            </Card>
        </>
    );
  }

  if (!brand) {
    notFound();
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Edit Brand</h1>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Edit: {brand.name}</CardTitle>
            <CardDescription>Update this brand's details.</CardDescription>
        </CardHeader>
        <CardContent>
            <BrandForm brand={brand as Brand} />
        </CardContent>
      </Card>
    </>
  );
}

export default EditBrandPage;
