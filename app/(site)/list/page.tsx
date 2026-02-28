"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ListTab = "borrowed-list" | "user" | "book-list";

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

      <span
        className={
          mobile ? "px-1 text-md text-neutral-950" : "px-1 text-md text-neutral-950"
        }
      >
        ...
      </span>

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

export default function ListPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<ListTab>("user");
  const [currentPage, setCurrentPage] = useState(2);
  const [searchTerm, setSearchTerm] = useState("");

  const role = searchParams.get("role") ?? "admin";
  const isAdmin = role === "admin";

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

  if (!isAdmin) {
    return (
      <main className="grid gap-6 overflow-x-hidden px-4 py-4 lg:gap-8 lg:px-[120px] lg:py-8">
        <section className="grid w-full gap-3">
          <h1 className="text-display-xs font-semibold text-neutral-950 lg:display-sm">
            Access Restricted
          </h1>
          <p className="text-md text-neutral-700">
            This page is only accessible for admin role.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="grid gap-6 overflow-x-hidden px-4 py-4 lg:gap-8 lg:px-[120px] lg:py-8">
      <section className="grid w-full min-w-0 gap-6">
        <Tabs
          className="w-full min-w-0"
          onValueChange={(value) => setActiveTab(value as ListTab)}
          value={activeTab}
        >
          <TabsList className="h-14 w-full min-w-0 rounded-3xl bg-neutral-200 p-1 lg:h-[74px] lg:w-[560px] lg:rounded-3xl lg:p-2">
            <TabsTrigger
              className="h-full min-w-0 rounded-2xl px-2 text-md font-medium leading-none text-neutral-600 data-[state=active]:bg-neutral-25 data-[state=active]:text-neutral-950 data-[state=active]:shadow-none lg:text-xl"
              value="borrowed-list"
            >
              Borrowed List
            </TabsTrigger>
            <TabsTrigger
              className="h-full min-w-0 rounded-2xl px-2 text-md font-semibold leading-none text-neutral-600 data-[state=active]:bg-neutral-25 data-[state=active]:text-neutral-950 data-[state=active]:shadow-none lg:text-xl"
              value="user"
            >
              User
            </TabsTrigger>
            <TabsTrigger
              className="h-full min-w-0 rounded-2xl px-2 text-md font-medium leading-none text-neutral-600 data-[state=active]:bg-neutral-25 data-[state=active]:text-neutral-950 data-[state=active]:shadow-none lg:text-xl"
              value="book-list"
            >
              Book List
            </TabsTrigger>
          </TabsList>

          <TabsContent className="grid gap-4" value="borrowed-list">
            <h1 className="text-display-xs font-semibold text-neutral-950 lg:display-sm">
              Borrowed List
            </h1>
          </TabsContent>

          <TabsContent className="grid gap-4 lg:gap-6" value="user">
            <h1 className="text-display-xs font-semibold text-neutral-950 lg:display-sm">User</h1>

            <label className="flex h-14 w-full items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 px-4 lg:w-[560px]">
              <Image
                alt=""
                aria-hidden="true"
                height={20}
                src="/icon-search.svg"
                width={20}
              />
              <input
                className="h-full w-full bg-transparent text-md text-neutral-950 outline-none placeholder:text-neutral-500 lg:text-md"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search user"
                type="text"
                value={searchTerm}
              />
            </label>

            {filteredUsers.length === 0 ? (
              <div className="grid h-48 place-items-center rounded-3xl border border-neutral-200 bg-neutral-25">
                <p className="text-md text-neutral-600">
                  No user found.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 lg:hidden">
                  {mobileUsers.map((user) => (
                    <article
                      className="grid gap-1 rounded-3xl border border-neutral-200 bg-neutral-25 p-4"
                      key={user.id}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-md text-neutral-950">
                          No
                        </span>
                        <span className="text-md font-semibold text-neutral-950">
                          {user.id}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-md text-neutral-950">
                          Name
                        </span>
                        <span className="text-md font-semibold text-neutral-950">
                          {user.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-md text-neutral-950">
                          Email
                        </span>
                        <span className="max-w-[65%] break-all text-right text-md font-semibold text-neutral-950">
                          {user.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-md text-neutral-950">
                          Nomor Handphone
                        </span>
                        <span className="max-w-[65%] break-all text-right text-md font-semibold text-neutral-950">
                          {user.phone}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-md text-neutral-950">
                          Created at
                        </span>
                        <span className="max-w-[65%] text-right text-md font-semibold text-neutral-950">
                          {user.createdAt}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="hidden rounded-3xl border border-neutral-300 bg-neutral-25 p-3 lg:grid lg:gap-3">
                  <table className="w-full border-collapse">
                    <thead className="bg-neutral-100">
                      <tr>
                        <th className="px-3 py-3 text-left text-md font-semibold text-neutral-950">
                          No
                        </th>
                        <th className="px-3 py-3 text-left text-md font-semibold text-neutral-950">
                          Name
                        </th>
                        <th className="px-3 py-3 text-left text-md font-semibold text-neutral-950">
                          Nomor Handphone
                        </th>
                        <th className="px-3 py-3 text-left text-md font-semibold text-neutral-950">
                          Email
                        </th>
                        <th className="px-3 py-3 text-left text-md font-semibold text-neutral-950">
                          Created at
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          className="border-b border-neutral-200"
                          key={user.id}
                        >
                          <td className="px-3 py-4 text-md text-neutral-950">
                            {user.id}
                          </td>
                          <td className="px-3 py-4 text-md text-neutral-950">
                            {user.name}
                          </td>
                          <td className="px-3 py-4 text-md text-neutral-950">
                            {user.phone}
                          </td>
                          <td className="px-3 py-4 text-md text-neutral-950">
                            {user.email}
                          </td>
                          <td className="px-3 py-4 text-md text-neutral-950">
                            {user.createdAt}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex items-center justify-between gap-3 px-2">
                    <p className="text-md text-neutral-950">
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
          </TabsContent>

          <TabsContent className="grid gap-4" value="book-list">
            <h1 className="text-display-xs font-semibold text-neutral-950 lg:display-sm">
              Book List
            </h1>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
