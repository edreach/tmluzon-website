import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductForm from "../../product-form";
import type { Product } from "@/lib/types";

export default function NewProductPage() {
  const newProduct: Product = {
      id: 'new',
      name: '',
      price: 0,
      description: '',
      images: [],
      specifications: [],
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Create Product</h1>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>New Product Details</CardTitle>
            <CardDescription>Fill out the form to add a new product to your catalog.</CardDescription>
        </CardHeader>
        <CardContent>
            <ProductForm product={newProduct} />
        </CardContent>
      </Card>
    </>
  );
}
