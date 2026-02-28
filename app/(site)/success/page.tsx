import { MdCheck } from "react-icons/md";

import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <main className="grid min-h-[calc(100vh-64px)] content-start justify-items-center gap-8 px-4 py-16 lg:min-h-[calc(100vh-80px)] lg:px-[120px] lg:py-24">
      <section className="grid justify-items-center gap-8">
        <div className="relative flex h-56 w-56 items-center justify-center lg:h-40 lg:w-40">
          <div className="absolute h-44 w-44 rounded-full border border-neutral-200 lg:h-24 lg:w-24" />
          <div className="absolute h-48 w-48 rounded-full border border-neutral-200 lg:h-28 lg:w-28" />
          <div className="absolute h-52 w-52 rounded-full border border-neutral-200 lg:h-32 lg:w-32" />
          <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-primary-300 lg:h-24 lg:w-24">
            <MdCheck className="h-20 w-20 text-neutral-25 lg:h-12 lg:w-12" />
          </div>
        </div>

        <div className="grid justify-items-center gap-3">
          <h1 className="display-md text-center font-semibold text-neutral-950 lg:display-sm">Borrowing Successful!</h1>
          <p className="text-center text-display-xs text-neutral-950 lg:text-display-xs">
            Your book has been successfully borrowed.
          </p>
          <p className="text-center text-display-xs text-neutral-950 lg:text-display-xs">
            Please return it by <span className="font-semibold text-danger-300">31 August 2025</span>
          </p>
        </div>

        <Button className="h-14 w-full rounded-full bg-primary-300 text-display-xs font-semibold text-neutral-25 hover:bg-primary-300/90 lg:h-12 lg:w-96 lg:text-lg">
          See Borrowed List
        </Button>
      </section>
    </main>
  );
}
