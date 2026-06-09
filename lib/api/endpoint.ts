export const AUTH_API_BASE_URL =
  process.env.AUTH_API_BASE_URL ?? "http://localhost:5000/api/auth";

export const AUTH_ENDPOINTS = {
  register: "/register",
  login: "/login",
  me: "/me",
  logout: "/logout",
} as const;

export type AuthEndpoint =
  (typeof AUTH_ENDPOINTS)[keyof typeof AUTH_ENDPOINTS];
