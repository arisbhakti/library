export default function DetailPage() {
  return (
    <main className="grid gap-4 px-4 py-4 lg:px-[120px] lg:py-8">
      <section className="grid gap-2 rounded-2xl border border-neutral-200 bg-neutral-25 p-4 lg:p-6">
        <h1 className="display-xs font-semibold text-neutral-950">Detail Page</h1>
        <p className="text-sm text-neutral-700 lg:text-md">
          Halaman detail ini otomatis menggunakan `app/(site)/layout.tsx` yang berisi Header dan Footer.
        </p>
      </section>
    </main>
  );
}
