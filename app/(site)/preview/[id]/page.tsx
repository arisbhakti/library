"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";

import { useAppToast } from "@/components/ui/app-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthToken } from "@/lib/auth";
import {
  addCartItem,
  borrowBook,
  tanstackQueryKeys,
  useBookDetailQuery,
} from "@/lib/tanstack-api";

const DEFAULT_BOOK_COVER = "/default-book-cover.svg";
const BORROW_BOOK_TOAST_DURATION_MS = 5000;

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

function formatDueDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function BookPreviewSkeleton() {
  return (
    <section className="grid gap-9 lg:grid-cols-[auto_1fr]">
      <div className="grid justify-center">
        <Skeleton className="h-[318px] w-[212px] md:h-[482px] md:w-[321px]" />
      </div>

      <div className="grid content-start gap-4">
        <Skeleton className="h-7 w-40 rounded-[6px]" />

        <div className="grid gap-2">
          <Skeleton className="h-9 w-full max-w-96" />
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-6 w-32" />
        </div>

        <div className="grid grid-cols-3 gap-3 md:w-96.5">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton className="h-14 w-full" key={`preview-stat-${index}`} />
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
  );
}

export default function PreviewPage() {
  const queryClient = useQueryClient();
  const { showErrorToast, showSuccessToast } = useAppToast();
  const params = useParams<{ id: string }>();

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

  const addToCartMutation = useMutation<
    Awaited<ReturnType<typeof addCartItem>>,
    Error,
    number
  >({
    mutationFn: async (selectedBookId) => {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Silakan login terlebih dahulu.");
      }

      return addCartItem({
        bookId: selectedBookId,
        token,
      });
    },
    onSuccess: (response) => {
      showSuccessToast(response.message || "Added to cart");
      void queryClient.invalidateQueries({ queryKey: tanstackQueryKeys.cart.all });
    },
    onError: (mutationError) => {
      showErrorToast(mutationError.message || "Gagal menambahkan buku ke cart.");
    },
  });

  const borrowBookMutation = useMutation<
    Awaited<ReturnType<typeof borrowBook>>,
    Error,
    number
  >({
    mutationFn: async (selectedBookId) => {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Silakan login terlebih dahulu.");
      }

      return borrowBook({
        bookId: selectedBookId,
        days: 7,
        token,
      });
    },
    onSuccess: (response, selectedBookId) => {
      const dueAtLabel = formatDueDate(response.data?.loan.dueAt);
      const successMessage = dueAtLabel
        ? `Peminjaman berhasil. Harap kembalikan buku sebelum ${dueAtLabel}.`
        : "Peminjaman berhasil. Harap kembalikan buku tepat waktu.";

      showSuccessToast(successMessage, {
        durationMs: BORROW_BOOK_TOAST_DURATION_MS,
      });

      void queryClient.invalidateQueries({
        queryKey: tanstackQueryKeys.bookDetail.detail(selectedBookId),
      });
      void queryClient.invalidateQueries({
        queryKey: tanstackQueryKeys.myLoans.all,
      });
    },
    onError: (mutationError) => {
      showErrorToast(mutationError.message || "Gagal meminjam buku.", {
        durationMs: BORROW_BOOK_TOAST_DURATION_MS,
      });
    },
  });

  const isAddingToCart = addToCartMutation.isPending;
  const isBorrowingBook = borrowBookMutation.isPending;

  const handleAddToCart = () => {
    if (!book) {
      return;
    }

    addToCartMutation.mutate(book.id);
  };

  const handleBorrowBook = () => {
    if (!book) {
      return;
    }

    borrowBookMutation.mutate(book.id);
  };

  if (bookId === null) {
    return (
      <main className="grid place-items-center gap-3 px-4 py-16 text-center lg:px-30">
        <p className="text-sm text-neutral-700 md:text-md">ID buku tidak valid.</p>
        <Link
          className="text-sm font-bold text-primary-300 hover:text-primary-300/90 md:text-md"
          href="/list"
        >
          Kembali ke List
        </Link>
      </main>
    );
  }

  return (
    <>
      <main className="grid gap-4 px-4 pb-24 pt-4 lg:gap-6 lg:px-30 lg:pb-20 lg:pt-8">
        <Link className="flex w-fit items-center gap-2 text-neutral-950" href="/list">
          <ArrowLeft className="size-6 md:size-7" />
          <span className="display-xs font-bold md:display-sm">Preview Book</span>
        </Link>

        {isLoading ? <BookPreviewSkeleton /> : null}

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
                  {book.category?.name || "Unknown category"}
                </span>
              </div>

              <div className="grid gap-1">
                <h1 className="display-xs font-bold text-neutral-950 lg:display-sm">
                  {book.title}
                </h1>
                <p className="text-sm text-neutral-700 md:text-md">
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
                  disabled={isAddingToCart}
                  onClick={handleAddToCart}
                  variant="outline"
                >
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  className="h-11 w-50 rounded-full bg-primary-300 p-2 text-md font-bold text-neutral-25 hover:bg-primary-300/90"
                  disabled={isBorrowingBook}
                  onClick={handleBorrowBook}
                >
                  {isBorrowingBook ? "Borrowing..." : "Borrow Book"}
                </Button>
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-neutral-200 bg-neutral-25 px-4 py-4 lg:hidden">
        <div className="flex h-10 w-full gap-3">
          <Button
            className="h-10 flex-1 rounded-full border border-neutral-300 bg-neutral-25 text-md font-semibold text-neutral-950 shadow-none hover:bg-neutral-100"
            disabled={!book || isAddingToCart}
            onClick={handleAddToCart}
            variant="outline"
          >
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
          <Button
            className="h-10 flex-1 rounded-full bg-primary-300 text-md font-semibold text-neutral-25 hover:bg-primary-300/90"
            disabled={!book || isBorrowingBook}
            onClick={handleBorrowBook}
          >
            {isBorrowingBook ? "Borrowing..." : "Borrow Book"}
          </Button>
        </div>
      </div>
    </>
  );
}
