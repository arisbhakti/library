"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type BorrowedStatus = "active" | "returned" | "overdue";

type BorrowedItem = {
  id: number;
  status: BorrowedStatus;
  dueDate: string;
  category: string;
  name: string;
  author: string;
  borrowDate: string;
  duration: string;
  image: string;
};

const borrowedItems: BorrowedItem[] = [
  {
    id: 1,
    status: "active",
    dueDate: "31 August 2025",
    category: "Category",
    name: "Book Name",
    author: "Author name",
    borrowDate: "29 Aug 2025",
    duration: "Duration 3 Days",
    image: "/dummy-recommendation.png",
  },
  {
    id: 2,
    status: "returned",
    dueDate: "31 August 2025",
    category: "Category",
    name: "Book Name",
    author: "Author name",
    borrowDate: "29 Aug 2025",
    duration: "Duration 3 Days",
    image: "/dummy-recommendation.png",
  },
  {
    id: 3,
    status: "overdue",
    dueDate: "31 August 2025",
    category: "Category",
    name: "Book Name",
    author: "Author name",
    borrowDate: "29 Aug 2025",
    duration: "Duration 3 Days",
    image: "/dummy-recommendation.png",
  },
];

const borrowedFilters = [
  { label: "All", value: "all" as const },
  { label: "Active", value: "active" as const },
  { label: "Returned", value: "returned" as const },
  { label: "Overdue", value: "overdue" as const },
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
  const [borrowedFilter, setBorrowedFilter] = useState<"all" | BorrowedStatus>(
    "all",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(4);
  const [reviewText, setReviewText] = useState("");

  const resetReviewForm = () => {
    setReviewRating(4);
    setReviewText("");
  };

  const handleReviewDialogChange = (open: boolean) => {
    setIsReviewDialogOpen(open);

    if (!open) {
      resetReviewForm();
    }
  };

  const filteredBorrowedItems = useMemo(() => {
    const byStatus =
      borrowedFilter === "all"
        ? borrowedItems
        : borrowedItems.filter((item) => item.status === borrowedFilter);

    if (!searchTerm.trim()) {
      return byStatus;
    }

    const query = searchTerm.toLowerCase();
    return byStatus.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query),
    );
  }, [borrowedFilter, searchTerm]);

  return (
    <section className="grid gap-4">
      <h1 className="display-md font-semibold text-neutral-950">Borrowed List</h1>

      <label className="flex h-12 w-full items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 px-4 lg:w-[560px]">
        <Image alt="" aria-hidden="true" height={20} src="/icon-search.svg" width={20} />
        <input
          className="h-full w-full bg-transparent text-display-xs text-neutral-950 outline-none placeholder:text-neutral-500 lg:text-md"
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search book"
          type="text"
          value={searchTerm}
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        {borrowedFilters.map((filter) => {
          const isActive = borrowedFilter === filter.value;

          return (
            <Button
              className={
                isActive
                  ? "h-12 rounded-full border border-primary-300 bg-neutral-25 px-5 text-display-xs font-semibold text-primary-300 shadow-none hover:bg-neutral-25"
                  : "h-12 rounded-full border border-neutral-300 bg-neutral-25 px-5 text-display-xs font-semibold text-neutral-950 shadow-none hover:bg-neutral-100"
              }
              key={filter.value}
              onClick={() => setBorrowedFilter(filter.value)}
              variant="outline"
            >
              {filter.label}
            </Button>
          );
        })}
      </div>

      <div className="grid gap-4">
        {filteredBorrowedItems.map((item) => (
          <article
            className="grid gap-3 rounded-3xl border border-neutral-200 bg-neutral-25 p-4"
            key={item.id}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="display-xs font-semibold text-neutral-950">Status</span>
                <span
                  className={`rounded-md px-2 py-1 text-md font-semibold ${statusStyles[item.status]}`}
                >
                  {statusLabels[item.status]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="display-xs font-semibold text-neutral-950">Due Date</span>
                <span className="rounded-md bg-[#FFEAF0] px-2 py-1 text-md font-semibold text-danger-300">
                  {item.dueDate}
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-neutral-200" />

            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="flex items-start gap-3">
                <div className="relative aspect-[224/336] w-[116px] overflow-hidden rounded-md lg:w-[80px]">
                  <Image
                    alt={`${item.name} cover`}
                    className="object-cover"
                    fill
                    sizes="120px"
                    src={item.image}
                  />
                </div>

                <div className="grid content-start gap-1">
                  <div className="inline-flex w-fit items-center rounded-xl border border-neutral-300 px-3 py-1">
                    <span className="text-display-xs font-semibold text-neutral-950 lg:text-md">
                      {item.category}
                    </span>
                  </div>
                  <p className="display-sm font-semibold text-neutral-950 lg:display-xs">
                    {item.name}
                  </p>
                  <p className="text-display-xs text-neutral-700 lg:text-xl">
                    {item.author}
                  </p>
                  <p className="display-xs font-semibold text-neutral-950">
                    {item.borrowDate}
                    <span className="px-2 text-neutral-900">·</span>
                    {item.duration}
                  </p>
                </div>
              </div>

              <Button
                className="h-12 rounded-full bg-primary-300 px-10 text-display-xs font-semibold text-neutral-25 hover:bg-primary-300/90 lg:h-10 lg:text-lg"
                onClick={() => setIsReviewDialogOpen(true)}
                type="button"
              >
                Give Review
              </Button>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-center">
        <Button
          className="h-12 rounded-full border border-neutral-300 bg-neutral-25 px-12 text-display-xs font-semibold text-neutral-950 shadow-none hover:bg-neutral-100 lg:h-10 lg:text-lg"
          variant="outline"
        >
          Load More
        </Button>
      </div>

      <Dialog onOpenChange={handleReviewDialogChange} open={isReviewDialogOpen}>
        <DialogContent
          className="grid gap-4 rounded-3xl border border-neutral-200 bg-neutral-25 p-4 lg:max-w-[640px] lg:gap-5 lg:p-6"
          showCloseButton={false}
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="display-xs font-semibold text-neutral-950">
              Give Review
            </DialogTitle>
            <DialogClose asChild>
              <button
                aria-label="Close review dialog"
                className="flex size-8 items-center justify-center rounded-full"
                type="button"
              >
                <Image
                  alt=""
                  aria-hidden="true"
                  height={24}
                  src="/icon-close-search.svg"
                  width={24}
                />
              </button>
            </DialogClose>
          </div>

          <div className="grid justify-items-center gap-2">
            <p className="text-display-xs font-semibold text-neutral-950 lg:text-xl">
              Give Rating
            </p>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const isActive = index < reviewRating;

                return (
                  <button
                    aria-label={`Give ${index + 1} star rating`}
                    className="flex size-12 items-center justify-center"
                    key={index}
                    onClick={() => setReviewRating(index + 1)}
                    type="button"
                  >
                    <Image
                      alt=""
                      aria-hidden="true"
                      className={isActive ? "h-10 w-10" : "h-10 w-10 grayscale opacity-50"}
                      height={40}
                      src="/icon-star.svg"
                      width={40}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <textarea
            className="h-[260px] w-full resize-none rounded-2xl border border-neutral-300 bg-neutral-25 p-4 text-display-xs text-neutral-950 outline-none placeholder:text-neutral-500"
            onChange={(event) => setReviewText(event.target.value)}
            placeholder="Please share your thoughts about this book"
            value={reviewText}
          />

          <Button
            className="h-12 rounded-full bg-primary-300 text-display-xs font-semibold text-neutral-25 hover:bg-primary-300/90"
            onClick={() => setIsReviewDialogOpen(false)}
            type="button"
          >
            Send
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
