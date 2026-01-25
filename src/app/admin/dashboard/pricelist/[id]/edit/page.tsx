"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PricelistForm from "../../../pricelist-form";
import { notFound, useParams } from "next/navigation";
import type { PricelistFile } from "@/lib/types";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

function EditPricelistPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const firestore = useFirestore();

  const pricelistRef = useMemoFirebase(
      () => (firestore && id) ? doc(firestore, 'pricelists', id) : null,
      [firestore, id]
  );
  const { data: pricelist, isLoading } = useDoc<PricelistFile>(pricelistRef);
  
  if (isLoading) {
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Edit Pricelist</h1>
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
                        <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                        <Skeleton className="h-10 w-32" />
                    </div>
                </CardContent>
            </Card>
        </>
    );
  }

  if (!pricelist && !isLoading) {
    notFound();
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Edit Pricelist</h1>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Edit: {pricelist?.title}</CardTitle>
            <CardDescription>Update your pricelist details.</CardDescription>
        </CardHeader>
        <CardContent>
            {pricelist && <PricelistForm pricelist={pricelist} />}
        </CardContent>
      </Card>
    </>
  );
}

export default EditPricelistPage;

    