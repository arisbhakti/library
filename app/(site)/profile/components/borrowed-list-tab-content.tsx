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
    <section className="grid gap-4 md:gap-6">
      <h1 className="display-xs md:display-sm font-bold text-neutral-950">
        Borrowed List
      </h1>

      <label className="flex h-11 w-full items-center gap-2 rounded-full border border-neutral-300  px-4 lg:w-[560px]">
        <Image
          alt=""
          aria-hidden="true"
          height={20}
          src="/icon-search.svg"
          width={20}
        />
        <input
          className="h-full w-full bg-transparent text-sm text-neutral-950 outline-none placeholder:text-neutral-500 "
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
                  ? "h-10 rounded-full border border-primary-300 bg-neutral-25 px-5 text-sm md:text-md font-bold text-primary-300 shadow-none hover:bg-neutral-25"
                  : "h-10 rounded-full border border-neutral-300 bg-neutral-25 px-5 text-sm md:text-md font-semibold text-neutral-950 shadow-none hover:bg-neutral-100"
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
            className="grid gap-3 rounded-3xl border border-neutral-200 bg-neutral-25 p-4 shadow-card"
            key={item.id}
          >
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
                <span className="rounded-lg bg-[#FFEAF0] px-2 py-1 text-sm font-bold text-[#EE1D52]">
                  {item.dueDate}
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-neutral-200" />

            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="flex flex-row gap-3 md:gap-4">
                <Image
                  alt={`${item.name} cover`}
                  className="md:w-23 md:h-34.5"
                  width={70}
                  height={106}
                  src={item.image}
                />

                <div className="flex flex-col items-start justify-center gap-1">
                  <div className="inline-flex w-fit items-center rounded-[6px] border border-neutral-300 px-2">
                    <span className="text-sm font-bold text-neutral-950">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm md:text-lg font-bold text-neutral-950">
                    {item.name}
                  </p>
                  <p className="text-sm md:text-md font-medium text-neutral-700">
                    {item.author}
                  </p>
                </div>
              </div>

              <Button
                className="h-10 rounded-full bg-primary-300 px-10 text-md font-bold text-neutral-25 hover:bg-primary-300/90 "
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
          className="h-10 md:h-12 md:w-50 w-37.5 rounded-full border border-neutral-300 bg-neutral-25 p-2 text-sm  text-neutral-950 shadow-none hover:bg-neutral-100 md:text-md font-bold"
          variant="outline"
        >
          Load More
        </Button>
      </div>

      <Dialog onOpenChange={handleReviewDialogChange} open={isReviewDialogOpen}>
        <DialogContent
          className="grid gap-4 rounded-3xl border border-neutral-200 bg-neutral-25 p-4 md:max-w-109.75 lg:gap-5 lg:p-6"
          showCloseButton={false}
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg md:display-xs font-extrabold text-neutral-950">
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
            <p className="text-sm md:text-md font-bold text-neutral-950 ">
              Give Rating
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => {
                const isActive = index < reviewRating;

                return (
                  <button
                    aria-label={`Give ${index + 1} star rating`}
                    className="flex size-10 md:size-12.25 items-center justify-center"
                    key={index}
                    onClick={() => setReviewRating(index + 1)}
                    type="button"
                  >
                    <Image
                      alt=""
                      aria-hidden="true"
                      className={
                        isActive
                          ? "h-10 w-10 md:h-12.25 md:w-12.25"
                          : "h-10 w-10 md:h-12.25 md:w-12.25 grayscale opacity-50"
                      }
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
            className="h-[260px] w-full resize-none rounded-2xl border border-neutral-300 bg-neutral-25 p-4 text-sm md:text-md text-neutral-950 outline-none placeholder:text-neutral-500"
            onChange={(event) => setReviewText(event.target.value)}
            placeholder="Please share your thoughts about this book"
            value={reviewText}
          />

          <Button
            className="h-10 md:h-12 rounded-full bg-primary-300 text-sm md:text-md font-bold text-neutral-25 hover:bg-primary-300/90"
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
