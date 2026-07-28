"use client";

import {
  getCurrentUserAction,
  logoutAction,
  loginWithoutRedirectAction,
} from "@/lib/actions/authentication_action";
import type { AuthUser, LoginPayload } from "@/lib/types/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean;
  refreshUser: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<{ success: boolean; message: string }>;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
  initialUser?: AuthUser | null;
};

export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);

    try {
      const currentUser = await getCurrentUserAction();
      setUser(currentUser);
      return currentUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutAction();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const res = await loginWithoutRedirectAction(payload);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true, message: res.message || "Login successful" };
      }
      return { success: false, message: res.message || "Login failed" };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user?.email),
      isLoading,
      loading: isLoading,
      refreshUser,
      logout,
      login,
      setUser,
    }),
    [user, isLoading, refreshUser, logout, login]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
