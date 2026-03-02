"use client";

import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { register } from "@/lib/auth";

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

type RegisterValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type RegisterErrors = Partial<Record<keyof RegisterValues, string>> & {
  form?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\s-]{8,20}$/;

function validateRegister(values: RegisterValues): RegisterErrors {
  const errors: RegisterErrors = {};

  if (!values.name.trim()) {
    errors.name = "Nama wajib diisi.";
  }

  if (!values.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!emailRegex.test(values.email)) {
    errors.email = "Format email tidak valid.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Nomor handphone wajib diisi.";
  } else if (!phoneRegex.test(values.phone)) {
    errors.phone = "Format nomor handphone tidak valid.";
  }

  if (!values.password.trim()) {
    errors.password = "Password wajib diisi.";
  } else if (values.password.length < 6) {
    errors.password = "Password minimal 6 karakter.";
  }

  if (!values.confirmPassword.trim()) {
    errors.confirmPassword = "Konfirmasi password wajib diisi.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Konfirmasi password tidak sama.";
  }

  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formValues, setFormValues] = useState<RegisterValues>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isErrorAnimating, setIsErrorAnimating] = useState(false);
  const [successToastMessage, setSuccessToastMessage] = useState("");
  const redirectTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(
    null,
  );

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (response) => {
      if (!response.success) {
        setErrors({ form: response.message || "Register gagal." });
        setIsErrorAnimating(true);
        return;
      }

      setErrors({});
      setSuccessToastMessage(response.message || "Register berhasil.");

      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
      }

      redirectTimeoutRef.current = window.setTimeout(() => {
        router.push("/login");
      }, 1400);
    },
    onError: (error) => {
      setErrors({ form: error.message });
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

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

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

  const clearFieldError = (field: keyof RegisterValues) => {
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateRegister(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsErrorAnimating(true);
      return;
    }

    setErrors({});
    registerMutation.mutate({
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      phone: formValues.phone.trim(),
      password: formValues.password,
    });
  };

  const isLoading = registerMutation.isPending;

  return (
    <main className="flex min-h-screen bg-neutral-100 px-6 py-20 items-center justify-center">
      {successToastMessage ? (
        <div className="pointer-events-none fixed right-4 top-4 z-50 w-[min(360px,calc(100vw-32px))] rounded-2xl border border-primary-200 bg-neutral-25 p-4 shadow-card animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-sm font-semibold text-primary-300">
            {successToastMessage}
          </p>
          <p className="text-sm text-neutral-700">
            Mengarahkan ke halaman login...
          </p>
        </div>
      ) : null}

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
            Register
          </h1>
          <p className="text-sm md:text-md font-semibold text-neutral-700">
            Create your account to start borrowing books.
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
              htmlFor="name"
            >
              Name
            </label>
            <input
              className={fieldClass(Boolean(errors.name))}
              id="name"
              name="name"
              onChange={(event) => {
                setFormValues((prev) => ({ ...prev, name: event.target.value }));
                clearFieldError("name");
              }}
              placeholder="Masukkan nama"
              value={formValues.name}
              disabled={isLoading}
              type="text"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name ? (
              <p className="text-sm text-danger-300 animate-in fade-in duration-200">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="grid gap-1">
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
                setFormValues((prev) => ({ ...prev, email: event.target.value }));
                clearFieldError("email");
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

          <div className="grid gap-1">
            <label
              className="text-sm font-bold text-neutral-950"
              htmlFor="phone"
            >
              Nomor Handphone
            </label>
            <input
              className={fieldClass(Boolean(errors.phone))}
              id="phone"
              name="phone"
              onChange={(event) => {
                setFormValues((prev) => ({ ...prev, phone: event.target.value }));
                clearFieldError("phone");
              }}
              placeholder="Masukkan nomor handphone"
              value={formValues.phone}
              disabled={isLoading}
              type="tel"
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone ? (
              <p className="text-sm text-danger-300 animate-in fade-in duration-200">
                {errors.phone}
              </p>
            ) : null}
          </div>

          <div className="grid gap-1">
            <label
              className="text-sm font-bold text-neutral-950"
              htmlFor="password"
            >
              Password
            </label>
            <div className={passwordFieldClass(Boolean(errors.password))}>
              <input
                autoComplete="new-password"
                className="h-full w-full bg-transparent text-sm text-neutral-950 outline-none placeholder:text-neutral-500"
                id="password"
                name="password"
                onChange={(event) => {
                  setFormValues((prev) => ({ ...prev, password: event.target.value }));
                  clearFieldError("password");
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

          <div className="grid gap-1">
            <label
              className="text-sm font-bold text-neutral-950"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <div className={passwordFieldClass(Boolean(errors.confirmPassword))}>
              <input
                autoComplete="new-password"
                className="h-full w-full bg-transparent text-md text-neutral-950 outline-none placeholder:text-neutral-500"
                id="confirm-password"
                name="confirmPassword"
                onChange={(event) => {
                  setFormValues((prev) => ({
                    ...prev,
                    confirmPassword: event.target.value,
                  }));
                  clearFieldError("confirmPassword");
                }}
                placeholder="Masukkan konfirmasi password"
                value={formValues.confirmPassword}
                disabled={isLoading}
                type={showConfirmPassword ? "text" : "password"}
                aria-invalid={Boolean(errors.confirmPassword)}
              />
              <button
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                className="flex h-6 w-6 items-center justify-center text-neutral-900"
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                disabled={isLoading}
              >
                <EyeIcon />
              </button>
            </div>
            {errors.confirmPassword ? (
              <p className="text-sm text-danger-300 animate-in fade-in duration-200">
                {errors.confirmPassword}
              </p>
            ) : null}
          </div>

          <button
            className="h-12 rounded-full bg-primary-300 text-lg font-semibold text-neutral-25 transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-25/40 border-t-neutral-25" />
                <span>Loading...</span>
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </form>

        <p className="flex items-center justify-center gap-1 text-sm md:text-md font-semibold text-neutral-950">
          <span>Already have an account?</span>
          <Link className="font-semibold text-primary-300" href="/login">
            Log In
          </Link>
        </p>
      </section>
    </main>
  );
}
