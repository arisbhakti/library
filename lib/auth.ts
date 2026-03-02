import axios from "axios";

const authClient = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const AUTH_TOKEN_STORAGE_KEY = "library_auth_token";
export const AUTH_USER_STORAGE_KEY = "library_auth_user";

export type UserRole = "USER" | "ADMIN";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  profilePhoto: string | null;
  role: UserRole;
};

export type LoginData = {
  token: string;
  user: LoginUser;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data?: LoginData;
};

export type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  data?: LoginUser;
};

type JwtPayload = {
  id?: number;
  role?: string;
  iat?: number;
  exp?: number;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await authClient.post<LoginResponse>("/auth/login", payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<LoginResponse>(error)) {
      const message =
        error.response?.data?.message ?? "Login gagal. Silakan coba lagi.";
      throw new Error(message);
    }

    throw new Error("Terjadi kesalahan saat login.");
  }
}

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  try {
    const response = await authClient.post<RegisterResponse>(
      "/auth/register",
      payload,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<RegisterResponse>(error)) {
      const message =
        error.response?.data?.message ?? "Register gagal. Silakan coba lagi.";
      throw new Error(message);
    }

    throw new Error("Terjadi kesalahan saat register.");
  }
}

export function saveAuthToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function saveAuthUser(user: LoginUser): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
}

export function saveAuthSession(data: LoginData): void {
  saveAuthToken(data.token);
  saveAuthUser(data.user);
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function getAuthUser(): LoginUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as LoginUser;
  } catch {
    return null;
  }
}

function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const tokenParts = token.split(".");
    if (tokenParts.length < 2) {
      return null;
    }

    const base64 = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padLength = (4 - (base64.length % 4)) % 4;
    const normalized = base64.padEnd(base64.length + padLength, "=");

    if (typeof window === "undefined") {
      return null;
    }

    const payload = window.atob(normalized);
    return JSON.parse(payload) as JwtPayload;
  } catch {
    return null;
  }
}

export function getRoleFromToken(token: string | null): UserRole | null {
  if (!token) {
    return null;
  }

  const payload = parseJwtPayload(token);
  return payload?.role === "ADMIN" || payload?.role === "USER"
    ? payload.role
    : null;
}

export function getAuthRole(): UserRole | null {
  const userRole = getAuthUser()?.role;
  if (userRole === "ADMIN" || userRole === "USER") {
    return userRole;
  }

  return getRoleFromToken(getAuthToken());
}

export function removeAuthToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

export function removeAuthUser(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

export function clearAuthSession(): void {
  removeAuthToken();
  removeAuthUser();
}
