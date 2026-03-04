"use client";

import { ListFilter, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useIsMobile } from "@/hooks/use-mobile";
import { useBooksInfiniteQuery, useCategoriesQuery } from "@/lib/tanstack-api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

const ratingFilters = [5, 4, 3, 2, 1];
const DEFAULT_BOOK_COVER = "/default-book-cover.svg";

function parsePositiveInteger(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function parsePositiveIntegerList(values: string[]) {
  const parsedValues: number[] = [];

  values.forEach((value) => {
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => {
        const parsed = Number(item);
        if (Number.isInteger(parsed) && parsed > 0) {
          parsedValues.push(parsed);
        }
      });
  });

  return Array.from(new Set(parsedValues));
}

function normalizeCategoryName(value: string) {
  return value.trim().toLowerCase();
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

type FilterFieldsProps = {
  categories: Array<{ id: number; name: string }>;
  isCategoriesLoading: boolean;
  isCategoriesError: boolean;
  categoriesErrorMessage: string;
  onRetryCategories: () => void;
  selectedCategoryIds: number[];
  selectedRating: number | null;
  onCategoryCheckedChange: (categoryId: number, nextChecked: boolean) => void;
  onRatingCheckedChange: (rating: number, nextChecked: boolean) => void;
};

function FilterFields({
  categories,
  isCategoriesLoading,
  isCategoriesError,
  categoriesErrorMessage,
  onRetryCategories,
  selectedCategoryIds,
  selectedRating,
  onCategoryCheckedChange,
  onRatingCheckedChange,
}: FilterFieldsProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        <p className="text-md md:text-lg font-extrabold text-neutral-950">
          Category
        </p>

        {isCategoriesLoading ? (
          <div className="grid gap-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                className="flex items-center gap-2"
                key={`category-filter-${index}`}
              >
                <Skeleton className="h-4 w-4 rounded-[4px]" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        ) : null}

        {isCategoriesError ? (
          <div className="grid gap-2">
            <p className="text-sm text-neutral-700">{categoriesErrorMessage}</p>
            <Button
              className="h-8 w-fit rounded-full px-3"
              onClick={onRetryCategories}
            >
              Coba Lagi
            </Button>
          </div>
        ) : null}

        {!isCategoriesLoading && !isCategoriesError ? (
          <>
            <div className="grid gap-2">
              {categories.map((category) => (
                <label className="flex items-center gap-2" key={category.id}>
                  <Checkbox
                    checked={selectedCategoryIds.includes(category.id)}
                    className="border-neutral-300 data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300"
                    onCheckedChange={(checked) =>
                      onCategoryCheckedChange(category.id, checked === true)
                    }
                  />
                  <span className="text-md text-neutral-900">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>

            {categories.length === 0 ? (
              <p className="text-sm text-neutral-700">Belum ada kategori.</p>
            ) : null}
          </>
        ) : null}
      </div>

      <div className="grid gap-3 border-t border-neutral-200 pt-4">
        <p className="text-lg font-extrabold text-neutral-950">Rating</p>
        <div className="grid gap-2">
          {ratingFilters.map((rating) => (
            <label className="flex items-center gap-2" key={rating}>
              <Checkbox
                checked={selectedRating === rating}
                className="border-neutral-300 data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300"
                onCheckedChange={(checked) =>
                  onRatingCheckedChange(rating, checked === true)
                }
              />
              <Star className="h-4 w-4 fill-[#FFAB0D] text-[#FFAB0D]" />
              <span className="text-md text-neutral-900">{rating}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileFilterTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      className="flex h-12 w-full items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-25 px-4 lg:hidden"
      onClick={toggleSidebar}
      type="button"
    >
      <span className="text-sm font-extrabold text-neutral-950">FILTER</span>
      <ListFilter className="h-5 w-5 text-neutral-900" />
    </button>
  );
}

function MobileFilterSidebar(props: FilterFieldsProps) {
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();

  if (!isMobile) {
    return null;
  }

  return (
    <Sidebar side="right">
      <SidebarContent className="bg-neutral-25 p-4">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <p className="text-md font-extrabold text-neutral-950">FILTER</p>
            <button
              aria-label="Close filter"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300"
              onClick={() => setOpenMobile(false)}
              type="button"
            >
              <X className="h-4 w-4 text-neutral-900" />
            </button>
          </div>

          <FilterFields {...props} />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

function BooksSkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
      {Array.from({ length: 8 }, (_, index) => (
        <article
          className="grid gap-0 overflow-hidden rounded-xl shadow-card"
          key={`category-book-skeleton-${index}`}
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

export default function CategoryPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    data: categoriesData,
    error: categoriesError,
    isError: isCategoriesError,
    isLoading: isCategoriesLoading,
    refetch: refetchCategories,
  } = useCategoriesQuery();

  const categories = useMemo(
    () => categoriesData?.categories ?? [],
    [categoriesData],
  );

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );
  const categoryByNormalizedName = useMemo(
    () =>
      new Map(
        categories.map((category) => [
          normalizeCategoryName(category.name),
          category,
        ]),
      ),
    [categories],
  );

  const categoryIdParam = parsePositiveInteger(searchParams.get("categoryId"));
  const categoryIdParams = parsePositiveIntegerList(
    searchParams.getAll("categoryId"),
  );
  const selectedCategoryIdsFromParams =
    categoryIdParams.length > 0
      ? categoryIdParams
      : categoryIdParam
        ? [categoryIdParam]
        : [];

  const normalizedCategoryNameParams = Array.from(
    new Set(
      searchParams
        .getAll("category")
        .map(normalizeCategoryName)
        .filter(Boolean),
    ),
  );
  const selectedCategoryIdsFromNameParams = normalizedCategoryNameParams
    .map((name) => categoryByNormalizedName.get(name)?.id)
    .filter((id): id is number => Boolean(id));

  const selectedCategoryIds =
    selectedCategoryIdsFromParams.length > 0
      ? selectedCategoryIdsFromParams
      : selectedCategoryIdsFromNameParams;

  const minRatingParam = parsePositiveInteger(searchParams.get("minRating"));
  const selectedRating =
    minRatingParam && minRatingParam >= 1 && minRatingParam <= 5
      ? minRatingParam
      : null;

  const queryKeyword = searchParams.get("q")?.trim() || undefined;
  const isCategoryResolutionPending =
    normalizedCategoryNameParams.length > 0 &&
    selectedCategoryIdsFromParams.length === 0 &&
    isCategoriesLoading;

  const {
    data: booksData,
    error: booksError,
    fetchNextPage,
    hasNextPage,
    isError: isBooksError,
    isFetchingNextPage,
    isLoading: isBooksLoading,
    refetch: refetchBooks,
  } = useBooksInfiniteQuery({
    q: queryKeyword,
    categoryIds: selectedCategoryIds,
    minRating: selectedRating ?? undefined,
    limit: 8,
    enabled: !isCategoryResolutionPending,
  });

  const books = booksData?.pages.flatMap((page) => page.books) ?? [];
  const isBooksLoadingState = isBooksLoading || isCategoryResolutionPending;

  const createUrlWithParams = (params: URLSearchParams) => {
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const handleCategoryCheckedChange = (
    categoryId: number,
    nextChecked: boolean,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    const nextSelectedCategoryIds = new Set(selectedCategoryIds);

    if (nextChecked) {
      nextSelectedCategoryIds.add(categoryId);
    } else {
      nextSelectedCategoryIds.delete(categoryId);
    }

    params.delete("category");
    params.delete("categoryId");

    Array.from(nextSelectedCategoryIds).forEach((selectedCategoryId) => {
      params.append("categoryId", String(selectedCategoryId));

      const selectedCategory = categoryById.get(selectedCategoryId);
      if (selectedCategory) {
        params.append("category", selectedCategory.name);
      }
    });

    if (nextSelectedCategoryIds.size === 0) {
      params.delete("category");
      params.delete("categoryId");
    }

    params.delete("page");
    router.replace(createUrlWithParams(params), { scroll: false });
  };

  const handleRatingCheckedChange = (rating: number, nextChecked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextChecked) {
      params.set("minRating", String(rating));
    } else {
      params.delete("minRating");
    }

    params.delete("page");
    router.replace(createUrlWithParams(params), { scroll: false });
  };

  const categoriesErrorMessage =
    (categoriesError as Error | null)?.message || "Gagal memuat kategori.";

  return (
    <SidebarProvider className="block! ">
      <main className="grid gap-5 px-4 py-4 lg:gap-8 lg:px-[120px] lg:py-8">
        <h1 className="display-xs md:display-lg font-bold text-neutral-950">
          Book List
        </h1>

        <MobileFilterTrigger />

        <div className="grid gap-4 lg:grid-cols-[266px_1fr] lg:gap-10 ">
          <aside className="hidden lg:block ">
            <div className="grid gap-4 rounded-2xl p-4 shadow-card">
              <p className="text-sm md:text-md font-extrabold text-neutral-950">
                FILTER
              </p>
              <FilterFields
                categories={categories}
                categoriesErrorMessage={categoriesErrorMessage}
                isCategoriesError={isCategoriesError}
                isCategoriesLoading={isCategoriesLoading}
                onCategoryCheckedChange={handleCategoryCheckedChange}
                onRatingCheckedChange={handleRatingCheckedChange}
                onRetryCategories={() => refetchCategories()}
                selectedCategoryIds={selectedCategoryIds}
                selectedRating={selectedRating}
              />
            </div>
          </aside>

          <section className="grid gap-3 lg:gap-4">
            {isBooksLoadingState ? <BooksSkeletonGrid /> : null}

            {isBooksError ? (
              <div className="grid place-items-center gap-3 rounded-xl border border-neutral-200 p-6 text-center">
                <p className="text-sm text-neutral-700 md:text-md">
                  {(booksError as Error)?.message ||
                    "Gagal memuat daftar buku."}
                </p>
                <Button
                  className="rounded-full"
                  onClick={() => refetchBooks()}
                  variant="outline"
                >
                  Coba Lagi
                </Button>
              </div>
            ) : null}

            {!isBooksLoadingState && !isBooksError ? (
              <>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
                  {books.map((book) => (
                    <Link
                      className="interactive-hover-card block rounded-xl"
                      href={`/detail/${book.id}`}
                      key={book.id}
                    >
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
                          <p className="text-sm font-bold text-neutral-950 lg:text-lg line-clamp-1">
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

                {books.length === 0 ? (
                  <p className="text-center text-sm text-neutral-700 md:text-md">
                    Tidak ada buku yang cocok dengan filter.
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
        </div>
      </main>

      <MobileFilterSidebar
        categories={categories}
        categoriesErrorMessage={categoriesErrorMessage}
        isCategoriesError={isCategoriesError}
        isCategoriesLoading={isCategoriesLoading}
        onCategoryCheckedChange={handleCategoryCheckedChange}
        onRatingCheckedChange={handleRatingCheckedChange}
        onRetryCategories={() => refetchCategories()}
        selectedCategoryIds={selectedCategoryIds}
        selectedRating={selectedRating}
      />
    </SidebarProvider>
  );
}
