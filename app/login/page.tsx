"use client";

import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAppToast } from "@/components/ui/app-toast";
import {
  getAuthRole,
  login,
  normalizeUserRole,
  saveAuthSession,
} from "@/lib/auth";

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.5 12C2.9 7.8 6.8 5 12 5C17.2 5 21.1 7.8 22.5 12C21.1 16.2 17.2 19 12 19C6.8 19 2.9 16.2 1.5 12Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

type FormValues = {
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>> & {
  form?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLogin(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!emailRegex.test(values.email)) {
    errors.email = "Format email tidak valid.";
  }

  if (!values.password.trim()) {
    errors.password = "Password wajib diisi.";
  } else if (values.password.length < 6) {
    errors.password = "Password minimal 6 karakter.";
  }

  return errors;
}

function getPostLoginPathByRole(role: string | null | undefined): string {
  return normalizeUserRole(role) === "ADMIN" ? "/list" : "/home";
}

export default function LoginPage() {
  const router = useRouter();
  const { showErrorToast, showSuccessToast } = useAppToast();
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isErrorAnimating, setIsErrorAnimating] = useState(false);

  useEffect(() => {
    const role = getAuthRole();
    if (!role) {
      return;
    }

    router.replace(getPostLoginPathByRole(role));
  }, [router]);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      if (!response.success || !response.data?.token || !response.data?.user) {
        const message = response.message || "Login gagal.";
        setErrors({ form: message });
        showErrorToast(message);
        setIsErrorAnimating(true);
        return;
      }

      saveAuthSession(response.data);
      showSuccessToast(response.message || "Login berhasil.");
      setErrors({});
      router.replace(getPostLoginPathByRole(response.data.user.role));
    },
    onError: (error) => {
      setErrors({ form: error.message });
      showErrorToast(error.message);
      setIsErrorAnimating(true);
    },
  });

  useEffect(() => {
    if (!isErrorAnimating) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsErrorAnimating(false);
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [isErrorAnimating]);

  const fieldClass = useMemo(
    () => (hasError: boolean) =>
      `h-12 w-full rounded-xl border bg-neutral-100 px-4 text-md text-neutral-950 outline-none placeholder:text-neutral-500 transition-colors ${
        hasError ? "border-danger-300" : "border-neutral-300"
      }`,
    [],
  );

  const passwordFieldClass = useMemo(
    () => (hasError: boolean) =>
      `flex h-12 items-center gap-3 rounded-xl border bg-neutral-100 px-4 transition-colors ${
        hasError ? "border-danger-300" : "border-neutral-300"
      }`,
    [],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateLogin(formValues);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsErrorAnimating(true);
      return;
    }

    setErrors({});
    loginMutation.mutate({
      email: formValues.email.trim(),
      password: formValues.password,
    });
  };

  const isLoading = loginMutation.isPending;

  return (
    <main className="flex min-h-screen bg-neutral-100 px-6 py-20 items-center justify-center">
      <section className="grid w-full max-w-100 content-start gap-5 justify-self-center">
        <div className="flex items-center gap-3">
          <Image
            alt="Booky logo"
            height={36}
            priority
            src="/booky-logo.svg"
            width={36}
          />
          <span className="display-xs font-semibold text-neutral-950">
            Booky
          </span>
        </div>

        <div className="grid gap-0.5 md:gap-2">
          <h1 className="display-xs md:display-sm font-bold text-neutral-950">
            Login
          </h1>
          <p className="text-sm md:text-md font-semibold text-neutral-700">
            Sign in to manage your library account.
          </p>
        </div>

        <form
          className={`grid gap-4 ${isErrorAnimating ? "animate-shake" : ""}`}
          noValidate
          onSubmit={handleSubmit}
        >
          {errors.form ? (
            <p
              className="rounded-xl bg-danger-300/10 px-4 py-2 text-sm font-semibold text-danger-300 animate-in fade-in duration-200"
              role="alert"
            >
              {errors.form}
            </p>
          ) : null}

          <div className="grid gap-0.5">
            <label
              className="text-sm font-bold text-neutral-950"
              htmlFor="email"
            >
              Email
            </label>
            <input
              autoComplete="email"
              className={fieldClass(Boolean(errors.email))}
              id="email"
              name="email"
              onChange={(event) => {
                setFormValues((prev) => ({
                  ...prev,
                  email: event.target.value,
                }));
                setErrors((prev) => ({ ...prev, email: undefined, form: undefined }));
              }}
              placeholder="Masukkan email"
              value={formValues.email}
              disabled={isLoading}
              type="email"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? (
              <p className="text-sm text-danger-300 animate-in fade-in duration-200">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className="grid gap-0.5">
            <label
              className="text-sm font-bold text-neutral-950"
              htmlFor="password"
            >
              Password
            </label>
            <div className={passwordFieldClass(Boolean(errors.password))}>
              <input
                autoComplete="current-password"
                className="h-full w-full bg-transparent text-md text-neutral-950 outline-none placeholder:text-neutral-500"
                id="password"
                name="password"
                onChange={(event) => {
                  setFormValues((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }));
                  setErrors((prev) => ({
                    ...prev,
                    password: undefined,
                    form: undefined,
                  }));
                }}
                placeholder="Masukkan password"
                value={formValues.password}
                disabled={isLoading}
                type={showPassword ? "text" : "password"}
                aria-invalid={Boolean(errors.password)}
              />
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="flex h-6 w-6 items-center justify-center text-neutral-900"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isLoading}
              >
                <EyeIcon />
              </button>
            </div>
            {errors.password ? (
              <p className="text-sm text-danger-300 animate-in fade-in duration-200">
                {errors.password}
              </p>
            ) : null}
          </div>

          <button
            className="h-12 rounded-full bg-primary-300 text-md font-semibold text-neutral-25 transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-25/40 border-t-neutral-25" />
                <span>Loading...</span>
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="flex items-center justify-center gap-1 text-sm md:text-md font-semibold text-neutral-950">
          <span>Don&apos;t have an account?</span>
          <Link className="font-semibold text-primary-300" href="/register">
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
