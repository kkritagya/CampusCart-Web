"use server";

import { reauthenticateAdmin } from "@/lib/actions/admin_user_actions";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export type AdminAuthState = { error: string };

export async function authenticateAdmin(
  _state: AdminAuthState,
  formData: FormData
): Promise<AdminAuthState> {
  const password = String(formData.get("password") ?? "");
  const email = String(formData.get("email") ?? "");
  if (!password) return { error: "Enter your password to continue." };
  if (!email) return { error: "Your signed-in account could not be identified." };

  const result = await reauthenticateAdmin(email, password);
  if (!result.success) {
    return { error: result.message || "Unable to verify your account." };
  }
  if (!result.data.adminToken) {
    return { error: "Admin verification could not be completed. Restart the backend and try again." };
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_session", result.data.adminToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });

  redirect("/admin/listings");
}
