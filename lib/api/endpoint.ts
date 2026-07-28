export const API_BASE_URL =
  process.env.API_BASE_URL ?? "http://localhost:5000/api/v1";
export const API_SERVER_URL =
  process.env.API_SERVER_URL ?? API_BASE_URL.replace(/\/api\/v1\/?$/, "");

export const AUTH_API_BASE_URL =
  process.env.AUTH_API_BASE_URL ?? `${API_BASE_URL}/auth`;

export const LISTING_ENDPOINTS = {
  list: "/listings",
  mine: "/listings/mine",
} as const;

export const AUTH_ENDPOINTS = {
  register: "/register",
  login: "/login",
  me: "/me",
  whoami: "/whoami",
  logout: "/logout",
  update: "/update",
  changePassword: "/password",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
} as const;

export type AuthEndpoint =
  (typeof AUTH_ENDPOINTS)[keyof typeof AUTH_ENDPOINTS];
