"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { useAppToast } from "@/components/ui/app-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthToken } from "@/lib/auth";
import {
  type MyLoan,
  type MyLoanStatusFilter,
  returnLoan,
  tanstackQueryKeys,
  useMyLoansInfiniteQuery,
} from "@/lib/tanstack-api";

const DEFAULT_BOOK_COVER = "/default-book-cover.svg";
const SEARCH_DEBOUNCE_MS = 400;

type UiBorrowedStatus = "active" | "returned" | "overdue";
type LoanAction = "return" | "review";

const borrowedFilters: { label: string; value: MyLoanStatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Returned", value: "returned" },
  { label: "Overdue", value: "overdue" },
];

const statusStyles: Record<UiBorrowedStatus, string> = {
  active: "bg-[#EAF6EB] text-[#169A23]",
  returned: "bg-[#EAF6EB] text-[#169A23]",
  overdue: "bg-[#FFEAF0] text-danger-300",
};

const defaultStatusLabels: Record<UiBorrowedStatus, string> = {
  active: "Active",
  returned: "Returned",
  overdue: "Overdue",
};

function useDebouncedValue(value: string, delayMs: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delayMs, value]);

  return debouncedValue;
}

function getBookCoverSource(coverImage?: string) {
  if (!coverImage) {
    return DEFAULT_BOOK_COVER;
  }

  const normalized = coverImage.trim();
  if (!normalized) {
    return DEFAULT_BOOK_COVER;
  }

  if (
    normalized.startsWith("data:image/") ||
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("/")
  ) {
    return normalized;
  }

  return DEFAULT_BOOK_COVER;
}

function resolveLoanStatus(loan: MyLoan): UiBorrowedStatus {
  const normalizedStatus = (loan.displayStatus || loan.status).toLowerCase();

  if (normalizedStatus.includes("return")) {
    return "returned";
  }

  if (normalizedStatus.includes("overdue")) {
    return "overdue";
  }

  return "active";
}

function getLoanStatusLabel(loan: MyLoan, resolvedStatus: UiBorrowedStatus): string {
  const displayStatus = loan.displayStatus?.trim();
  return displayStatus || defaultStatusLabels[resolvedStatus];
}

function resolveLoanAction(status: string): LoanAction | null {
  const normalizedStatus = status.trim().toUpperCase();

  if (normalizedStatus === "BORROWED" || normalizedStatus === "LATE") {
    return "return";
  }

  if (normalizedStatus === "RETURNED") {
    return "review";
  }

  return null;
}

function formatDate(
  value: string | null,
  options: Intl.DateTimeFormatOptions,
): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", options).format(date);
}

