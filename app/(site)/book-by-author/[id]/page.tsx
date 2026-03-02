"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthorBooksInfiniteQuery } from "@/lib/tanstack-api";

const DEFAULT_BOOK_COVER = "/default-book-cover.svg";
const DEFAULT_AUTHOR_AVATAR = "/dummy-avatar.png";

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

function AuthorHeaderSkeleton() {
  return (
    <section className="grid gap-3 rounded-2xl bg-white p-3 shadow-card md:p-4">
      <div className="flex items-center gap-3 md:gap-4">
        <Skeleton className="size-15 rounded-full md:size-20.25" />
        <div className="grid flex-1 gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    </section>
  );
}

function BooksSkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-5">
      {Array.from({ length: 10 }, (_, index) => (
        <article
          className="grid gap-0 overflow-hidden rounded-xl shadow-card"
          key={`author-book-skeleton-${index}`}
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

export default function BookByAuthorPage() {
  const params = useParams<{ id: string }>();
  const authorId = useMemo(() => {
    const parsed = Number(params.id);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return null;
    }
    return parsed;
  }, [params.id]);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useAuthorBooksInfiniteQuery({
    authorId,
    limit: 8,
  });

  const books = data?.pages.flatMap((page) => page.books) ?? [];
  const firstPage = data?.pages[0];
  const authorName =
    firstPage?.author?.name || books[0]?.author?.name || "Unknown author";
  const authorBio = firstPage?.author?.bio || "";
  const bookCount = firstPage?.bookCount ?? books.length;

  if (authorId === null) {
    return (
      <main className="grid place-items-center gap-3 px-4 py-16 text-center lg:px-30">
        <p className="text-sm text-neutral-700 md:text-md">
          ID author tidak valid.
        </p>
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
    <main className="grid gap-5 px-4 py-4 lg:gap-8 lg:px-30 lg:py-8">
      {isLoading ? <AuthorHeaderSkeleton /> : null}
      {isLoading ? <BooksSkeletonGrid /> : null}

      {isError ? (
        <div className="grid place-items-center gap-3 rounded-xl border border-neutral-200 p-6 text-center">
          <p className="text-sm text-neutral-700 md:text-md">
            {(error as Error)?.message || "Gagal memuat buku author."}
          </p>
          <Button
            className="rounded-full"
            onClick={() => refetch()}
            variant="outline"
          >
            Coba Lagi
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <>
          <section className="grid gap-3 rounded-2xl bg-white p-3 shadow-card md:p-4">
            <div className="flex items-center gap-3 md:gap-4">
              <Avatar className="size-15 md:size-20.25">
                <AvatarImage alt={authorName} src={DEFAULT_AUTHOR_AVATAR} />
                <AvatarFallback>{getAuthorFallback(authorName)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5">
                <p className="text-md font-bold text-neutral-900 md:text-lg">
                  {authorName}
                </p>
                <div className="flex items-center gap-1">
                  <Image
                    alt=""
                    aria-hidden="true"
                    height={24}
                    src="/blue-book-with-white-pin.svg"
                    width={24}
                  />
                  <span className="text-sm font-medium text-neutral-900 md:text-md">
                    {bookCount} {bookCount === 1 ? "book" : "books"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-3 lg:gap-4">
            <h1 className="display-xs font-bold text-neutral-950 md:display-lg">
              Book List
            </h1>

            {isFetchingNextPage ? <BooksSkeletonGrid /> : null}

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-5">
              {books.map((book) => (
                <Link href={`/detail/${book.id}`} key={book.id}>
                  <article className="grid gap-0 overflow-hidden rounded-xl shadow-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={`${book.title} cover`}
                      className="h-[258px] w-full object-cover md:h-84"
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
                    <div className="grid gap-0.5 p-3 md:gap-1 md:p-4">
                      <p className="text-sm font-bold text-neutral-950 lg:text-lg">
                        {book.title}
                      </p>
                      <p className="text-sm text-neutral-700 lg:text-md">
                        {book.author?.name || authorName}
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
                          {formatRating(book.rating)}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {books.length === 0 ? (
              <p className="text-center text-sm text-neutral-700 md:text-md">
                Belum ada buku untuk author ini.
              </p>
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
          </section>
        </>
      ) : null}
    </main>
  );
}
