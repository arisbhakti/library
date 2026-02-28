"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

type BorrowedStatus = "active" | "returned" | "overdue";

type BorrowedFilter = "all" | BorrowedStatus;

type BorrowedItem = {
  id: number;
  status: BorrowedStatus;
  dueDate: string;
  category: string;
  bookName: string;
  authorName: string;
  borrowDate: string;
  duration: string;
  borrowerName: string;
  image: string;
};

const borrowedFilters: { label: string; value: BorrowedFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Returned", value: "returned" },
  { label: "Overdue", value: "overdue" },
];

const borrowedItems: BorrowedItem[] = [
  {
    id: 1,
    status: "active",
    dueDate: "31 August 2025",
    category: "Category",
    bookName: "Book Name",
    authorName: "Author name",
    borrowDate: "29 Aug 2025",
    duration: "Duration 3 Days",
    borrowerName: "John Doee",
    image: "/dummy-recommendation.png",
  },
  {
    id: 2,
    status: "active",
    dueDate: "31 August 2025",
    category: "Category",
    bookName: "Book Name",
    authorName: "Author name",
    borrowDate: "29 Aug 2025",
    duration: "Duration 3 Days",
    borrowerName: "John Doee",
    image: "/dummy-recommendation.png",
  },
  {
    id: 3,
    status: "active",
    dueDate: "31 August 2025",
    category: "Category",
    bookName: "Book Name",
    authorName: "Author name",
    borrowDate: "29 Aug 2025",
    duration: "Duration 3 Days",
    borrowerName: "John Doee",
    image: "/dummy-recommendation.png",
  },
];

const statusStyles: Record<BorrowedStatus, string> = {
  active: "bg-[#EAF6EB] text-[#169A23]",
  returned: "bg-[#EAF6EB] text-[#169A23]",
  overdue: "bg-[#FFEAF0] text-danger-300",
};

const statusLabels: Record<BorrowedStatus, string> = {
  active: "Active",
  returned: "Returned",
  overdue: "Overdue",
};

export function BorrowedListTabContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<BorrowedFilter>("all");

  const filteredItems = useMemo(() => {
    const byFilter =
      activeFilter === "all"
        ? borrowedItems
        : borrowedItems.filter((item) => item.status === activeFilter);

    if (!searchTerm.trim()) {
      return byFilter;
    }

    const query = searchTerm.toLowerCase();
    return byFilter.filter(
      (item) =>
        item.bookName.toLowerCase().includes(query) ||
        item.authorName.toLowerCase().includes(query) ||
        item.borrowerName.toLowerCase().includes(query),
    );
  }, [activeFilter, searchTerm]);

  return (
    <section className="grid gap-4 lg:gap-6">
      <h1 className="text-display-xs font-semibold text-neutral-950 lg:display-sm">
        Borrowed List
      </h1>

      <label className="flex h-12 w-full items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 px-4 lg:w-[560px]">
        <Image alt="" aria-hidden="true" height={20} src="/icon-search.svg" width={20} />
        <input
          className="h-full w-full bg-transparent text-md text-neutral-950 outline-none placeholder:text-neutral-500"
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search"
          type="text"
          value={searchTerm}
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        {borrowedFilters.map((filter) => {
          const isActive = activeFilter === filter.value;

          return (
            <Button
              className={
                isActive
                  ? "h-10 rounded-full border border-primary-300 bg-neutral-25 px-4 text-md font-semibold text-primary-300 shadow-none hover:bg-neutral-25"
                  : "h-10 rounded-full border border-neutral-300 bg-neutral-25 px-4 text-md font-semibold text-neutral-950 shadow-none hover:bg-neutral-100"
              }
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              variant="outline"
            >
              {filter.label}
            </Button>
          );
        })}
      </div>

      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <article
            className="grid gap-3 rounded-3xl border border-neutral-200 bg-neutral-25 p-4"
            key={item.id}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-display-xs font-semibold text-neutral-950 lg:text-xl">
                  Status
                </span>
                <span
                  className={`rounded-md px-2 py-1 text-md font-semibold ${statusStyles[item.status]}`}
                >
                  {statusLabels[item.status]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-display-xs font-semibold text-neutral-950 lg:text-xl">
                  Due Date
                </span>
                <span className="rounded-md bg-[#FFEAF0] px-2 py-1 text-md font-semibold text-danger-300">
                  {item.dueDate}
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-neutral-200" />

            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="grid gap-2">
                <div className="flex items-start gap-3">
                  <div className="relative h-[160px] w-[106px] overflow-hidden rounded-sm bg-neutral-100 lg:h-[124px] lg:w-[84px]">
                    <Image
                      alt={`${item.bookName} cover`}
                      className="object-cover"
                      fill
                      sizes="106px"
                      src={item.image}
                    />
                  </div>

                  <div className="grid content-start gap-1">
                    <div className="inline-flex w-fit items-center rounded-xl border border-neutral-300 px-3 py-1">
                      <span className="text-display-xs font-semibold text-neutral-950 lg:text-sm">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-display-xs font-semibold text-neutral-950">
                      {item.bookName}
                    </p>
                    <p className="text-xl text-neutral-700">{item.authorName}</p>
                    <p className="text-display-xs font-semibold text-neutral-950 lg:text-xl">
                      {item.borrowDate}
                      <span className="px-2 text-neutral-900">·</span>
                      {item.duration}
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-neutral-200 lg:hidden" />

                <div className="grid gap-0 lg:hidden">
                  <p className="text-display-xs text-neutral-950">borrower&apos;s name</p>
                  <p className="text-display-xs font-semibold text-neutral-950">
                    {item.borrowerName}
                  </p>
                </div>
              </div>

              <div className="hidden justify-items-end gap-0 lg:grid">
                <p className="text-display-xs text-neutral-950">borrower&apos;s name</p>
                <p className="text-display-xs font-semibold text-neutral-950">
                  {item.borrowerName}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