function formatDueDate(value: string | null): string {
  return formatDate(value, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatBorrowDate(value: string | null): string {
  return formatDate(value, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDurationLabel(durationDays: number): string {
  if (!Number.isFinite(durationDays) || durationDays <= 0) {
    return "Duration -";
  }

  return `Duration ${durationDays} ${durationDays === 1 ? "Day" : "Days"}`;
}

function BorrowedItemSkeleton() {
  return (
    <article className="grid gap-3 rounded-3xl p-4 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-7 w-20 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-7 w-32 rounded-lg" />
        </div>
      </div>

      <div className="h-px w-full bg-neutral-200" />

      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex flex-row gap-3 md:gap-4">
          <Skeleton className="h-[106px] w-[70px] md:h-34.5 md:w-23" />
          <div className="flex flex-col items-start justify-center gap-2">
            <Skeleton className="h-6 w-24 rounded-[6px]" />
            <Skeleton className="h-5 w-52" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>

        <Skeleton className="h-10 w-36 rounded-full" />
      </div>
    </article>
  );
}

function EmptyBorrowedState({
  activeFilter,
  searchTerm,
}: {
  activeFilter: MyLoanStatusFilter;
  searchTerm: string;
}) {
  const activeFilterLabel =
    borrowedFilters.find((filter) => filter.value === activeFilter)?.label ||
    "Borrowed";

  const description = searchTerm.trim()
    ? "Try using different keywords, or clear the search box."
    : activeFilter === "all"
      ? "You have no borrowed books yet. Start exploring books and borrow your first one."
      : `No ${activeFilterLabel.toLowerCase()} books found right now.`;

  return (
    <article className="grid place-items-center gap-3 rounded-3xl border border-neutral-200 bg-neutral-25 px-5 py-10 text-center">
      <Image
        alt="No borrowed books illustration"
        className="h-[160px] w-[160px] md:h-[200px] md:w-[200px]"
        height={200}
        src="/empty-borrowed-books.svg"
        width={200}
      />
      <div className="grid gap-1">
        <h2 className="text-lg font-bold text-neutral-950 md:text-xl">
          No borrowed books found
        </h2>
        <p className="text-sm text-neutral-700 md:text-md">{description}</p>
      </div>
    </article>
  );
}

export function BorrowedListTabContent() {
  const { showErrorToast, showSuccessToast } = useAppToast();
  const queryClient = useQueryClient();
  const [borrowedFilter, setBorrowedFilter] = useState<MyLoanStatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(4);
  const [reviewText, setReviewText] = useState("");

  const token = getAuthToken();
  const debouncedSearchTerm = useDebouncedValue(searchTerm, SEARCH_DEBOUNCE_MS);
  const hasToken = Boolean(token);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useMyLoansInfiniteQuery({
    token,
    status: borrowedFilter,
    q: debouncedSearchTerm,
    limit: 3,
    enabled: hasToken,
  });

  const loans = useMemo(
    () => data?.pages.flatMap((page) => page.loans) ?? [],
    [data],
  );

  const returnBookMutation = useMutation({
    mutationFn: async ({ loanId }: { loanId: number }) => {
      if (!token) {
        throw new Error("Sesi login tidak ditemukan. Silakan login kembali.");
      }

      return returnLoan({
        loanId,
        token,
      });
    },
    onSuccess: async (response) => {
      showSuccessToast(response.message || "Return success");
      await queryClient.invalidateQueries({
        queryKey: tanstackQueryKeys.myLoans.all,
      });
    },
    onError: (mutationError: Error) => {
      showErrorToast(mutationError.message || "Return failed");
    },
  });

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

      {!hasToken ? (
        <article className="grid place-items-center gap-2 rounded-3xl border border-neutral-200 p-8 text-center">
          <p className="text-md font-bold text-neutral-950">
            Please login to see your borrowed books.
          </p>
        </article>
      ) : null}

      {hasToken && isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }, (_, index) => (
            <BorrowedItemSkeleton key={`borrowed-item-skeleton-${index}`} />
          ))}
        </div>
      ) : null}

      {hasToken && isError ? (
        <div className="grid place-items-center gap-3 rounded-xl border border-neutral-200 p-6 text-center">
          <p className="text-sm text-neutral-700 md:text-md">
            {(error as Error)?.message || "Failed to load borrowed books."}
          </p>
          <Button className="rounded-full" onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        </div>
      ) : null}

      {hasToken && !isLoading && !isError ? (
        <>
          {loans.length === 0 ? (
            <EmptyBorrowedState
              activeFilter={borrowedFilter}
              searchTerm={debouncedSearchTerm}
            />
          ) : (
            <div className="grid gap-4">
              {loans.map((loan) => {
                const resolvedStatus = resolveLoanStatus(loan);
                const statusLabel = getLoanStatusLabel(loan, resolvedStatus);
                const loanAction = resolveLoanAction(loan.status);
                const isReturningThisLoan =
                  returnBookMutation.isPending &&
                  returnBookMutation.variables?.loanId === loan.id;

                return (
                  <article className="grid gap-3 rounded-3xl p-4 shadow-card" key={loan.id}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm md:text-md font-bold text-neutral-950">
                          Status
                        </span>
                        <span
                          className={`rounded-lg px-2 py-1 text-sm font-bold ${statusStyles[resolvedStatus]}`}
                        >
                          {statusLabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm md:text-md font-bold text-neutral-950">
                          Due Date
                        </span>
                        <span className="rounded-lg bg-[#FFEAF0] px-2 py-1 text-sm font-bold text-[#EE1D52]">
                          {formatDueDate(loan.dueAt)}
                        </span>
                      </div>
                    </div>

                    <div className="h-px w-full bg-neutral-200" />

                    <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
                      <div className="flex flex-row gap-3 md:gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          alt={`${loan.book.title} cover`}
                          className="h-[106px] w-[70px] object-cover md:h-34.5 md:w-23"
                          onError={(event) => {
                            const image = event.currentTarget;
                            if (image.src.endsWith(DEFAULT_BOOK_COVER)) {
                              return;
                            }
                            image.src = DEFAULT_BOOK_COVER;
                          }}
                          src={getBookCoverSource(loan.book.coverImage)}
                        />

                        <div className="flex flex-col items-start justify-center gap-1">
                          <div className="inline-flex w-fit items-center rounded-[6px] border border-neutral-300 px-2">
                            <span className="text-sm font-bold text-neutral-950">
                              {loan.book.category?.name || "Unknown category"}
                            </span>
                          </div>
                          <p className="text-sm md:text-lg font-bold text-neutral-950">
                            {loan.book.title}
                          </p>
                          <p className="text-sm md:text-md font-medium text-neutral-700">
                            {loan.book.author?.name || "Unknown author"}
                          </p>
                          <p className="text-sm md:text-md font-bold text-neutral-900">
                            {formatBorrowDate(loan.borrowedAt)}
                            <span className="px-2 text-neutral-900">·</span>
                            {getDurationLabel(loan.durationDays)}
                          </p>
                        </div>
                      </div>

                      {loanAction === "return" ? (
                        <Button
                          className="h-10 rounded-full bg-primary-300 px-10 text-md font-bold text-neutral-25 hover:bg-primary-300/90"
                          disabled={returnBookMutation.isPending}
                          onClick={() => returnBookMutation.mutate({ loanId: loan.id })}
                          type="button"
                        >
                          {isReturningThisLoan ? "Returning..." : "Return Book"}
                        </Button>
                      ) : null}

                      {loanAction === "review" ? (
                        <Button
                          className="h-10 rounded-full bg-primary-300 px-10 text-md font-bold text-neutral-25 hover:bg-primary-300/90"
                          onClick={() => setIsReviewDialogOpen(true)}
                          type="button"
                        >
                          Give Review
                        </Button>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {hasNextPage ? (
            <div className="flex items-center justify-center">
              <Button
                className="h-10 w-37.5 rounded-full border border-neutral-300 bg-neutral-25 p-2 text-sm text-neutral-950 shadow-none hover:bg-neutral-100 md:h-12 md:w-50 md:text-md font-bold"
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
                variant="outline"
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </Button>
            </div>
          ) : null}

          {isFetchingNextPage ? (
            <div className="grid gap-4">
              {Array.from({ length: 2 }, (_, index) => (
                <BorrowedItemSkeleton key={`borrowed-next-skeleton-${index}`} />
              ))}
            </div>
          ) : null}
        </>
      ) : null}

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
            <p className="text-sm md:text-md font-bold text-neutral-950">
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
