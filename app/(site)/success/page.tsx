"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { MdCheck } from "react-icons/md";

import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const searchParams = useSearchParams();

  const returnDateLabel = useMemo(() => {
    const dueAt = searchParams.get("dueAt");
    const parsedDate = dueAt ? dayjs(dueAt) : dayjs().add(3, "day");

    if (!parsedDate.isValid()) {
      return dayjs().add(3, "day").format("D MMMM YYYY");
    }

    return parsedDate.format("D MMMM YYYY");
  }, [searchParams]);

  return (
    <main className="grid min-h-[calc(100vh-64px)] content-start justify-items-center gap-8 px-4 py-16 lg:min-h-[calc(100vh-80px)] lg:px-[120px] lg:py-24">
      <section className="grid justify-items-center gap-6 md:gap-8">
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute h-[117.01px] w-[117.01px] rounded-full border border-neutral-200" />
          <div className="absolute h-[129.69px] w-[129.69px] rounded-full border border-neutral-200" />
          <div className="absolute h-[142.38px] w-[142.38px] rounded-full border border-neutral-200" />
          <div className="relative flex h-[82.81px] w-[82.81px] items-center justify-center rounded-full bg-primary-300 lg:h-24 lg:w-24">
            <MdCheck className="h-12 w-12 text-neutral-25" />
          </div>
        </div>

        <div className="grid justify-items-center gap-3">
          <h1 className="text-xl font-bold text-neutral-950 md:display-sm lg:display-sm">
            Borrowing Successful!
          </h1>
          <p className="text-center text-md font-medium text-neutral-900 md:text-lg">
            Your book has been successfully borrowed. Please return it by{" "}
            <span className="font-bold text-[#EE1D52]">{returnDateLabel}</span>
          </p>
        </div>

        <Button
          asChild
          className="h-12 w-full rounded-full bg-primary-300 text-md font-bold text-neutral-25 hover:bg-primary-300/90 lg:h-12 lg:w-96 lg:text-lg"
        >
          <Link href="/profile?tab=borrowed-list">See Borrowed List</Link>
        </Button>
      </section>
    </main>
  );
}
