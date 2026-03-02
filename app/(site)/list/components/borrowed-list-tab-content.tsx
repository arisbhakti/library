"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthToken } from "@/lib/auth";
import {
  type AdminLoan,
  type AdminLoanStatusFilter,
  useAdminLoansInfiniteQuery,
} from "@/lib/tanstack-api";

const DEFAULT_BOOK_COVER = "/default-book-cover.svg";
const SEARCH_DEBOUNCE_MS = 400;
const LOANS_PER_PAGE = 4;

type UiBorrowedStatus = "active" | "returned" | "overdue";

const borrowedFilters: { label: string; value: AdminLoanStatusFilter }[] = [
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
    normalized.startsWith("/") ||
    normalized.startsWith("blob:")
  ) {
    return normalized;
  }

  return DEFAULT_BOOK_COVER;
}

function resolveLoanStatus(loan: AdminLoan): UiBorrowedStatus {
  const normalizedStatus = (loan.displayStatus || loan.status).toLowerCase();

  if (normalizedStatus.includes("return")) {
    return "returned";
  }

  if (normalizedStatus.includes("overdue")) {
    return "overdue";
  }

  return "active";
}

function getLoanStatusLabel(loan: AdminLoan, resolvedStatus: UiBorrowedStatus): string {
  const displayStatus = loan.displayStatus?.trim();
  return displayStatus || defaultStatusLabels[resolvedStatus];
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
        <div className="grid gap-2">
          <div className="flex flex-row gap-3 md:gap-4">
            <Skeleton className="h-[106px] w-[70px] md:h-34.5 md:w-23" />
            <div className="flex flex-col items-start justify-center gap-2">
              <Skeleton className="h-6 w-24 rounded-[6px]" />
              <Skeleton className="h-5 w-52" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>

          <div className="h-px w-full bg-neutral-200 lg:hidden" />

          <div className="grid gap-0 lg:hidden">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-44" />
          </div>
        </div>

        <div className="hidden justify-items-end gap-0 lg:grid">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-44" />
        </div>
      </div>
    </article>
  );
}

function EmptyBorrowedState({
  activeFilter,
  searchTerm,
}: {
  activeFilter: AdminLoanStatusFilter;
  searchTerm: string;
}) {
  const activeFilterLabel =
    borrowedFilters.find((filter) => filter.value === activeFilter)?.label ||
    "Borrowed";

  const description = searchTerm.trim()
    ? "Try using different keywords, or clear the search box."
    : activeFilter === "all"
      ? "No borrowed books found."
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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<AdminLoanStatusFilter>("all");

  const token = getAuthToken();
  const hasToken = Boolean(token);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, SEARCH_DEBOUNCE_MS);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useAdminLoansInfiniteQuery({
    token,
    status: activeFilter,
    q: debouncedSearchTerm,
    limit: LOANS_PER_PAGE,
    enabled: hasToken,
  });

  const loans = useMemo(
    () => data?.pages.flatMap((page) => page.loans) ?? [],
    [data],
  );

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

      {!hasToken ? (
        <article className="grid place-items-center gap-2 rounded-3xl border border-neutral-200 p-8 text-center">
          <p className="text-md font-bold text-neutral-950">
            Sesi login tidak ditemukan. Silakan login ulang.
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
              activeFilter={activeFilter}
              searchTerm={debouncedSearchTerm}
            />
          ) : (
            <div className="grid gap-4">
              {loans.map((loan) => {
                const resolvedStatus = resolveLoanStatus(loan);
                const statusLabel = getLoanStatusLabel(loan, resolvedStatus);

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
                        <span className="rounded-lg bg-[#FFEAF0] px-2 py-1 text-sm font-bold text-danger-300">
                          {formatDueDate(loan.dueAt)}
                        </span>
                      </div>
                    </div>

                    <div className="h-px w-full bg-neutral-200" />

                    <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
                      <div className="grid gap-2">
                        <div className="flex flex-row gap-3 md:gap-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt={`${loan.book.title} cover`}
                            className="h-[106px] w-[70px] object-cover md:h-34.5 md:w-23"
                            loading="lazy"
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
                            <p className="text-sm md:text-lg font-bold text-neutral-950">
                              {formatBorrowDate(loan.borrowedAt)}
                              <span className="px-2 text-neutral-900">·</span>
                              {getDurationLabel(loan.durationDays)}
                            </p>
                          </div>
                        </div>

                        <div className="h-px w-full bg-neutral-200 lg:hidden" />

                        <div className="grid gap-0 lg:hidden">
                          <p className="text-sm text-neutral-950">borrower&apos;s name</p>
                          <p className="text-lg font-bold text-neutral-950">
                            {loan.borrower.name}
                          </p>
                        </div>
                      </div>

                      <div className="hidden justify-items-end gap-0 lg:grid">
                        <p className="text-md text-neutral-950">borrower&apos;s name</p>
                        <p className="display-xs font-bold text-neutral-950">
                          {loan.borrower.name}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {isFetchingNextPage ? (
            <div className="grid gap-4">
              {Array.from({ length: 2 }, (_, index) => (
                <BorrowedItemSkeleton key={`borrowed-next-skeleton-${index}`} />
              ))}
            </div>
          ) : null}

          <div className="flex items-center justify-center">
            <Button
              className="h-10 w-37.5 rounded-full border border-neutral-300 bg-neutral-25 p-2 text-sm font-bold text-neutral-950 shadow-none hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60 md:h-12 md:w-50 md:text-md"
              disabled={isFetchingNextPage || !hasNextPage}
              onClick={() => fetchNextPage()}
              variant="outline"
            >
              {isFetchingNextPage
                ? "Loading..."
                : hasNextPage
                  ? "Load More"
                  : "No More Books"}
            </Button>
          </div>
        </>
      ) : null}
    </section>
  );
}
