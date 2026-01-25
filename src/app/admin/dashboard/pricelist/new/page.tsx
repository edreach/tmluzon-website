import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PricelistForm from "../../pricelist-form";
import type { PricelistFile } from "@/lib/types";

export default function NewPricelistPage() {
  const newPricelist: PricelistFile = {
      id: 'new',
      brand: '',
      title: '',
      fileName: '',
      fileUrl: '',
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Create Pricelist</h1>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>New Pricelist Details</CardTitle>
            <CardDescription>Fill out the form to add a new pricelist to your site.</CardDescription>
        </CardHeader>
        <CardContent>
            <PricelistForm pricelist={newPricelist} />
        </CardContent>
      </Card>
    </>
  );
}

    