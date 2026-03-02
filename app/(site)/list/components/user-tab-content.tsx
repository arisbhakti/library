"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthToken } from "@/lib/auth";
import { type AdminUser, useAdminUsersQuery } from "@/lib/tanstack-api";

const SEARCH_DEBOUNCE_MS = 400;
const USERS_PER_PAGE = 10;

type PaginationItem = number | "ellipsis-left" | "ellipsis-right";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  mobile?: boolean;
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

function formatCreatedAt(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis-right", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis-left",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis-left",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-right",
    totalPages,
  ];
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  mobile = false,
}: PaginationProps) {
  const paginationItems = getPaginationItems(currentPage, totalPages);
  const canGoToPrevious = currentPage > 1;
  const canGoToNext = currentPage < totalPages;

  return (
    <div className="flex w-full items-center justify-center gap-1 lg:w-auto">
      <button
        className="flex h-10 items-center gap-1 rounded-xl px-2 text-sm font-medium text-neutral-950 disabled:cursor-not-allowed disabled:text-neutral-400"
        disabled={!canGoToPrevious}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
      >
        <ChevronLeft className="h-5 w-5" />
        <span className={mobile ? "sr-only" : "inline"}>Previous</span>
      </button>

      {paginationItems.map((item, index) => {
        if (typeof item !== "number") {
          return (
            <span className="px-1 text-sm text-neutral-600" key={`${item}-${index}`}>
              ...
            </span>
          );
        }

        const isActive = currentPage === item;

        return (
          <button
            className={
              isActive
                ? "flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-300 bg-neutral-25 text-sm font-semibold text-neutral-950"
                : "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold text-neutral-950"
            }
            key={item}
            onClick={() => onPageChange(item)}
            type="button"
          >
            {item}
          </button>
        );
      })}

      <button
        className="flex h-10 items-center gap-1 rounded-xl px-2 text-sm font-medium text-neutral-950 disabled:cursor-not-allowed disabled:text-neutral-400"
        disabled={!canGoToNext}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
      >
        <span className={mobile ? "sr-only" : "inline"}>Next</span>
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

function UserCard({ rowNumber, user }: { rowNumber: number; user: AdminUser }) {
  return (
    <article className="grid gap-1 rounded-2xl border border-neutral-300 p-4 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-neutral-950">No</span>
        <span className="text-sm font-semibold text-neutral-950">{rowNumber}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-neutral-950">Name</span>
        <span className="text-right text-sm font-semibold text-neutral-950">
          {user.name || "-"}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-neutral-950">Email</span>
        <span className="max-w-[65%] break-all text-right text-sm font-bold text-neutral-950">
          {user.email || "-"}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-neutral-950">Nomor Handphone</span>
        <span className="max-w-[65%] break-all text-right text-sm font-bold text-neutral-950">
          {user.phone || "-"}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-neutral-950">Role</span>
        <span className="text-right text-sm font-bold text-neutral-950">
          {user.role || "-"}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-neutral-950">Created at</span>
        <span className="max-w-[65%] text-right text-sm font-bold text-neutral-950">
          {formatCreatedAt(user.createdAt)}
        </span>
      </div>
    </article>
  );
}

function UserCardSkeleton() {
  return (
    <article className="grid gap-2 rounded-2xl border border-neutral-200 p-4">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="flex items-center justify-between gap-3" key={index}>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </article>
  );
}

function UserTableSkeleton() {
  return (
    <div className="hidden rounded-3xl border border-neutral-300 bg-white p-3 md:grid md:gap-3">
      <table className="w-full border-collapse">
        <thead className="bg-neutral-50">
          <tr>
            <th className="px-3 py-3 text-left text-sm font-bold text-neutral-950">No</th>
            <th className="px-3 py-3 text-left text-sm font-bold text-neutral-950">Name</th>
            <th className="px-3 py-3 text-left text-sm font-bold text-neutral-950">
              Nomor Handphone
            </th>
            <th className="px-3 py-3 text-left text-sm font-bold text-neutral-950">Email</th>
            <th className="px-3 py-3 text-left text-sm font-bold text-neutral-950">Role</th>
            <th className="px-3 py-3 text-left text-sm font-bold text-neutral-950">
              Created at
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }, (_, index) => (
            <tr className="border-b border-neutral-200" key={index}>
              <td className="px-3 py-4">
                <Skeleton className="h-5 w-10" />
              </td>
              <td className="px-3 py-4">
                <Skeleton className="h-5 w-28" />
              </td>
              <td className="px-3 py-4">
                <Skeleton className="h-5 w-32" />
              </td>
              <td className="px-3 py-4">
                <Skeleton className="h-5 w-44" />
              </td>
              <td className="px-3 py-4">
                <Skeleton className="h-5 w-16" />
              </td>
              <td className="px-3 py-4">
                <Skeleton className="h-5 w-32" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between gap-3 px-2">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-10 w-80" />
      </div>
    </div>
  );
}

export function UserTabContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const token = getAuthToken();
  const hasToken = Boolean(token);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, SEARCH_DEBOUNCE_MS);

  const { data, error, isError, isLoading, refetch } = useAdminUsersQuery({
    token,
    q: debouncedSearchTerm,
    page: currentPage,
    limit: USERS_PER_PAGE,
    enabled: hasToken,
  });

  const users = data?.users ?? [];
  const totalEntries = data?.pagination.total ?? 0;
  const totalPages = Math.max(1, data?.pagination.totalPages ?? 1);
  const currentDataPage = data?.pagination.page ?? currentPage;

  const fromEntry =
    totalEntries === 0 ? 0 : (currentDataPage - 1) * USERS_PER_PAGE + 1;
  const toEntry = totalEntries === 0 ? 0 : fromEntry + users.length - 1;

  const handlePageChange = (nextPage: number) => {
    if (
      nextPage < 1 ||
      nextPage > totalPages ||
      nextPage === currentDataPage
    ) {
      return;
    }

    setCurrentPage(nextPage);
  };

  return (
    <section className="mt-3 grid gap-4 lg:gap-6">
      <div className="grid gap-2">
        <h1 className="text-display-xs font-bold text-neutral-950 md:text-display-sm lg:display-sm">
          User
        </h1>
        <p className="text-sm font-medium text-neutral-700 md:text-md">
          Total data user: {totalEntries}
        </p>
      </div>

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
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search user"
          type="text"
          value={searchTerm}
        />
      </label>

      {!hasToken ? (
        <div className="grid h-48 place-items-center rounded-3xl border border-neutral-200 bg-neutral-25 px-4 text-center">
          <p className="text-md text-neutral-600">
            Sesi login tidak ditemukan. Silakan login ulang.
          </p>
        </div>
      ) : isLoading ? (
        <>
          <div className="grid gap-4 lg:hidden">
            {Array.from({ length: 5 }, (_, index) => (
              <UserCardSkeleton key={`mobile-user-skeleton-${index}`} />
            ))}
          </div>
          <UserTableSkeleton />
          <div className="grid gap-2 lg:hidden">
            <Skeleton className="mx-auto h-5 w-48" />
            <Skeleton className="mx-auto h-10 w-72" />
          </div>
        </>
      ) : isError ? (
        <div className="grid gap-3 rounded-3xl border border-danger-300/20 bg-danger-300/5 p-4 lg:max-w-xl">
          <p className="text-sm font-medium text-danger-300">
            {error instanceof Error ? error.message : "Gagal memuat daftar user."}
          </p>
          <Button
            className="h-10 w-fit rounded-full bg-primary-300 px-6 text-sm font-semibold text-neutral-25 hover:bg-primary-300/90"
            onClick={() => {
              void refetch();
            }}
            type="button"
          >
            Coba lagi
          </Button>
        </div>
      ) : users.length === 0 ? (
        <div className="grid h-48 place-items-center rounded-3xl border border-neutral-200 bg-neutral-25">
          <p className="text-md text-neutral-600">No user found.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:hidden">
            {users.map((user, index) => (
              <UserCard
                key={user.id}
                rowNumber={(currentDataPage - 1) * USERS_PER_PAGE + index + 1}
                user={user}
              />
            ))}
          </div>

          <div className="hidden rounded-3xl border border-neutral-300 bg-white p-3 md:grid md:gap-3">
            <table className="w-full border-collapse">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-3 py-3 text-left text-sm font-bold text-neutral-950">
                    No
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-bold text-neutral-950">
                    Name
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-bold text-neutral-950">
                    Nomor Handphone
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-bold text-neutral-950">
                    Email
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-bold text-neutral-950">
                    Role
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-bold text-neutral-950">
                    Created at
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr className="border-b border-neutral-200" key={user.id}>
                    <td className="px-3 py-4 text-md font-semibold text-neutral-950">
                      {(currentDataPage - 1) * USERS_PER_PAGE + index + 1}
                    </td>
                    <td className="px-3 py-4 text-md font-semibold text-neutral-950">
                      {user.name || "-"}
                    </td>
                    <td className="px-3 py-4 text-md font-semibold text-neutral-950">
                      {user.phone || "-"}
                    </td>
                    <td className="px-3 py-4 text-md font-semibold text-neutral-950">
                      {user.email || "-"}
                    </td>
                    <td className="px-3 py-4 text-md font-semibold text-neutral-950">
                      {user.role || "-"}
                    </td>
                    <td className="px-3 py-4 text-md font-semibold text-neutral-950">
                      {formatCreatedAt(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between gap-3 px-2">
              <p className="text-md font-medium text-neutral-950">
                Showing {fromEntry} to {toEntry} of {totalEntries} entries
              </p>
              <Pagination
                currentPage={currentDataPage}
                onPageChange={handlePageChange}
                totalPages={totalPages}
              />
            </div>
          </div>

          <div className="grid gap-2 lg:hidden">
            <p className="text-center text-sm font-medium text-neutral-950">
              Showing {fromEntry} to {toEntry} of {totalEntries} entries
            </p>
            <div className="flex w-full items-center justify-center overflow-x-hidden">
              <Pagination
                currentPage={currentDataPage}
                mobile
                onPageChange={handlePageChange}
                totalPages={totalPages}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
