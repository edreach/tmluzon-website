"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const LoginSchema = z.object({
  password: z.string(),
});

// In a real app, use environment variables for secrets
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function login(prevState: { message: string }, formData: FormData) {
  const parsed = LoginSchema.safeParse({
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { message: "Invalid form data." };
  }

  if (parsed.data.password !== ADMIN_PASSWORD) {
    return { message: "Incorrect password." };
  }

  cookies().set("session", "admin-session-active", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  redirect("/admin/dashboard");
}

export async function logout() {
  cookies().delete("session");
  redirect("/admin");
}
