"use server";

import {
  clearCommonAuthCookies,
  fetchCurrentUser,
  loginUser,
  logoutUser,
  normalizeAuthUser,
  registerUser,
  updateUserProfile,
  changePassword,
  type AuthUser,
  type LoginPayload,
  requestPasswordReset,
  submitPasswordReset,
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
  void _previousState;
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
  void _previousState;
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

  redirect(user.role?.toLowerCase() === "admin" ? "/admin" : "/dashboard");
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

export async function updateProfileAction(
  _previousState: AuthActionState = defaultActionState,
  formData: FormData
): Promise<AuthActionState> {
  void _previousState;
  const fullName = formData.get("fullName") as string;

  if (!fullName || fullName.trim().length < 2) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: {
        fullName: ["Full name must be at least 2 characters"],
      },
    };
  }

  const result = await updateUserProfile(formData);

  if (!result.success) {
    return {
      success: false,
      message: result.message,
    };
  }

  return {
    success: true,
    message: "Profile updated successfully.",
  };
}

export async function changePasswordAction(
  _previousState: AuthActionState = defaultActionState,
  formData: FormData
): Promise<AuthActionState> {
  void _previousState;
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const fieldErrors: FieldErrors = {};
  if (!currentPassword) {
    fieldErrors.currentPassword = ["Current password is required"];
  }
  if (!newPassword || newPassword.length < 6) {
    fieldErrors.newPassword = ["New password must be at least 6 characters"];
  }
  if (newPassword !== confirmPassword) {
    fieldErrors.confirmPassword = ["Passwords do not match"];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  const result = await changePassword({ currentPassword, newPassword });

  if (!result.success) {
    return {
      success: false,
      message: result.message,
    };
  }

  return {
    success: true,
    message: "Password changed successfully.",
  };
}

export async function loginWithoutRedirectAction(payload: LoginPayload) {
  const result = await loginUser(payload);
  if (!result.success) {
    return { success: false, message: result.message };
  }
  const user = await getCurrentUserAction();
  return { success: true, message: result.message, user };
}

export async function forgotPasswordAction(
  _previousState: AuthActionState = defaultActionState,
  formData: FormData
): Promise<AuthActionState> {
  void _previousState;
  const email = String(formData.get("email") ?? "").trim();
  if (!z.email().safeParse(email).success) {
    return {
      success: false,
      message: "Please enter a valid email address.",
      fieldErrors: { email: ["A valid email is required."] },
    };
  }
  const result = await requestPasswordReset(email);
  return {
    success: result.success,
    message: result.success
      ? "If an account exists for that email, a reset link has been sent."
      : result.message,
  };
}

export async function resetPasswordAction(
  _previousState: AuthActionState = defaultActionState,
  formData: FormData
): Promise<AuthActionState> {
  void _previousState;
  const token = String(formData.get("token") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const fieldErrors: FieldErrors = {};
  if (!token) fieldErrors.token = ["The reset link is missing or invalid."];
  if (newPassword.length < 8) {
    fieldErrors.newPassword = ["Password must be at least 8 characters."];
  }
  if (newPassword !== confirmPassword) {
    fieldErrors.confirmPassword = ["Passwords do not match."];
  }
  if (Object.keys(fieldErrors).length) {
    return { success: false, message: "Please correct the highlighted fields.", fieldErrors };
  }
  const result = await submitPasswordReset(token, newPassword);
  return { success: result.success, message: result.message ?? (result.success ? "Password reset successfully." : "Password reset failed.") };
}
