"use server";

import { z } from "zod";

const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Name must be at least 3 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  description: z.string().min(10, "Description must be at least 10 characters."),
});

export async function saveProduct(
  prevState: { message: string, success: boolean },
  formData: FormData
) {
  const parsed = ProductSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    price: formData.get("price"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return {
      message: parsed.error.errors.map((e) => e.message).join(", "),
      success: false,
    };
  }

  const productData = parsed.data;

  // In a real application, you would save this data to a database.
  console.log("--- Saving Product ---");
  console.log(productData);
  console.log("--- Product Saved ---");

  return { message: "Product saved successfully!", success: true };
}
