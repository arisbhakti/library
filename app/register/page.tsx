import Image from "next/image";
import Link from "next/link";

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

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

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;
  const showError = params.error === "1";

  const fieldClass = `h-12 w-full rounded-xl border bg-neutral-100 px-4 text-md text-neutral-950 outline-none placeholder:text-neutral-500 ${
    showError ? "border-danger-300" : "border-neutral-300"
  }`;
  const passwordFieldClass = `flex h-12 items-center gap-3 rounded-xl border bg-neutral-100 px-4 ${
    showError ? "border-danger-300" : "border-neutral-300"
  }`;

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
            Register
          </h1>
          <p className="text-sm md:text-md font-semibold text-neutral-700">
            Create your account to start borrowing books.
          </p>
        </div>

        <form className="grid gap-4">
          <div className="grid gap-0.5">
            <label
              className="text-sm font-bold text-neutral-950"
              htmlFor="name"
            >
              Name
            </label>
            <input className={fieldClass} id="name" name="name" type="text" />
            {showError ? (
              <p className="text-sm text-danger-300">Text Helper</p>
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
              className={fieldClass}
              id="email"
              name="email"
              type="email"
            />
            {showError ? (
              <p className="text-sm text-danger-300">Text Helper</p>
            ) : null}
          </div>

          <div className="grid gap-1">
            <label
              className="text-sm font-bold text-neutral-950"
              htmlFor="phone"
            >
              Nomor Handphone
            </label>
            <input className={fieldClass} id="phone" name="phone" type="tel" />
            {showError ? (
              <p className="text-sm text-danger-300">Text Helper</p>
            ) : null}
          </div>

          <div className="grid gap-1">
            <label
              className="text-sm font-bold text-neutral-950"
              htmlFor="password"
            >
              Password
            </label>
            <div className={passwordFieldClass}>
              <input
                autoComplete="new-password"
                className="h-full w-full bg-transparent text-sm text-neutral-950 outline-none placeholder:text-neutral-500"
                id="password"
                name="password"
                type="password"
              />
              <button
                aria-label="Show password"
                className="flex h-6 w-6 items-center justify-center text-neutral-900"
                type="button"
              >
                <EyeIcon />
              </button>
            </div>
            {showError ? (
              <p className="text-sm text-danger-300">Text Helper</p>
            ) : null}
          </div>

          <div className="grid gap-1">
            <label
              className="text-sm font-bold text-neutral-950"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <div className={passwordFieldClass}>
              <input
                autoComplete="new-password"
                className="h-full w-full bg-transparent text-md text-neutral-950 outline-none placeholder:text-neutral-500"
                id="confirm-password"
                name="confirmPassword"
                type="password"
              />
              <button
                aria-label="Show confirm password"
                className="flex h-6 w-6 items-center justify-center text-neutral-900"
                type="button"
              >
                <EyeIcon />
              </button>
            </div>
            {showError ? (
              <p className="text-sm text-danger-300">Text Helper</p>
            ) : null}
          </div>

          <button
            className="h-12 rounded-full bg-primary-300 text-lg font-semibold text-neutral-25"
            type="submit"
          >
            Submit
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
