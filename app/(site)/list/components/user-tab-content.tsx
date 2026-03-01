"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

type UserRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
};

type PaginationProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
  mobile?: boolean;
};

const users: UserRow[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  name: "John Doe",
  email: "johdoe@email.com",
  phone: "081234567890",
  createdAt: "28 Aug 2025, 14:00",
}));

const pageNumbers = [1, 2, 3];

function Pagination({
  currentPage,
  onPageChange,
  mobile = false,
}: PaginationProps) {
  const buttonClass = mobile
    ? "flex h-10 w-10 items-center justify-center rounded-xl text-md font-semibold text-neutral-950"
    : "flex h-10 w-10 items-center justify-center rounded-xl text-md font-semibold text-neutral-950";

  const activeButtonClass = mobile
    ? "flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-300 bg-neutral-25 text-md font-semibold text-neutral-950"
    : "flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-300 bg-neutral-25 text-md font-semibold text-neutral-950";

  const textButtonClass = mobile
    ? "flex h-10 items-center gap-1 rounded-xl px-1 text-md font-medium text-neutral-950"
    : "flex h-10 items-center gap-1 rounded-xl px-2 text-md font-medium text-neutral-950";

  return (
    <div className="flex w-full items-center justify-center gap-1 lg:w-auto">
      <button
        className={textButtonClass}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        type="button"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Previous</span>
      </button>

      {pageNumbers.map((page) => (
        <button
          className={currentPage === page ? activeButtonClass : buttonClass}
          key={page}
          onClick={() => onPageChange(page)}
          type="button"
        >
          {page}
        </button>
      ))}

      <span className="px-1 text-md text-neutral-950">...</span>

      <button
        className={textButtonClass}
        onClick={() => onPageChange(Math.min(3, currentPage + 1))}
        type="button"
      >
        <span>Next</span>
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

export function UserTabContent() {
  const [currentPage, setCurrentPage] = useState(2);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }

    const query = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query),
    );
  }, [searchTerm]);

  const mobileUsers = filteredUsers.slice(0, 6);

  return (
    <section className="grid gap-4 lg:gap-6">
      <h1 className="text-display-xs md:text-display-sm font-bold text-neutral-950 lg:display-sm">
        User
      </h1>

      <label className="flex h-11 w-full items-center gap-2 rounded-full border border-neutral-300  px-4 lg:w-[560px]">
        <Image
          alt=""
          aria-hidden="true"
          height={20}
          src="/icon-search.svg"
          width={20}
        />
        <input
          className="h-full w-full bg-transparent text-sm text-neutral-950 outline-none placeholder:text-neutral-500 "
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search book"
          type="text"
          value={searchTerm}
        />
      </label>

      {filteredUsers.length === 0 ? (
        <div className="grid h-48 place-items-center rounded-3xl border border-neutral-200 bg-neutral-25">
          <p className="text-md text-neutral-600">No user found.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:hidden">
            {mobileUsers.map((user) => (
              <article
                className="grid gap-1 rounded-2xl border box-border border-neutral-300 p-4 shadow-card"
                key={user.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-neutral-950 font-semibold">
                    No
                  </span>
                  <span className="text-sm font-semibold text-neutral-950">
                    {user.id}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-neutral-950 font-semibold">
                    Name
                  </span>
                  <span className="text-sm font-semibold text-neutral-950">
                    {user.name}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-neutral-950 font-semibold">
                    Email
                  </span>
                  <span className="max-w-[65%] break-all text-right text-sm font-bold text-neutral-950">
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-neutral-950 font-semibold">
                    Nomor Handphone
                  </span>
                  <span className="max-w-[65%] break-all text-right text-sm font-bold text-neutral-950">
                    {user.phone}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-neutral-950 font-semibold">
                    Created at
                  </span>
                  <span className="max-w-[65%] text-right text-sm font-bold text-neutral-950">
                    {user.createdAt}
                  </span>
                </div>
              </article>
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
                    Created at
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr className="border-b border-neutral-200" key={user.id}>
                    <td className="px-3 py-4 text-md text-neutral-950 font-semibold">
                      {user.id}
                    </td>
                    <td className="px-3 py-4 text-md text-neutral-950 font-semibold">
                      {user.name}
                    </td>
                    <td className="px-3 py-4 text-md text-neutral-950 font-semibold">
                      {user.phone}
                    </td>
                    <td className="px-3 py-4 text-md text-neutral-950 font-semibold">
                      {user.email}
                    </td>
                    <td className="px-3 py-4 text-md text-neutral-950 font-semibold">
                      {user.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between gap-3 px-2">
              <p className="text-md text-neutral-950 font-medium">
                Showing 1 to 10 of 60 entries
              </p>
              <Pagination
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>

          <div className="flex w-full items-center justify-center overflow-x-hidden lg:hidden">
            <Pagination
              currentPage={currentPage}
              mobile
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </section>
  );
}
