import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductForm from "./product-form";
import { product } from "@/lib/data";

export default function Dashboard() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Edit Product</CardTitle>
            <CardDescription>Manage your product details and use AI to enhance descriptions.</CardDescription>
        </CardHeader>
        <CardContent>
            <ProductForm product={product} />
        </CardContent>
      </Card>
    </>
  );
}
