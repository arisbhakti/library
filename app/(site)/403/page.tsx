import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 py-8 lg:px-8">
      <section className="grid w-full max-w-xl gap-4 rounded-3xl border border-neutral-200 bg-neutral-25 p-6 text-center shadow-card lg:p-10">
        <p className="text-sm font-semibold text-danger-300">403 Forbidden</p>
        <h1 className="text-display-xs font-bold text-neutral-950 lg:text-display-sm">
          You are not allowed to access this page
        </h1>
        <p className="text-sm text-neutral-700 lg:text-md">
          Halaman ini hanya bisa diakses oleh user dengan role admin.
        </p>
        <div className="flex justify-center">
          <Button
            asChild
            className="h-11 rounded-full bg-primary-300 px-6 text-sm font-semibold text-neutral-25 hover:bg-primary-300/90"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
