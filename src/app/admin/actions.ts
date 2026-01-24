"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(prevState: { message: string }, formData: FormData) {
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
