"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthToken } from "@/lib/auth";
import {
  type AdminBookStatus,
  type RecommendationBook,
  useAdminBooksInfiniteQuery,
} from "@/lib/tanstack-api";

const DEFAULT_BOOK_COVER = "/default-book-cover.svg";
const SEARCH_DEBOUNCE_MS = 400;
const BOOKS_PER_PAGE = 4;

const bookFilters: { label: string; value: AdminBookStatus }[] = [
  { label: "All", value: "all" },
  { label: "Available", value: "available" },
  { label: "Borrowed", value: "borrowed" },
  { label: "Returned", value: "returned" },
];

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

function formatRating(rating: number) {
  const fixed = rating.toFixed(2);
  return fixed.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
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

function BookListItemSkeleton() {
  return (
    <article className="grid min-w-0 gap-3 rounded-3xl p-4 shadow-card lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="flex min-w-0 items-start gap-3">
        <Skeleton className="h-[106px] w-[70px] md:h-34.5 md:w-23" />

        <div className="grid min-w-0 content-start gap-2">
          <Skeleton className="h-6 w-28 rounded-[6px]" />
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>

      <div className="grid w-full grid-cols-3 gap-2 lg:flex lg:w-auto lg:items-center">
        <Skeleton className="h-12 w-full rounded-full lg:w-[96px]" />
        <Skeleton className="h-12 w-full rounded-full lg:w-[96px]" />
        <Skeleton className="h-12 w-full rounded-full lg:w-[96px]" />
      </div>
    </article>
  );
}

export function BookListTabContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<AdminBookStatus>("all");
  const [deleteTarget, setDeleteTarget] = useState<RecommendationBook | null>(null);

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
  } = useAdminBooksInfiniteQuery({
    token,
    status: activeFilter,
    q: debouncedSearchTerm,
    limit: BOOKS_PER_PAGE,
    enabled: hasToken,
  });

  const books = data?.pages.flatMap((page) => page.books) ?? [];

  return (
    <section className="mt-3 grid gap-4 lg:gap-6">
      <h1 className="text-display-sm font-extrabold text-neutral-950 ">Book List</h1>

      <Button
        asChild
        className="h-12 w-full rounded-full bg-primary-300 text-md font-semibold text-neutral-25 hover:bg-primary-300/90 lg:w-[216px]"
      >
        <Link href="/book">Add Book</Link>
      </Button>

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
        {bookFilters.map((filter) => {
          const isActive = activeFilter === filter.value;

          return (
            <Button
              className={
                isActive
                  ? "h-10 rounded-full border border-primary-300 bg-neutral-25 px-4 text-md font-bold text-primary-300 shadow-none hover:bg-neutral-25"
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

      {!hasToken ? (
        <div className="grid h-48 place-items-center rounded-3xl border border-neutral-200 bg-neutral-25 px-4 text-center">
          <p className="text-md text-neutral-600">
            Sesi login tidak ditemukan. Silakan login ulang.
          </p>
        </div>
      ) : null}

      {hasToken && isLoading ? (
        <div className="grid gap-3 lg:gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <BookListItemSkeleton key={`book-list-skeleton-${index}`} />
          ))}
        </div>
      ) : null}

      {hasToken && isError ? (
        <div className="grid place-items-center gap-3 rounded-xl border border-neutral-200 p-6 text-center">
          <p className="text-sm text-neutral-700 md:text-md">
            {(error as Error)?.message || "Gagal memuat daftar buku admin."}
          </p>
          <Button className="rounded-full" onClick={() => refetch()} variant="outline">
            Coba Lagi
          </Button>
        </div>
      ) : null}

      {hasToken && !isLoading && !isError ? (
        <>
          <div className="grid gap-3 lg:gap-4">
            {books.map((book) => (
              <article
                className="grid min-w-0 gap-3 rounded-3xl p-4 shadow-card lg:grid-cols-[1fr_auto] lg:items-center"
                key={book.id}
              >
                <div className="flex min-w-0 items-start gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={`${book.title} cover`}
                    className="h-[106px] w-[70px] object-cover md:h-34.5 md:w-23"
                    loading="lazy"
                    onError={(event) => {
                      const image = event.currentTarget;
                      if (image.src.endsWith(DEFAULT_BOOK_COVER)) {
                        return;
                      }
                      image.src = DEFAULT_BOOK_COVER;
                    }}
                    src={getBookCoverSource(book.coverImage)}
                  />

                  <div className="grid min-w-0 content-start gap-1">
                    <div className="inline-flex w-fit items-center rounded-[6px] border border-neutral-300 px-2 py-0">
                      <span className="text-sm font-bold text-neutral-950">
                        {book.category?.name || "Unknown category"}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-lg font-bold text-neutral-950">
                      {book.title}
                    </p>
                    <p className="text-md text-neutral-700">
                      {book.author?.name || "Unknown author"}
                    </p>
                    <div className="flex items-center gap-1">
                      <Image
                        alt=""
                        aria-hidden="true"
                        height={24}
                        src="/icon-star.svg"
                        width={24}
                      />
                      <span className="text-md font-bold text-neutral-950">
                        {formatRating(book.rating)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid w-full grid-cols-3 gap-2 lg:flex lg:w-auto lg:items-center">
                  <Button
                    asChild
                    className="h-12 rounded-full border border-neutral-300 bg-neutral-25 p-2 px-5 text-md font-bold text-neutral-950 shadow-none hover:bg-neutral-100 lg:w-[96px]"
                    variant="outline"
                  >
                    <Link href={`/preview/${book.id}`}>Preview</Link>
                  </Button>
                  <Button
                    asChild
                    className="h-12 rounded-full border border-neutral-300 bg-neutral-25 p-2 px-5 text-md font-bold text-neutral-950 shadow-none hover:bg-neutral-100 lg:w-[96px]"
                    variant="outline"
                  >
                    <Link href={`/book/${book.id}`}>Edit</Link>
                  </Button>
                  <Button
                    className="h-12 rounded-full border border-neutral-300 bg-neutral-25 p-2 px-5 text-md font-bold text-danger-300 shadow-none hover:bg-danger-300/10 lg:w-[96px]"
                    onClick={() => setDeleteTarget(book)}
                    variant="outline"
                  >
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {isFetchingNextPage ? (
            <div className="grid gap-3 lg:gap-4">
              {Array.from({ length: 2 }, (_, index) => (
                <BookListItemSkeleton key={`book-list-next-skeleton-${index}`} />
              ))}
            </div>
          ) : null}

          {books.length === 0 ? (
            <p className="rounded-2xl border border-neutral-200 bg-neutral-25 px-4 py-8 text-center text-sm text-neutral-700 md:text-md">
              Belum ada buku yang cocok dengan filter dan pencarian.
            </p>
          ) : (
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
          )}
        </>
      ) : null}

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        open={Boolean(deleteTarget)}
      >
        <DialogContent
          className="grid gap-3 rounded-3xl border border-neutral-200 bg-neutral-25 p-4 shadow-none lg:max-w-[640px] lg:gap-4 lg:p-6"
          showCloseButton={false}
        >
          <DialogTitle className="display-xs font-semibold text-neutral-950">
            Delete Data
          </DialogTitle>
          <DialogDescription className="text-display-xs text-neutral-900 lg:text-xl">
            Once deleted, you won&apos;t be able to recover this data.
          </DialogDescription>
          <div className="grid grid-cols-2 gap-3">
            <DialogClose asChild>
              <Button
                className="h-11 rounded-full border border-neutral-300 bg-neutral-25 text-md font-semibold text-neutral-950 shadow-none hover:bg-neutral-100"
                variant="outline"
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button className="h-11 rounded-full bg-danger-300 text-md font-semibold text-neutral-25 hover:bg-danger-300/90">
                Confirm
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
