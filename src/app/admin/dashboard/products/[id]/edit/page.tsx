import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductForm from "../../../product-form";
import { productListings } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Product } from "@/lib/types";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const productListing = productListings.find(p => p.id === id);

  if (!productListing) {
    notFound();
  }

  const productForForm: Product = {
      id: productListing.id,
      name: productListing.name,
      price: productListing.price,
      description: productListing.description,
      type: productListing.type,
      images: [], 
      specifications: [],
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Edit Product</h1>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Edit: {productForForm.name}</CardTitle>
            <CardDescription>Update your product details and use AI to enhance descriptions.</CardDescription>
        </CardHeader>
        <CardContent>
            <ProductForm product={productForForm} />
        </CardContent>
      </Card>
    </>
  );
}
