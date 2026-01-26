"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductForm from "../../../product-form";
import { notFound, useParams } from "next/navigation";
import type { Product } from "@/lib/types";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

function EditProductPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const firestore = useFirestore();

  const productRef = useMemoFirebase(
      () => (firestore && id) ? doc(firestore, 'products', id) : null,
      [firestore, id]
  );
  const { data: product, isLoading } = useDoc<Omit<Product, 'id'>>(productRef);
  
  if (isLoading) {
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Edit Product</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle><Skeleton className="h-8 w-64" /></CardTitle>
                    <CardDescription><Skeleton className="h-4 w-96" /></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                        </div>
                        <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-32 w-full" /></div>
                        <Skeleton className="h-10 w-32" />
                    </div>
                </CardContent>
            </Card>
        </>
    );
  }

  if (!product && !isLoading) {
    notFound();
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Edit Product</h1>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Edit: {product?.name}</CardTitle>
            <CardDescription>Update your product details and use AI to enhance descriptions.</CardDescription>
        </CardHeader>
        <CardContent>
            {product && <ProductForm product={product} />}
        </CardContent>
      </Card>
    </>
  );
}

export default EditProductPage;
