"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useBookDetailQuery,
  useRecommendationInfiniteQuery,
} from "@/lib/tanstack-api";

const DEFAULT_BOOK_COVER = "/default-book-cover.svg";
const DEFAULT_AUTHOR_AVATAR = "/dummy-avatar.png";

function formatRating(rating: number) {
  const fixed = rating.toFixed(2);
  return fixed.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function formatReviewDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
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

function getAuthorFallback(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return "AU";
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

function BookDetailSkeleton() {
  return (
    <div className="grid gap-4 lg:gap-6">
      <Skeleton className="h-5 w-64" />

      <section className="grid gap-9 lg:grid-cols-[auto_1fr]">
        <div className="grid justify-center">
          <Skeleton className="h-[318px] w-[212px] md:h-[482px] md:w-[321px]" />
        </div>

        <div className="grid content-start gap-4">
          <Skeleton className="h-7 w-40 rounded-[6px]" />
          <div className="grid gap-2">
            <Skeleton className="h-9 w-full max-w-96" />
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-6 w-28" />
          </div>

          <div className="grid grid-cols-3 gap-3 md:w-96.5">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton className="h-14 w-full" key={`detail-stat-${index}`} />
            ))}
          </div>

          <section className="grid gap-2 border-t border-neutral-200 pt-4">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </section>

          <div className="hidden w-fit gap-3 md:flex">
            <Skeleton className="h-11 w-50 rounded-full" />
            <Skeleton className="h-11 w-50 rounded-full" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 border-t border-neutral-200 pt-8">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <article
              className="grid gap-2 rounded-2xl bg-white p-4 shadow-card"
              key={`detail-review-skeleton-${index}`}
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-14.5 rounded-full md:size-16" />
                <div className="grid w-full gap-2">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function RelatedBooksSkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
      {Array.from({ length: 4 }, (_, index) => (
        <article
          className="grid gap-0 overflow-hidden rounded-xl shadow-card"
          key={`related-book-skeleton-${index}`}
        >
          <Skeleton className="h-[258px] w-full rounded-b-none rounded-t-xl md:h-84" />
          <div className="grid gap-2 p-3 md:p-4">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <div className="flex items-center gap-2">
              <Skeleton className="size-6" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function DetailPage() {
  const params = useParams<{ id: string }>();
  const [reviewState, setReviewState] = useState<{
    bookId: number | null;
    count: number;
  }>({
    bookId: null,
    count: 6,
  });

  const bookId = useMemo(() => {
    const parsed = Number(params.id);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return null;
    }
    return parsed;
  }, [params.id]);

  const {
    data: book,
    error,
    isError,
    isLoading,
    refetch,
  } = useBookDetailQuery(bookId);
  const {
    data: relatedBooksData,
    error: relatedBooksError,
    isError: isRelatedBooksError,
    isLoading: isRelatedBooksLoading,
    refetch: refetchRelatedBooks,
  } = useRecommendationInfiniteQuery({ by: "popular", limit: 4 });

  const relatedBooks = useMemo(
    () => relatedBooksData?.pages[0]?.books.slice(0, 4) ?? [],
    [relatedBooksData],
  );

  const authorName = book?.author?.name || "Unknown author";
  const categoryName = book?.category?.name || "Unknown category";
  const visibleReviewCount = reviewState.bookId === bookId ? reviewState.count : 6;
  const visibleReviews = book?.reviews.slice(0, visibleReviewCount) ?? [];
  const hasMoreReviews = (book?.reviews.length ?? 0) > visibleReviewCount;

  if (bookId === null) {
    return (
      <main className="grid place-items-center gap-3 px-4 py-16 text-center lg:px-30">
        <p className="text-sm text-neutral-700 md:text-md">ID buku tidak valid.</p>
        <Link
          className="text-sm font-bold text-primary-300 hover:text-primary-300/90 md:text-md"
          href="/"
        >
          Kembali ke Home
        </Link>
      </main>
    );
  }

  return (
    <>
      <main className="grid gap-4 px-4 pb-24 pt-4 lg:gap-6 lg:px-30 lg:pb-20 lg:pt-8">
        {isLoading ? <BookDetailSkeleton /> : null}

        {isError ? (
          <div className="grid place-items-center gap-3 rounded-xl border border-neutral-200 p-6 text-center">
            <p className="text-sm text-neutral-700 md:text-md">
              {(error as Error)?.message || "Gagal memuat detail buku."}
            </p>
            <Button className="rounded-full" onClick={() => refetch()} variant="outline">
              Coba Lagi
            </Button>
          </div>
        ) : null}

        {!isLoading && !isError && book ? (
          <>
            <Breadcrumb>
              <BreadcrumbList className="gap-1 text-xs lg:text-sm">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    asChild
                    className="font-semibold text-primary-300 hover:text-primary-300/90"
                  >
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-neutral-900 [&>svg]:size-4" />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    asChild
                    className="font-semibold text-primary-300 hover:text-primary-300/90"
                  >
                    <Link
                      href={{
                        pathname: "/category",
                        query: { category: categoryName },
                      }}
                    >
                      {categoryName}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-neutral-900 [&>svg]:size-4" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-neutral-950">
                    {book.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <section className="grid gap-9 lg:grid-cols-[auto_1fr]">
              <div className="grid justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={`${book.title} cover`}
                  className="h-[318px] w-[212px] object-cover md:h-[482px] md:w-[321px]"
                  onError={(event) => {
                    const image = event.currentTarget;
                    if (image.src.endsWith(DEFAULT_BOOK_COVER)) {
                      return;
                    }
                    image.src = DEFAULT_BOOK_COVER;
                  }}
                  src={getBookCoverSource(book.coverImage)}
                />
              </div>

              <div className="grid content-start gap-4">
                <div className="inline-flex w-fit items-center rounded-[6px] border border-neutral-300 px-2 py-0">
                  <span className="text-sm font-bold text-neutral-950 md:text-md">
                    {categoryName}
                  </span>
                </div>

                <div className="grid gap-1">
                  <h1 className="display-xs font-bold text-neutral-950 lg:display-sm">
                    {book.title}
                  </h1>
                  <p className="text-sm text-neutral-700 md:text-md">{authorName}</p>
                  <div className="flex items-center gap-1">
                    <Image
                      alt=""
                      aria-hidden="true"
                      height={24}
                      src="/icon-star.svg"
                      width={24}
                    />
                    <span className="text-md font-bold text-neutral-950">
                      {formatRating(book.rating)} ({book.reviewCount} Ulasan)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 md:w-96.5">
                  <div className="grid gap-0">
                    <p className="text-lg font-bold text-neutral-950 md:display-xs">
                      {book.totalCopies}
                    </p>
                    <p className="text-sm font-medium text-neutral-900 md:text-md">
                      Total Copies
                    </p>
                  </div>
                  <div className="grid gap-0 border-l border-neutral-300 pl-3">
                    <p className="text-lg font-bold text-neutral-950 md:display-xs">
                      {book.availableCopies}
                    </p>
                    <p className="text-sm font-medium text-neutral-900 md:text-md">
                      Available
                    </p>
                  </div>
                  <div className="grid gap-0 border-l border-neutral-300 pl-3">
                    <p className="text-lg font-bold text-neutral-950 md:display-xs">
                      {book.reviewCount}
                    </p>
                    <p className="text-sm font-medium text-neutral-900 md:text-md">
                      Reviews
                    </p>
                  </div>
                </div>

                <section className="grid gap-2 border-t border-neutral-200 pt-4">
                  <h2 className="text-xl font-bold text-neutral-950">Description</h2>
                  <p className="text-sm font-medium text-neutral-900 md:text-md">
                    {book.description || "-"}
                  </p>
                </section>

                <div className="hidden w-fit gap-3 md:flex">
                  <Button
                    className="h-11 w-50 rounded-full border border-neutral-300 bg-neutral-25 p-2 text-md font-bold text-neutral-950 shadow-none hover:bg-neutral-100"
                    variant="outline"
                  >
                    Add to Cart
                  </Button>
                  <Button className="h-11 w-50 rounded-full bg-primary-300 p-2 text-md font-bold text-neutral-25 hover:bg-primary-300/90">
                    Borrow Book
                  </Button>
                </div>
              </div>
            </section>

            <section className="grid gap-4 border-t border-neutral-200 pt-8">
              <h2 className="display-xs font-extrabold text-neutral-950 md:display-lg">
                Review
              </h2>
              <div className="flex items-center gap-1">
                <Image
                  alt=""
                  aria-hidden="true"
                  className="md:h-8.5 md:w-8.5"
                  height={24}
                  src="/icon-star.svg"
                  width={24}
                />
                <span className="text-md font-bold text-neutral-950 md:text-xl md:font-extrabold">
                  {formatRating(book.rating)} ({book.reviewCount} Ulasan)
                </span>
              </div>

              {book.reviews.length > 0 ? (
                <>
                  <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
                    {visibleReviews.map((review) => (
                      <article
                        className="grid gap-2 rounded-2xl bg-white p-4 shadow-card"
                        key={review.id}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="size-14.5 md:size-16">
                            <AvatarImage
                              alt={review.user?.name || "User"}
                              src={DEFAULT_AUTHOR_AVATAR}
                            />
                            <AvatarFallback>
                              {getAuthorFallback(review.user?.name || "User")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid gap-0">
                            <p className="text-sm font-bold text-neutral-950 md:text-lg">
                              {review.user?.name || "Anonymous"}
                            </p>
                            <p className="text-sm font-medium text-neutral-950 md:text-md">
                              {formatReviewDate(review.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.star }, (_, index) => (
                            <Image
                              alt=""
                              aria-hidden="true"
                              height={24}
                              key={`${review.id}-star-${index}`}
                              src="/icon-star.svg"
                              width={24}
                            />
                          ))}
                        </div>

                        <p className="text-sm font-semibold text-neutral-950 md:text-md">
                          {review.comment || "-"}
                        </p>
                      </article>
                    ))}
                  </div>

                  {hasMoreReviews ? (
                    <div className="flex items-center justify-center">
                      <Button
                        className="h-10 w-37.5 rounded-full border border-neutral-300 bg-neutral-25 p-2 text-sm font-bold text-neutral-950 shadow-none hover:bg-neutral-100 md:h-12 md:w-50 md:text-md"
                        onClick={() =>
                          setReviewState((current) => {
                            const baseCount =
                              current.bookId === bookId ? current.count : 6;
                            return {
                              bookId,
                              count: baseCount + 6,
                            };
                          })
                        }
                        variant="outline"
                      >
                        Load More
                      </Button>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="text-sm text-neutral-700 md:text-md">
                  Belum ada review untuk buku ini.
                </p>
              )}
            </section>

            <section className="grid gap-4 border-t border-neutral-200 pt-8">
              <h2 className="display-xs font-extrabold text-neutral-950 md:display-lg">
                Related Books
              </h2>

              {isRelatedBooksLoading ? <RelatedBooksSkeletonGrid /> : null}

              {isRelatedBooksError ? (
                <div className="grid place-items-center gap-3 rounded-xl border border-neutral-200 p-6 text-center">
                  <p className="text-sm text-neutral-700 md:text-md">
                    {(relatedBooksError as Error)?.message ||
                      "Gagal memuat related books."}
                  </p>
                  <Button
                    className="rounded-full"
                    onClick={() => refetchRelatedBooks()}
                    variant="outline"
                  >
                    Coba Lagi
                  </Button>
                </div>
              ) : null}

              {!isRelatedBooksLoading && !isRelatedBooksError ? (
                <>
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
                    {relatedBooks.map((relatedBook) => (
                      <Link href={`/detail/${relatedBook.id}`} key={relatedBook.id}>
                        <article className="grid gap-0 overflow-hidden rounded-xl shadow-card">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt={`${relatedBook.title} cover`}
                            className="h-[258px] w-full object-cover md:h-84"
                            loading="lazy"
                            onError={(event) => {
                              const image = event.currentTarget;
                              if (image.src.endsWith(DEFAULT_BOOK_COVER)) {
                                return;
                              }
                              image.src = DEFAULT_BOOK_COVER;
                            }}
                            src={getBookCoverSource(relatedBook.coverImage)}
                          />
                          <div className="grid gap-0.5 p-3 md:gap-1 md:p-4">
                            <p className="text-sm font-bold text-neutral-950 lg:text-lg">
                              {relatedBook.title}
                            </p>
                            <p className="text-sm text-neutral-700 lg:text-md">
                              {relatedBook.author?.name || "Unknown author"}
                            </p>
                            <div className="flex items-center gap-1">
                              <Image
                                alt=""
                                aria-hidden="true"
                                height={24}
                                src="/icon-star.svg"
                                width={24}
                              />
                              <span className="text-sm font-semibold text-neutral-700 lg:text-md">
                                {formatRating(relatedBook.rating)}
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>

                  {relatedBooks.length === 0 ? (
                    <p className="text-sm text-neutral-700 md:text-md">
                      Belum ada related books.
                    </p>
                  ) : null}
                </>
              ) : null}
            </section>
          </>
        ) : null}
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-neutral-200 bg-neutral-25 px-4 py-4 lg:hidden">
        <div className="flex h-10 w-full gap-3">
          <Button
            className="h-10 flex-1 rounded-full border border-neutral-300 bg-neutral-25 text-md font-semibold text-neutral-950 shadow-none hover:bg-neutral-100"
            variant="outline"
          >
            Add to Cart
          </Button>
          <Button className="h-10 flex-1 rounded-full bg-primary-300 text-md font-semibold text-neutral-25 hover:bg-primary-300/90">
            Borrow Book
          </Button>
        </div>
      </div>
    </>
  );
}
