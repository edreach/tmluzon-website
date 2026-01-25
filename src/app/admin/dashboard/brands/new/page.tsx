import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BrandForm from "../../brand-form";
import type { Brand } from "@/lib/types";

export default function NewBrandPage() {
  const newBrand: Brand = {
      id: 'new',
      name: '',
      logoUrl: '',
      websiteUrl: '',
      imageHint: 'logo design'
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Add Brand</h1>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>New Brand Details</CardTitle>
            <CardDescription>Fill out the form to add a new brand.</CardDescription>
        </CardHeader>
        <CardContent>
            <BrandForm brand={newBrand} />
        </CardContent>
      </Card>
    </>
  );
}
