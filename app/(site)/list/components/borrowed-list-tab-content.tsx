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
    <section className="grid gap-4 md:gap-6">
      <h1 className="display-xs md:display-sm font-bold text-neutral-950">
        Borrowed List
      </h1>

      <label className="flex h-11 w-full items-center gap-2 rounded-full border border-neutral-300 px-4 lg:w-[560px]">
        <Image
          alt=""
          aria-hidden="true"
          height={20}
          src="/icon-search.svg"
          width={20}
        />
        <input
          className="h-full w-full bg-transparent text-sm text-neutral-950 outline-none placeholder:text-neutral-500"
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
                  ? "h-10 rounded-full border border-primary-300 bg-neutral-25 px-5 text-sm md:text-md font-bold text-primary-300 shadow-none hover:bg-neutral-25"
                  : "h-10 rounded-full border border-neutral-300 bg-neutral-25 px-5 text-sm md:text-md font-semibold text-neutral-950 shadow-none hover:bg-neutral-100"
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
          <article className="grid gap-3 rounded-3xl p-4 shadow-card" key={item.id}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-md font-bold text-neutral-950">
                  Status
                </span>
                <span
                  className={`rounded-lg px-2 py-1 text-sm font-bold ${statusStyles[item.status]}`}
                >
                  {statusLabels[item.status]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm md:text-md font-bold text-neutral-950">
                  Due Date
                </span>
                <span className="rounded-lg bg-[#FFEAF0] px-2 py-1 text-sm font-bold text-danger-300">
                  {item.dueDate}
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-neutral-200" />

            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="grid gap-2">
                <div className="flex flex-row gap-3 md:gap-4">
                  <Image
                    alt={`${item.bookName} cover`}
                    className="h-[106px] w-[70px] md:h-34.5 md:w-23"
                    height={106}
                    src={item.image}
                    width={70}
                  />

                  <div className="flex flex-col items-start justify-center gap-1">
                    <div className="inline-flex w-fit items-center rounded-[6px] border border-neutral-300 px-2">
                      <span className="text-sm font-bold text-neutral-950">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-sm md:text-lg font-bold text-neutral-950">
                      {item.bookName}
                    </p>
                    <p className="text-sm md:text-md font-medium text-neutral-700">
                      {item.authorName}
                    </p>
                    <p className="text-sm md:text-lg font-bold text-neutral-950">
                      {item.borrowDate}
                      <span className="px-2 text-neutral-900">·</span>
                      {item.duration}
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-neutral-200 lg:hidden" />

                <div className="grid gap-0 lg:hidden">
                  <p className="text-sm text-neutral-950">borrower&apos;s name</p>
                  <p className="text-lg font-bold text-neutral-950">
                    {item.borrowerName}
                  </p>
                </div>
              </div>

              <div className="hidden justify-items-end gap-0 lg:grid">
                <p className="text-md text-neutral-950">borrower&apos;s name</p>
                <p className="display-xs font-bold text-neutral-950">
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
