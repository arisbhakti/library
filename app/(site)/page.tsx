"use client";

import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FlaskConical,
  Landmark,
  RefreshCcw,
  Rocket,
  Sparkles,
} from "lucide-react";

import { HomeCarousel } from "@/components/home/home-carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCategoriesQuery,
  usePopularAuthorsInfiniteQuery,
  useRecommendationInfiniteQuery,
} from "@/lib/tanstack-api";

type CategoryIconConfig =
  | {
      type: "image";
      src: string;
    }
  | {
      type: "icon";
      Icon: LucideIcon;
    };

const CATEGORY_ICON_MAP: Record<string, CategoryIconConfig> = {
  fiction: { type: "image", src: "/category-fiction.svg" },
  "non-fiction": { type: "image", src: "/category-non-fiction.svg" },
  "self-improvement": { type: "image", src: "/category-self-improvement.svg" },
  finance: { type: "image", src: "/category-finance.svg" },
  science: { type: "image", src: "/category-science.svg" },
  education: { type: "image", src: "/category-education.svg" },
  lifestyle: { type: "icon", Icon: Sparkles },
  religious: { type: "icon", Icon: Landmark },
  "science-fiction": { type: "icon", Icon: Rocket },
  "test category api": { type: "icon", Icon: FlaskConical },
  "updated category api": { type: "icon", Icon: RefreshCcw },
};

const DEFAULT_CATEGORY_ICON: CategoryIconConfig = {
  type: "icon",
  Icon: BookOpen,
};

const DEFAULT_BOOK_COVER = "/default-book-cover.svg";
const DEFAULT_AUTHOR_AVATAR = "/dummy-avatar.png";

function CategoriesSkeletonGrid() {
  return (
    <div className="grid grid-cols-3 gap-3 lg:grid-cols-6 lg:gap-4">
      {Array.from({ length: 6 }, (_, index) => (
        <article
          className="grid gap-2 rounded-2xl p-2 shadow-card lg:p-3"
          key={`category-skeleton-${index}`}
        >
          <Skeleton className="h-14 w-full rounded-xl md:h-16" />
          <Skeleton className="h-4 w-4/5" />
        </article>
      ))}
    </div>
  );
}

function RecommendationSkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-5">
      {Array.from({ length: 10 }, (_, index) => (
        <article
          className="grid gap-0 overflow-hidden rounded-xl shadow-card"
          key={`recommendation-skeleton-${index}`}
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

function PopularAuthorsSkeletonGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-4 lg:gap-5">
      {Array.from({ length: 4 }, (_, index) => (
        <article
          className="flex items-center gap-3 rounded-xl p-3 shadow-card md:gap-4 md:p-4"
          key={`popular-author-skeleton-${index}`}
        >
          <Skeleton className="size-15 rounded-full lg:size-20.25" />
          <div className="grid flex-1 gap-2">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </article>
      ))}
    </div>
  );
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

function getCategoryIcon(name: string): CategoryIconConfig {
  const normalized = name.trim().toLowerCase();
  if (!normalized) {
    return DEFAULT_CATEGORY_ICON;
  }

  return CATEGORY_ICON_MAP[normalized] ?? DEFAULT_CATEGORY_ICON;
}

export default function HomePage() {
  const {
    data: categoriesData,
    error: categoriesError,
    isError: isCategoriesError,
    isLoading: isCategoriesLoading,
    refetch: refetchCategories,
  } = useCategoriesQuery();
  const categories = categoriesData?.categories ?? [];

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useRecommendationInfiniteQuery({ by: "rating", limit: 10 });

  const recommendationItems = data?.pages.flatMap((page) => page.books) ?? [];
  const {
    data: popularAuthorsData,
    error: popularAuthorsError,
    fetchNextPage: fetchNextPopularAuthorsPage,
    hasNextPage: hasNextPopularAuthorsPage,
    isError: isPopularAuthorsError,
    isFetchingNextPage: isFetchingNextPopularAuthorsPage,
    isLoading: isPopularAuthorsLoading,
    refetch: refetchPopularAuthors,
  } = usePopularAuthorsInfiniteQuery({ limit: 4 });
  const popularAuthors =
    popularAuthorsData?.pages[popularAuthorsData.pages.length - 1]?.authors ?? [];

  return (
    <main className="grid gap-8 bg-white px-4 py-4 lg:gap-10 lg:px-[120px] lg:py-8">
      <HomeCarousel />

      <section className="grid gap-3 lg:gap-4">
        {isCategoriesLoading ? <CategoriesSkeletonGrid /> : null}

        {isCategoriesError ? (
          <div className="grid place-items-center gap-3 rounded-xl border border-neutral-200 p-6 text-center">
            <p className="text-sm text-neutral-700 md:text-md">
              {(categoriesError as Error)?.message || "Gagal memuat kategori."}
            </p>
            <Button
              className="rounded-full"
              onClick={() => refetchCategories()}
              variant="outline"
            >
              Coba Lagi
            </Button>
          </div>
        ) : null}

        {!isCategoriesLoading && !isCategoriesError ? (
          <>
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-6 lg:gap-4">
              {categories.map((category) => {
                const icon = getCategoryIcon(category.name);

                return (
                  <article
                    className="grid gap-2 rounded-2xl p-2 shadow-card lg:p-3"
                    key={category.id}
                  >
                    <div className="flex items-center justify-center rounded-xl bg-primary-50 p-[5.6px] md:p-[6.4px]">
                      {icon.type === "image" ? (
                        <Image
                          alt={category.name}
                          className="md:h-[51.2px] md:w-[51.2px]"
                          height={44.8}
                          src={icon.src}
                          width={44.8}
                        />
                      ) : (
                        <icon.Icon
                          aria-hidden="true"
                          className="h-11 w-11 text-primary-600 md:h-[51.2px] md:w-[51.2px]"
                        />
                      )}
                    </div>
                    <p className="text-xs font-semibold text-neutral-950 md:text-md">
                      {category.name}
                    </p>
                  </article>
                );
              })}
            </div>

            {categories.length === 0 ? (
              <p className="text-center text-sm text-neutral-700 md:text-md">
                Belum ada kategori buku.
              </p>
            ) : null}
          </>
        ) : null}
      </section>

      <section className="grid gap-4 lg:gap-6">
        <h2 className="display-xs font-bold text-neutral-950 md:text-display-lg">
          Recommendation
        </h2>

        {isLoading ? <RecommendationSkeletonGrid /> : null}

        {isError ? (
          <div className="grid place-items-center gap-3 rounded-xl border border-neutral-200 p-6 text-center">
            <p className="text-sm text-neutral-700 md:text-md">
              {(error as Error)?.message || "Gagal memuat recommendation."}
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
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-5">
              {recommendationItems.map((book) => (
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
                        <span className="text-sm font-semibold text-neutral-700 lg:text-md">
                          {formatRating(book.rating)}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {recommendationItems.length === 0 ? (
              <p className="text-center text-sm text-neutral-700 md:text-md">
                Belum ada recommendation.
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
          </>
        ) : null}
      </section>

      <section className="grid gap-4 border-t border-neutral-200 pt-6 lg:gap-6 lg:pt-8">
        <h2 className="display-xs font-bold text-neutral-950 md:text-display-lg">
          Popular Authors
        </h2>

        {isPopularAuthorsLoading ? <PopularAuthorsSkeletonGrid /> : null}

        {isPopularAuthorsError ? (
          <div className="grid place-items-center gap-3 rounded-xl border border-neutral-200 p-6 text-center">
            <p className="text-sm text-neutral-700 md:text-md">
              {(popularAuthorsError as Error)?.message ||
                "Gagal memuat popular authors."}
            </p>
            <Button
              className="rounded-full"
              onClick={() => refetchPopularAuthors()}
              variant="outline"
            >
              Coba Lagi
            </Button>
          </div>
        ) : null}

        {!isPopularAuthorsLoading && !isPopularAuthorsError ? (
          <>
            <div className="grid gap-4 lg:grid-cols-4 lg:gap-5">
              {popularAuthors.map((author) => (
                <article
                  className="flex items-center gap-3 rounded-xl p-3 shadow-card md:gap-4 md:p-4"
                  key={author.id}
                >
                  <Avatar className="size-15 lg:size-20.25">
                    <AvatarImage alt={author.name} src={DEFAULT_AUTHOR_AVATAR} />
                    <AvatarFallback>{getAuthorFallback(author.name)}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-0.5">
                    <p className="text-md font-bold text-neutral-950 md:text-lg">
                      {author.name}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <Image
                        alt=""
                        aria-hidden="true"
                        height={24}
                        src="/blue-book-with-white-pin.svg"
                        width={24}
                      />
                      <span className="text-sm text-neutral-950 md:text-md">
                        {author.bookCount}{" "}
                        {author.bookCount === 1 ? "book" : "books"}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {popularAuthors.length === 0 ? (
              <p className="text-center text-sm text-neutral-700 md:text-md">
                Belum ada popular author.
              </p>
            ) : null}

            <div className="flex items-center justify-center">
              <Button
                className="h-10 w-37.5 rounded-full border border-neutral-300 bg-neutral-25 p-2 text-sm font-bold text-neutral-950 shadow-none hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60 md:h-12 md:w-50 md:text-md"
                disabled={
                  isFetchingNextPopularAuthorsPage || !hasNextPopularAuthorsPage
                }
                onClick={() => fetchNextPopularAuthorsPage()}
                variant="outline"
              >
                {isFetchingNextPopularAuthorsPage
                  ? "Loading..."
                  : hasNextPopularAuthorsPage
                    ? "Load More"
                    : "No More Authors"}
              </Button>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}
