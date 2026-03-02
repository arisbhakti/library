"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthToken } from "@/lib/auth";
import { useCartQuery } from "@/lib/tanstack-api";

const FALLBACK_CART_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzcyNDU0MTEzLCJleHAiOjE3NzMwNTg5MTN9.SxWTBN7WDjYhFO_P6vJdXizp_pwttIOi1lFvWd-VxeA";
const DEFAULT_BOOK_COVER = "/default-book-cover.svg";

type SelectionState =
  | { mode: "all" }
  | {
      mode: "custom";
      selectedIds: number[];
    };

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

function CartItemSkeleton() {
  return (
    <article className="grid gap-0 border-b border-neutral-200 py-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <Skeleton className="mt-1 size-4 rounded-[4px]" />
        <div className="flex flex-row gap-3 md:gap-4">
          <Skeleton className="h-[106px] w-[70px] md:h-34.5 md:w-23" />
          <div className="grid content-center gap-2">
            <Skeleton className="h-6 w-24 rounded-[6px]" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CartPage() {
  const router = useRouter();
  const [selectionState, setSelectionState] = useState<SelectionState>({
    mode: "all",
  });

  const token = getAuthToken() || FALLBACK_CART_TOKEN;
  const {
    data: cartData,
    error,
    isError,
    isLoading,
    refetch,
  } = useCartQuery({ token });

  const items = useMemo(() => cartData?.items ?? [], [cartData]);
  const hasItems = items.length > 0;
  const itemIds = useMemo(() => items.map((item) => item.id), [items]);
  const itemIdSet = useMemo(() => new Set(itemIds), [itemIds]);

  const selectedCount = useMemo(
    () => {
      if (selectionState.mode === "all") {
        return itemIds.length;
      }

      return selectionState.selectedIds.filter((selectedId) =>
        itemIdSet.has(selectedId),
      ).length;
    },
    [itemIdSet, itemIds.length, selectionState],
  );

  const selectedItemIdSet = useMemo(() => {
    if (selectionState.mode === "all") {
      return new Set(itemIds);
    }

    return new Set(
      selectionState.selectedIds.filter((selectedId) => itemIdSet.has(selectedId)),
    );
  }, [itemIdSet, itemIds, selectionState]);

  const isAllSelected = hasItems && selectedCount === items.length;
  const selectAllCheckboxState = isAllSelected
    ? true
    : selectedCount > 0
      ? "indeterminate"
      : false;
  const summaryText =
    selectedCount > 0 ? `${selectedCount} Items` : "No books selected";

  const handleSelectAll = (checked: boolean) => {
    if (!hasItems) {
      return;
    }

    setSelectionState(checked ? { mode: "all" } : { mode: "custom", selectedIds: [] });
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    setSelectionState((current) => {
      const selectedIds =
        current.mode === "all"
          ? new Set(itemIds)
          : new Set(
              current.selectedIds.filter((selectedId) => itemIdSet.has(selectedId)),
            );

      if (checked) {
        selectedIds.add(id);
      } else {
        selectedIds.delete(id);
      }

      if (items.length > 0 && selectedIds.size === items.length) {
        return { mode: "all" };
      }

      return {
        mode: "custom",
        selectedIds: Array.from(selectedIds),
      };
    });
  };

  const handleBorrowBooks = () => {
    if (selectedCount === 0) {
      return;
    }

    router.push("/checkout");
  };

  const renderLoanSummary = () => (
    <div className="grid gap-6 rounded-3xl p-5 shadow-card">
      <h2 className="text-xl font-bold text-neutral-950">Loan Summary</h2>
      <div className="flex items-center justify-between">
        <span className="text-md font-medium text-neutral-900">Total Book</span>
        <span className="text-md font-bold text-neutral-950">{summaryText}</span>
      </div>
      <Button
        className="h-12 rounded-full bg-primary-300 text-md font-bold text-neutral-25 hover:bg-primary-300/90"
        disabled={selectedCount === 0}
        onClick={handleBorrowBooks}
      >
        Borrow Book
      </Button>
    </div>
  );

  return (
    <>
      <main className="grid gap-6 px-4 pb-24 pt-4 lg:gap-8 lg:px-[120px] lg:pb-10 lg:pt-8">
        <h1 className="display-xs md:display-lg font-bold text-neutral-950">
          My Cart
        </h1>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:gap-10">
          <section className="grid gap-0">
            <label className="flex items-center gap-3 py-2">
              <Checkbox
                checked={selectAllCheckboxState}
                className="border-neutral-300 data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300"
                disabled={!hasItems || isLoading}
                onCheckedChange={(checked) => handleSelectAll(checked === true)}
              />
              <span className="text-md font-semibold text-neutral-950">
                Select All
              </span>
            </label>

            {isLoading ? (
              <div className="grid gap-0">
                {Array.from({ length: 3 }, (_, index) => (
                  <CartItemSkeleton key={`cart-item-skeleton-${index}`} />
                ))}
              </div>
            ) : null}

            {isError ? (
              <div className="grid place-items-center gap-3 rounded-xl border border-neutral-200 p-6 text-center">
                <p className="text-sm text-neutral-700 md:text-md">
                  {(error as Error)?.message || "Gagal memuat cart."}
                </p>
                <Button className="rounded-full" onClick={() => refetch()} variant="outline">
                  Coba Lagi
                </Button>
              </div>
            ) : null}

            {!isLoading && !isError ? (
              <div className="grid gap-0">
                {items.map((item) => (
                  <article
                    className="grid gap-0 border-b border-neutral-200 py-4 last:border-b-0"
                    key={item.id}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedItemIdSet.has(item.id)}
                        className="border-neutral-300 data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300"
                        onCheckedChange={(checked) =>
                          handleSelectItem(item.id, checked === true)
                        }
                      />

                      <div className="flex flex-row gap-3 md:gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          alt={`${item.book.title} cover`}
                          className="h-[106px] w-[70px] object-cover md:h-34.5 md:w-23"
                          onError={(event) => {
                            const image = event.currentTarget;
                            if (image.src.endsWith(DEFAULT_BOOK_COVER)) {
                              return;
                            }
                            image.src = DEFAULT_BOOK_COVER;
                          }}
                          src={getBookCoverSource(item.book.coverImage)}
                        />

                        <div className="flex flex-col items-start justify-center gap-1">
                          <div className="inline-flex w-fit items-center rounded-[6px] border border-neutral-300 px-2">
                            <span className="text-sm font-bold text-neutral-950">
                              {item.book.category?.name || "Unknown category"}
                            </span>
                          </div>
                          <p className="text-sm md:text-lg font-bold text-neutral-950">
                            {item.book.title}
                          </p>
                          <p className="text-sm md:text-md font-medium text-neutral-700">
                            {item.book.author?.name || "Unknown author"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}

                {!hasItems ? (
                  <div className="grid place-items-center rounded-xl border border-neutral-200 p-6 text-center">
                    <p className="text-sm text-neutral-700 md:text-md">
                      Keranjang kamu masih kosong.
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>

          <aside className="hidden w-79.5 lg:block">{renderLoanSummary()}</aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-neutral-200 bg-neutral-25 px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="grid gap-0">
            <span className="text-xl text-neutral-900">Total Book</span>
            <span className="display-xs font-semibold text-neutral-950">
              {summaryText}
            </span>
          </div>
          <Button
            className="h-10 min-w-36 rounded-full bg-primary-300 px-6 text-md font-semibold text-neutral-25 hover:bg-primary-300/90"
            disabled={selectedCount === 0}
            onClick={handleBorrowBooks}
          >
            Borrow Book
          </Button>
        </div>
      </div>
    </>
  );
}
