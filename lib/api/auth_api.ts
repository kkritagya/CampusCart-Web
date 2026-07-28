import type { AuthUser, LoginPayload, RegisterPayload } from "@/lib/types/auth";
import {
  unwrapBackendPayload,
  type BackendEnvelope,
} from "@/lib/types/api";
import { clearAuthCookies } from "@/lib/cookies";
import { apiRequest } from "./axios-instance";
import { AUTH_ENDPOINTS } from "./endpoint";

export type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/lib/types/auth";

export type { ApiResult } from "@/lib/types/api";

export function registerUser(payload: RegisterPayload) {
  return apiRequest<AuthUser>(AUTH_ENDPOINTS.register, {
    method: "POST",
    body: payload,
  });
}

export function loginUser(payload: LoginPayload) {
  return apiRequest<AuthUser>(AUTH_ENDPOINTS.login, {
    method: "POST",
    body: payload,
  });
}

export function fetchCurrentUser() {
  return apiRequest<AuthUser>(AUTH_ENDPOINTS.whoami, {
    authenticated: true,
  });
}

export function logoutUser() {
  return apiRequest<{ message?: string }>(AUTH_ENDPOINTS.logout, {
    method: "POST",
    authenticated: true,
  });
}

export function updateUserProfile(payload: FormData) {
  return apiRequest<AuthUser>(AUTH_ENDPOINTS.update, {
    method: "PUT",
    body: payload,
    authenticated: true,
  });
}

export function changePassword(payload: unknown) {
  return apiRequest<{ message?: string }>(AUTH_ENDPOINTS.changePassword, {
    method: "PUT",
    body: payload,
    authenticated: true,
  });
}

export function requestPasswordReset(email: string) {
  return apiRequest<undefined>(AUTH_ENDPOINTS.forgotPassword, {
    method: "POST",
    body: { email },
  });
}

export function submitPasswordReset(token: string, newPassword: string) {
  return apiRequest<undefined>(AUTH_ENDPOINTS.resetPassword, {
    method: "POST",
    body: { token, newPassword },
  });
}

export async function clearCommonAuthCookies() {
  await clearAuthCookies();
}

export function normalizeAuthUser(data: unknown): AuthUser | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const unwrapped = unwrapBackendPayload<AuthUser>(
    data as BackendEnvelope<AuthUser>
  );

  if (unwrapped && typeof unwrapped === "object" && "email" in unwrapped) {
    return unwrapped;
  }

  return null;
}
