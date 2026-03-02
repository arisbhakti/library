import axios from "axios";

const authClient = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const AUTH_TOKEN_STORAGE_KEY = "library_auth_token";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  profilePhoto: string | null;
  role: string;
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

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function removeAuthToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}
