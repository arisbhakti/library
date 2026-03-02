"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthToken } from "@/lib/auth";
import { type MyReview, useMyReviewsInfiniteQuery } from "@/lib/tanstack-api";

const DEFAULT_BOOK_COVER = "/default-book-cover.svg";
const SEARCH_DEBOUNCE_MS = 400;

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

function formatReviewDate(value: string | null): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
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

function ReviewItemSkeleton() {
  return (
    <Card className="gap-0 rounded-3xl border-none py-4 shadow-card">
      <CardContent className="grid gap-3 px-4 lg:gap-4 lg:px-4">
        <Skeleton className="h-4 w-40" />
        <div className="h-px w-full bg-neutral-200" />

        <div className="flex flex-row gap-3 md:gap-4">
          <Skeleton className="h-[106px] w-[70px] md:h-34.5 md:w-23" />
          <div className="flex flex-col items-start justify-center gap-2">
            <Skeleton className="h-6 w-24 rounded-[6px]" />
            <Skeleton className="h-5 w-52" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        <div className="h-px w-full bg-neutral-200" />

        <div className="grid gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton className="h-6 w-6 rounded-full" key={index} />
            ))}
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyReviewsState({ searchTerm }: { searchTerm: string }) {
  const hasSearch = Boolean(searchTerm.trim());

  return (
    <article className="grid place-items-center gap-3 rounded-3xl border border-neutral-200 bg-neutral-25 px-5 py-10 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-neutral-100">
        <Image
          alt=""
          aria-hidden="true"
          className="h-8 w-8"
          height={32}
          src="/icon-star.svg"
          width={32}
        />
      </div>
      <div className="grid gap-1">
        <h2 className="text-lg font-bold text-neutral-950 md:text-xl">
          {hasSearch ? "Review tidak ditemukan" : "Belum ada review"}
        </h2>
        <p className="text-sm text-neutral-700 md:text-md">
          {hasSearch
            ? "Coba kata kunci lain, atau kosongkan pencarian untuk melihat semua review."
            : "Kamu belum memberikan review buku. Mulai dari buku yang sudah kamu baca."}
        </p>
      </div>
    </article>
  );
}

function ReviewStars({ star }: { star: number }) {
  const normalizedStar = Number.isFinite(star) ? Math.max(0, Math.min(5, star)) : 0;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const isActive = index < normalizedStar;

        return (
          <Image
            alt=""
            aria-hidden="true"
            className={isActive ? "h-6 w-6" : "h-6 w-6 grayscale opacity-40"}
            height={24}
            key={index}
            src="/icon-star.svg"
            width={24}
          />
        );
      })}
    </div>
  );
}

function ReviewCard({ review }: { review: MyReview }) {
  return (
    <Card className="gap-0 rounded-3xl border-none py-4 shadow-card">
      <CardContent className="grid gap-3 px-4 lg:gap-4 lg:px-4">
        <p className="text-sm font-semibold text-neutral-950 md:text-md">
          {formatReviewDate(review.createdAt)}
        </p>

        <div className="h-px w-full bg-neutral-200" />

        <div className="flex flex-row gap-3 md:gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={`${review.book.title} cover`}
            className="h-[106px] w-[70px] object-cover md:h-34.5 md:w-23"
            onError={(event) => {
              const image = event.currentTarget;
              if (image.src.endsWith(DEFAULT_BOOK_COVER)) {
                return;
              }
              image.src = DEFAULT_BOOK_COVER;
            }}
            src={getBookCoverSource(review.book.coverImage)}
          />

          <div className="flex flex-col items-start justify-center gap-1">
            <div className="inline-flex w-fit items-center rounded-[6px] border border-neutral-300 px-2">
              <span className="text-sm font-bold text-neutral-950">
                {review.book.category?.name || "Unknown category"}
              </span>
            </div>
            <p className="text-sm font-bold text-neutral-950 md:text-lg">
              {review.book.title}
            </p>
            <p className="text-sm font-medium text-neutral-700 md:text-md">
              {review.book.author?.name || "Unknown author"}
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-neutral-200" />

        <div className="grid gap-2">
          <ReviewStars star={review.star} />
          <p className="text-sm font-semibold text-neutral-950 md:text-md">
            {review.comment}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReviewsTabContent() {
  const [searchTerm, setSearchTerm] = useState("");
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
  } = useMyReviewsInfiniteQuery({
    token,
    q: debouncedSearchTerm,
    limit: 3,
    enabled: hasToken,
  });

  const reviews = useMemo(
    () => data?.pages.flatMap((page) => page.reviews) ?? [],
    [data],
  );

  return (
    <section className="grid gap-4 md:gap-6">
      <h1 className="display-xs md:display-sm font-extrabold text-neutral-950">
        Reviews
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

      {!hasToken ? (
        <article className="grid place-items-center gap-2 rounded-3xl border border-neutral-200 p-8 text-center">
          <p className="text-md font-bold text-neutral-950">
            Please login to see your reviews.
          </p>
        </article>
      ) : null}

      {hasToken && isLoading ? (
        <div className="grid gap-4 lg:gap-5">
          {Array.from({ length: 3 }, (_, index) => (
            <ReviewItemSkeleton key={`review-item-skeleton-${index}`} />
          ))}
        </div>
      ) : null}

      {hasToken && isError ? (
        <div className="grid place-items-center gap-3 rounded-xl border border-neutral-200 p-6 text-center">
          <p className="text-sm text-neutral-700 md:text-md">
            {(error as Error)?.message || "Failed to load reviews."}
          </p>
          <Button className="rounded-full" onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        </div>
      ) : null}

      {hasToken && !isLoading && !isError ? (
        <>
          {reviews.length === 0 ? (
            <EmptyReviewsState searchTerm={debouncedSearchTerm} />
          ) : (
            <div className="grid gap-4 lg:gap-5">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}

          {reviews.length > 0 ? (
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
                    : "No More Reviews"}
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
