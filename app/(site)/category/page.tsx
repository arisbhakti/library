"use client";

import { ListFilter, Star, X } from "lucide-react";
import Image from "next/image";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const categoryFilters = [
  { checked: true, label: "Fiction" },
  { checked: false, label: "Non-fiction" },
  { checked: false, label: "Self-Improve" },
  { checked: false, label: "Finance" },
  { checked: false, label: "Science" },
  { checked: false, label: "Education" },
];

const ratingFilters = [5, 4, 3, 2, 1];

const books = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: "Book Name",
  author: "Author name",
  rating: "4.9",
  image: "/dummy-recommendation.png",
}));

function FilterFields() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        <p className="text-md md:text-lg font-extrabold text-neutral-950">
          Category
        </p>
        <div className="grid gap-2">
          {categoryFilters.map((item) => (
            <label className="flex items-center gap-2" key={item.label}>
              <Checkbox
                className="border-neutral-300 data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300"
                defaultChecked={item.checked}
              />
              <span className="text-md text-neutral-900">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-3 border-t border-neutral-200 pt-4">
        <p className="text-lg font-extrabold text-neutral-950">Rating</p>
        <div className="grid gap-2">
          {ratingFilters.map((rating) => (
            <label className="flex items-center gap-2" key={rating}>
              <Checkbox className="border-neutral-300" />
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

function MobileFilterSidebar() {
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
          <FilterFields />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default function CategoryPage() {
  return (
    <SidebarProvider className="block! ">
      <main className="grid gap-5 px-4 py-4 lg:gap-8 lg:px-[120px] lg:py-8">
        <h1 className="display-xs md:display-lg font-bold text-neutral-950">
          Book List
        </h1>

        <MobileFilterTrigger />

        <div className="grid gap-4 lg:grid-cols-[266px_1fr] lg:gap-10 ">
          <aside className="hidden lg:block ">
            <div className="grid gap-4 rounded-2xl  p-4 shadow-card">
              <p className="text-sm md:text-md font-extrabold text-neutral-950">
                FILTER
              </p>
              <FilterFields />
            </div>
          </aside>

          <section className="grid gap-3 lg:gap-4">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
              {books.map((book) => (
                <article
                  className="grid gap-0 overflow-hidden rounded-xl  shadow-card"
                  key={book.id}
                >
                  <Image
                    alt={`${book.name} cover`}
                    className="w-full object-cover md:h-84!"
                    height={258}
                    width={258}
                    src={book.image}
                  />
                  <div className="grid gap-0.5 p-3 md:gap-1 md:p-4">
                    <p className="text-sm font-bold text-neutral-950 lg:text-lg">
                      {book.name}
                    </p>
                    <p className="text-sm text-neutral-700 lg:text-md">
                      {book.author}
                    </p>
                    <div className="flex items-center gap-1 justi">
                      <Image
                        alt=""
                        aria-hidden="true"
                        height={24}
                        src="/icon-star.svg"
                        width={24}
                      />
                      <span className="text-sm text-neutral-700 lg:text-md font-semibold">
                        {book.rating}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <MobileFilterSidebar />
    </SidebarProvider>
  );
}
