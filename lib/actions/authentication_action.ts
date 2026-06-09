"use server";

import {
  clearCommonAuthCookies,
  fetchCurrentUser,
  loginUser,
  logoutUser,
  normalizeAuthUser,
  registerUser,
  type AuthUser,
} from "@/lib/api/auth_api";
import { loginSchema, registerSchema } from "@/lib/validation";
import { redirect } from "next/navigation";
import { z } from "zod";

export type FieldErrors = Record<string, string[] | undefined>;

export type AuthActionState = {
  success: boolean;
  message: string;
  fieldErrors?: FieldErrors;
};

const defaultActionState: AuthActionState = {
  success: false,
  message: "",
};

function buildValidationError(error: z.ZodError): AuthActionState {
  return {
    success: false,
    message: "Please fix the highlighted fields.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

export async function registerAction(
  _previousState: AuthActionState = defaultActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsedFields = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsedFields.success) {
    return buildValidationError(parsedFields.error);
  }

  const result = await registerUser({
    fullName: parsedFields.data.fullName,
    email: parsedFields.data.email,
    password: parsedFields.data.password,
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message,
    };
  }

  redirect("/login");
}

export async function loginAction(
  _previousState: AuthActionState = defaultActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsedFields.success) {
    return buildValidationError(parsedFields.error);
  }

  const result = await loginUser(parsedFields.data);

  if (!result.success) {
    return {
      success: false,
      message: result.message,
    };
  }

  const user = await getCurrentUserAction();

  if (!user?.email) {
    return {
      success: false,
      message:
        "Login succeeded but your session could not be started. Please try again.",
    };
  }

  redirect("/dashboard");
}

export async function getCurrentUserAction(): Promise<AuthUser | null> {
  const result = await fetchCurrentUser();

  if (!result.success) {
    return null;
  }

  return normalizeAuthUser(result.data);
}

export async function requireCurrentUser() {
  const user = await getCurrentUserAction();

  if (!user?.email) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireCurrentUser();

  if (user.role?.toLowerCase() !== "admin") {
    redirect("/dashboard");
  }

  return user;
}

export async function logoutAction() {
  await logoutUser();
  await clearCommonAuthCookies();
  redirect("/login");
}

export async function authenticateUser(data: FormData) {
  return loginAction(defaultActionState, data);
}
