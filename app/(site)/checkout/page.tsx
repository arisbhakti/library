"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useAppToast } from "@/components/ui/app-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthToken } from "@/lib/auth";
import {
  borrowFromCart,
  tanstackQueryKeys,
  useCheckoutQuery,
} from "@/lib/tanstack-api";

const FALLBACK_CART_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzcyNDU0MTEzLCJleHAiOjE3NzMwNTg5MTN9.SxWTBN7WDjYhFO_P6vJdXizp_pwttIOi1lFvWd-VxeA";
const DEFAULT_BOOK_COVER = "/default-book-cover.svg";

const borrowDurationOptions = [
  { label: "3 Days", value: 3 },
  { label: "5 Days", value: 5 },
  { label: "10 Days", value: 10 },
];

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

function CheckoutPageSkeleton() {
  return (
    <main className="grid gap-6 px-4 py-4 lg:gap-8 lg:px-[120px] lg:py-8">
      <Skeleton className="h-11 w-44" />

      <div className="grid gap-6 lg:grid-cols-[1fr_430px] lg:gap-10">
        <section className="grid content-start gap-6">
          <section className="grid gap-3">
            <Skeleton className="h-9 w-52" />
            <div className="grid gap-2">
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  className="flex items-center justify-between gap-3"
                  key={`user-skeleton-${index}`}
                >
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-52" />
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 border-t border-neutral-200 pt-6">
            <Skeleton className="h-9 w-44" />

            <div className="grid gap-4">
              {Array.from({ length: 2 }, (_, index) => (
                <article
                  className="grid gap-0 border-b border-neutral-200 py-4 last:border-b-0"
                  key={`book-skeleton-${index}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-row gap-3 md:gap-4">
                      <Skeleton className="h-[106px] w-[70px] md:h-34.5 md:w-23" />
                      <div className="flex flex-col items-start justify-center gap-1">
                        <Skeleton className="h-6 w-28" />
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="grid gap-4 rounded-3xl p-5 shadow-card lg:h-fit">
          <Skeleton className="h-12 w-72" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </aside>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showErrorToast, showSuccessToast } = useAppToast();

  const [borrowDays, setBorrowDays] = useState<number>(3);
  const [isReturnAgreementChecked, setIsReturnAgreementChecked] = useState(false);
  const [isPolicyAgreementChecked, setIsPolicyAgreementChecked] = useState(false);

  const token = getAuthToken() || FALLBACK_CART_TOKEN;
  const {
    data: checkoutData,
    error,
    isError,
    isLoading,
    refetch,
  } = useCheckoutQuery({
    token,
    enabled: Boolean(token),
  });

  const borrowDate = useMemo(() => dayjs(), []);
  const returnDate = useMemo(
    () => borrowDate.add(borrowDays, "day"),
    [borrowDate, borrowDays],
  );

  const borrowDateLabel = borrowDate.format("DD MMM YYYY");
  const borrowDatePayload = borrowDate.format("YYYY-MM-DD");
  const returnDateLabel = returnDate.format("D MMMM YYYY");

  const checkoutItems = useMemo(() => checkoutData?.items ?? [], [checkoutData]);
  const itemIds = useMemo(() => checkoutItems.map((item) => item.id), [checkoutItems]);

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("Silakan login terlebih dahulu.");
      }

      return borrowFromCart({
        itemIds,
        days: borrowDays,
        borrowDate: borrowDatePayload,
        token,
      });
    },
    onSuccess: (response) => {
      if (!response.success || !response.data) {
        showErrorToast(response.message || "Gagal memproses checkout.");
        return;
      }

      showSuccessToast(response.message || "Borrow success");

      void queryClient.invalidateQueries({
        queryKey: tanstackQueryKeys.cart.detail(token),
      });
      void queryClient.invalidateQueries({
        queryKey: tanstackQueryKeys.checkout.detail(token),
      });

      const dueAt = response.data.loans[0]?.dueAt ?? returnDate.toISOString();
      router.push(`/success?dueAt=${encodeURIComponent(dueAt)}`);
    },
    onError: (mutationError: Error) => {
      showErrorToast(mutationError.message || "Gagal memproses checkout.");
    },
  });

  const isConfirmDisabled =
    !isReturnAgreementChecked ||
    !isPolicyAgreementChecked ||
    checkoutItems.length === 0 ||
    checkoutMutation.isPending;

  const handleConfirmBorrow = () => {
    checkoutMutation.mutate();
  };

  if (isLoading) {
    return <CheckoutPageSkeleton />;
  }

  if (isError) {
    return (
      <main className="grid place-items-center gap-3 px-4 py-16 text-center lg:px-[120px]">
        <p className="text-sm text-neutral-700 md:text-md">
          {(error as Error)?.message || "Gagal memuat data checkout."}
        </p>
        <Button className="rounded-full" onClick={() => refetch()} variant="outline">
          Coba Lagi
        </Button>
      </main>
    );
  }

  return (
    <main className="grid gap-6 px-4 py-4 lg:gap-8 lg:px-[120px] lg:py-8">
      <h1 className="display-xs font-bold text-neutral-950 md:display-lg">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_430px] lg:gap-10">
        <section className="grid content-start gap-6">
          <section className="grid gap-3">
            <h2 className="text-lg font-bold text-neutral-950 md:display-xs">
              User Information
            </h2>
            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-neutral-900 md:text-md">Name</span>
                <span className="text-sm font-bold text-neutral-950 md:text-md">
                  {checkoutData?.user.name || "-"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-neutral-900 md:text-md">Email</span>
                <span className="text-sm font-bold text-neutral-950 md:text-md">
                  {checkoutData?.user.email || "-"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-neutral-900 md:text-md">Nomor Handphone</span>
                <span className="text-sm font-bold text-neutral-950 md:text-md">
                  {checkoutData?.user.nomorHandphone || "-"}
                </span>
              </div>
            </div>
          </section>

          <section className="grid gap-4 border-t border-neutral-200 pt-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-neutral-950 md:display-xs">Book List</h2>
              <span className="text-sm font-semibold text-neutral-700 md:text-md">
                {checkoutData?.itemCount ?? checkoutItems.length} Items
              </span>
            </div>

            <div className="grid gap-4">
              {checkoutItems.map((item) => (
                <article
                  className="grid gap-0 border-b border-neutral-200 py-4 last:border-b-0"
                  key={item.id}
                >
                  <div className="flex items-start gap-3">
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
                        <p className="text-sm font-bold text-neutral-950 md:text-lg">
                          {item.book.title}
                        </p>
                        <p className="text-sm font-medium text-neutral-700 md:text-md">
                          {item.book.author?.name || "Unknown author"}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {checkoutItems.length === 0 ? (
                <div className="grid place-items-center rounded-xl border border-neutral-200 p-6 text-center">
                  <p className="text-sm text-neutral-700 md:text-md">
                    Tidak ada buku di checkout.
                  </p>
                </div>
              ) : null}
            </div>
          </section>
        </section>

        <aside className="grid gap-4 rounded-3xl p-5 shadow-card lg:h-fit">
          <h2 className="text-xl font-bold text-neutral-950 md:display-sm">
            Complete Your Borrow Request
          </h2>

          <div className="grid gap-2">
            <p className="text-sm font-bold text-neutral-950 md:text-md">Borrow Date</p>
            <div className="flex h-12 items-center justify-between rounded-2xl border border-neutral-300 bg-neutral-100 px-4">
              <span className="text-md font-semibold text-neutral-950">{borrowDateLabel}</span>
              <Calendar className="h-5 w-5 text-neutral-900" />
            </div>
          </div>

          <div className="grid gap-3">
            <p className="text-sm font-semibold text-neutral-950 md:text-md">
              Borrow Duration
            </p>
            <RadioGroup
              className="grid gap-2"
              onValueChange={(value) => setBorrowDays(Number(value))}
              value={String(borrowDays)}
            >
              {borrowDurationOptions.map((option) => (
                <label className="flex items-center gap-3" key={option.value}>
                  <RadioGroupItem
                    className="h-6 w-6 border-neutral-300 text-neutral-25 data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300 [&_[data-slot=radio-group-indicator]_svg]:fill-neutral-25"
                    disabled={checkoutMutation.isPending}
                    value={String(option.value)}
                  />
                  <span className="text-sm font-semibold text-neutral-950 md:text-md">
                    {option.label}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <section className="grid gap-0 rounded-2xl bg-neutral-100 p-4">
            <h3 className="text-sm font-bold text-neutral-950 md:text-md">Return Date</h3>
            <p className="text-sm font-medium text-neutral-900 md:text-md">
              Please return the book no later than{" "}
              <span className="font-bold text-[#EE1D52]">{returnDateLabel}</span>
            </p>
          </section>

          <div className="grid gap-2">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={isReturnAgreementChecked}
                className="border-neutral-300 data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300"
                disabled={checkoutMutation.isPending}
                onCheckedChange={(checked) => setIsReturnAgreementChecked(checked === true)}
              />
              <span className="text-sm font-semibold text-neutral-950 md:text-md">
                I agree to return the book(s) before the due date.
              </span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={isPolicyAgreementChecked}
                className="border-neutral-300 data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300"
                disabled={checkoutMutation.isPending}
                onCheckedChange={(checked) => setIsPolicyAgreementChecked(checked === true)}
              />
              <span className="text-sm font-semibold text-neutral-950 md:text-md">
                I accept the library borrowing policy.
              </span>
            </label>
          </div>

          <Button
            className="h-12 rounded-full bg-primary-300 text-md font-bold text-neutral-25 hover:bg-primary-300/90"
            disabled={isConfirmDisabled}
            onClick={handleConfirmBorrow}
          >
            {checkoutMutation.isPending ? "Processing..." : "Confirm & Borrow"}
          </Button>
        </aside>
      </div>
    </main>
  );
}
