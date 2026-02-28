"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type BookStatus = "available" | "borrowed" | "returned" | "damaged";

type BookFilter = "all" | BookStatus;

type BookItem = {
  id: number;
  name: string;
  author: string;
  rating: string;
  category: string;
  status: BookStatus;
  image: string;
};

const bookFilters: { label: string; value: BookFilter }[] = [
  { label: "All", value: "all" },
  { label: "Available", value: "available" },
  { label: "Borrowed", value: "borrowed" },
  { label: "Returned", value: "returned" },
  { label: "Damaged", value: "damaged" },
];

const books: BookItem[] = [
  {
    id: 1,
    name: "The Psychology of Money",
    author: "Morgan Housel",
    rating: "4.9",
    category: "Business & Economics",
    status: "available",
    image: "/dummy-header-detail.png",
  },
  {
    id: 2,
    name: "The Psychology of Money",
    author: "Morgan Housel",
    rating: "4.9",
    category: "Business & Economics",
    status: "borrowed",
    image: "/dummy-header-detail.png",
  },
  {
    id: 3,
    name: "The Psychology of Money",
    author: "Morgan Housel",
    rating: "4.9",
    category: "Business & Economics",
    status: "returned",
    image: "/dummy-header-detail.png",
  },
  {
    id: 4,
    name: "The Psychology of Money",
    author: "Morgan Housel",
    rating: "4.9",
    category: "Business & Economics",
    status: "damaged",
    image: "/dummy-header-detail.png",
  },
];

export function BookListTabContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<BookFilter>("all");
  const [deleteTarget, setDeleteTarget] = useState<BookItem | null>(null);

  const filteredBooks = useMemo(() => {
    const byFilter =
      activeFilter === "all"
        ? books
        : books.filter((book) => book.status === activeFilter);

    if (!searchTerm.trim()) {
      return byFilter;
    }

    const query = searchTerm.toLowerCase();
    return byFilter.filter(
      (book) =>
        book.name.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query),
    );
  }, [activeFilter, searchTerm]);

  return (
    <section className="grid gap-4 lg:gap-6">
      <h1 className="text-display-xs font-semibold text-neutral-950 lg:display-sm">
        Book List
      </h1>

      <Button className="h-12 w-full rounded-full bg-primary-300 text-md font-semibold text-neutral-25 hover:bg-primary-300/90 lg:w-[216px]">
        Add Book
      </Button>

      <label className="flex h-12 w-full items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 px-4 lg:w-[560px]">
        <Image alt="" aria-hidden="true" height={20} src="/icon-search.svg" width={20} />
        <input
          className="h-full w-full bg-transparent text-md text-neutral-950 outline-none placeholder:text-neutral-500"
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search book"
          type="text"
          value={searchTerm}
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        {bookFilters.map((filter) => {
          const isActive = activeFilter === filter.value;

          return (
            <Button
              className={
                isActive
                  ? "h-10 rounded-full border border-primary-300 bg-neutral-25 px-4 text-md font-semibold text-primary-300 shadow-none hover:bg-neutral-25"
                  : "h-10 rounded-full border border-neutral-300 bg-neutral-25 px-4 text-md font-semibold text-neutral-950 shadow-none hover:bg-neutral-100"
              }
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              variant="outline"
            >
              {filter.label}
            </Button>
          );
        })}
      </div>

      <div className="grid gap-3 lg:gap-4">
        {filteredBooks.map((book) => (
          <article
            className="grid min-w-0 gap-3 rounded-3xl border border-neutral-200 bg-neutral-25 p-4 lg:grid-cols-[1fr_auto] lg:items-center"
            key={book.id}
          >
            <div className="flex min-w-0 items-start gap-3">
              <div className="relative h-[124px] w-[84px] overflow-hidden rounded-sm bg-neutral-100">
                <Image
                  alt={`${book.name} cover`}
                  className="object-cover"
                  fill
                  sizes="84px"
                  src={book.image}
                />
              </div>

              <div className="grid min-w-0 content-start gap-0">
                <div className="inline-flex w-fit items-center rounded-xl border border-neutral-300 px-3 py-1">
                  <span className="text-sm font-semibold text-neutral-950">
                    {book.category}
                  </span>
                </div>
                <p className="text-display-xs font-semibold text-neutral-950 lg:text-display-xs">
                  {book.name}
                </p>
                <p className="text-xl text-neutral-700">{book.author}</p>
                <div className="flex items-center gap-1">
                  <Image
                    alt=""
                    aria-hidden="true"
                    height={20}
                    src="/icon-star.svg"
                    width={20}
                  />
                  <span className="text-xl font-semibold text-neutral-950">
                    {book.rating}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid w-full grid-cols-3 gap-2 lg:flex lg:w-auto lg:items-center">
              <Button
                asChild
                className="h-11 rounded-full border border-neutral-300 bg-neutral-25 px-5 text-md font-semibold text-neutral-950 shadow-none hover:bg-neutral-100 lg:w-[96px]"
                variant="outline"
              >
                <Link href={`/preview/${book.id}`}>Preview</Link>
              </Button>
              <Button
                className="h-11 rounded-full border border-neutral-300 bg-neutral-25 px-5 text-md font-semibold text-neutral-950 shadow-none hover:bg-neutral-100 lg:w-[96px]"
                variant="outline"
              >
                Edit
              </Button>
              <Button
                className="h-11 rounded-full border border-neutral-300 bg-neutral-25 px-5 text-md font-semibold text-danger-300 shadow-none hover:bg-danger-300/10 lg:w-[96px]"
                onClick={() => setDeleteTarget(book)}
                variant="outline"
              >
                Delete
              </Button>
            </div>
          </article>
        ))}
      </div>

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        open={Boolean(deleteTarget)}
      >
        <DialogContent
          className="grid gap-3 rounded-3xl border border-neutral-200 bg-neutral-25 p-4 shadow-none lg:max-w-[640px] lg:gap-4 lg:p-6"
          showCloseButton={false}
        >
          <DialogTitle className="display-xs font-semibold text-neutral-950">
            Delete Data
          </DialogTitle>
          <DialogDescription className="text-display-xs text-neutral-900 lg:text-xl">
            Once deleted, you won&apos;t be able to recover this data.
          </DialogDescription>
          <div className="grid grid-cols-2 gap-3">
            <DialogClose asChild>
              <Button
                className="h-11 rounded-full border border-neutral-300 bg-neutral-25 text-md font-semibold text-neutral-950 shadow-none hover:bg-neutral-100"
                variant="outline"
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button className="h-11 rounded-full bg-danger-300 text-md font-semibold text-neutral-25 hover:bg-danger-300/90">
                Confirm
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
