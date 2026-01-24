"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

const ServiceSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Name must be at least 3 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  description: z.string().min(10, "Description must be at least 10 characters."),
});

export async function saveService(
  prevState: { message: string, success: boolean },
  formData: FormData
) {
  let id = formData.get("id");
  const isNew = id === 'new';

  if (isNew) {
    // In a real app, you would use a more robust unique ID generation
    id = `serv-${Math.random().toString(36).substring(2, 9)}`;
  }

  const parsed = ServiceSchema.safeParse({
    id: id,
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

  const serviceData = parsed.data;

  // In a real application, you would save this data to a database.
  console.log(isNew ? "--- Creating New Service ---" : "--- Updating Service ---");
  console.log(serviceData);
  console.log("--- Service Saved ---");

  revalidatePath("/admin/dashboard/services");

  return { message: "Service saved successfully!", success: true };
}
