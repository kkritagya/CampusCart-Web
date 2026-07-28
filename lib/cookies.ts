import { cookies } from "next/headers";

export const AUTH_COOKIE_NAMES = [
  "token",
  "jwt",
  "authToken",
  "accessToken",
] as const;

type ParsedCookieOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  path?: string;
  sameSite?: "lax" | "strict" | "none";
  expires?: Date;
  maxAge?: number;
};

export async function getCookieHeader() {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

export function getSetCookieHeaders(headers: Headers) {
  const withGetSetCookie = headers as Headers & {
    getSetCookie?: () => string[];
  };

  if (typeof withGetSetCookie.getSetCookie === "function") {
    return withGetSetCookie.getSetCookie();
  }

  const setCookie = headers.get("set-cookie");
  return setCookie ? [setCookie] : [];
}

export function parseSetCookie(setCookie: string) {
  const [cookiePair, ...attributes] = setCookie.split(";");
  const separatorIndex = cookiePair.indexOf("=");

  if (separatorIndex === -1) {
    return null;
  }

  const name = cookiePair.slice(0, separatorIndex).trim();
  const value = cookiePair.slice(separatorIndex + 1).trim();
  const options: ParsedCookieOptions = {};

  for (const attribute of attributes) {
    const [rawKey, ...rawValue] = attribute.trim().split("=");
    const key = rawKey.toLowerCase();
    const valuePart = rawValue.join("=");

    if (key === "httponly") {
      options.httpOnly = true;
    } else if (key === "secure") {
      options.secure = true;
    } else if (key === "path") {
      options.path = valuePart;
    } else if (key === "samesite") {
      const sameSite = valuePart.toLowerCase();
      if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
        options.sameSite = sameSite;
      }
    } else if (key === "expires") {
      options.expires = new Date(valuePart);
    } else if (key === "max-age") {
      options.maxAge = Number(valuePart);
    }
  }

  return { name, value, options };
}

export async function applyBackendCookies(response: Response) {
  const cookieStore = await cookies();

  for (const setCookie of getSetCookieHeaders(response.headers)) {
    const parsedCookie = parseSetCookie(setCookie);

    if (parsedCookie) {
      cookieStore.set(
        parsedCookie.name,
        parsedCookie.value,
        parsedCookie.options
      );
    }
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  for (const cookieName of AUTH_COOKIE_NAMES) {
    cookieStore.delete(cookieName);
  }
  cookieStore.delete("admin_session");
}
