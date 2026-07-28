"use server";

import { apiRequest } from "@/lib/api/axios-instance";
import { API_BASE_URL } from "@/lib/api/endpoint";
import { AUTH_API_BASE_URL } from "@/lib/api/endpoint";

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "inactive";
  createdAt?: string;
};

export type UserPage = {
  data: AdminUser[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export type AdminUserInput = {
  fullName: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  status: "active" | "inactive";
};

export async function verifyAdminPassword(password: string) {
  return apiRequest<void>("/admin/users/verify", {
    baseUrl: API_BASE_URL,
    method: "POST",
    body: { password },
  });
}

export async function reauthenticateAdmin(email: string, password: string) {
  return apiRequest<{
    user: AdminUser;
    token: string;
    adminToken: string;
  }>("/login", {
    baseUrl: AUTH_API_BASE_URL,
    method: "POST",
    body: { email, password, adminReauth: true },
  });
}

export async function getAdminUsers(page = 1, limit = 10, search = "") {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set("search", search);
  return apiRequest<UserPage>(`/admin/users?${params}`, { baseUrl: API_BASE_URL });
}

export async function createAdminUser(input: AdminUserInput) {
  return apiRequest<AdminUser>("/admin/users", {
    baseUrl: API_BASE_URL,
    method: "POST",
    body: input,
  });
}

export async function updateAdminUser(id: string, input: AdminUserInput) {
  return apiRequest<AdminUser>(`/admin/users/${id}`, {
    baseUrl: API_BASE_URL,
    method: "PATCH",
    body: input,
  });
}

export async function deleteAdminUser(id: string) {
  return apiRequest<void>(`/admin/users/${id}`, {
    baseUrl: API_BASE_URL,
    method: "DELETE",
  });
}
