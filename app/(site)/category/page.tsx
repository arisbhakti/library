"use client";

import { ListFilter, Star, X } from "lucide-react";
import Image from "next/image";

import { Checkbox } from "@/components/ui/checkbox";
import { Sidebar, SidebarContent, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
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
        <p className="display-xs font-semibold text-neutral-950">Category</p>
        <div className="grid gap-2">
          {categoryFilters.map((item) => (
            <label className="flex items-center gap-2" key={item.label}>
              <Checkbox
                className="border-neutral-300 data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300"
                defaultChecked={item.checked}
              />
              <span className="text-xl text-neutral-900">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-3 border-t border-neutral-200 pt-4">
        <p className="display-xs font-semibold text-neutral-950">Rating</p>
        <div className="grid gap-2">
          {ratingFilters.map((rating) => (
            <label className="flex items-center gap-2" key={rating}>
              <Checkbox className="border-neutral-300" />
              <Star className="h-4 w-4 fill-[#FFAB0D] text-[#FFAB0D]" />
              <span className="text-xl text-neutral-900">{rating}</span>
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
      <span className="display-xs font-semibold text-neutral-950">FILTER</span>
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
            <p className="display-xs font-semibold text-neutral-950">FILTER</p>
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
    <SidebarProvider className="!block bg-neutral-100">
      <main className="grid gap-5 px-4 py-4 lg:gap-8 lg:px-[120px] lg:py-8">
        <h1 className="display-md font-semibold text-neutral-950">Book List</h1>

        <MobileFilterTrigger />

        <div className="grid gap-4 lg:grid-cols-[280px_1fr] lg:gap-10">
          <aside className="hidden lg:block">
            <div className="grid gap-4 rounded-2xl border border-neutral-200 bg-neutral-25 p-4">
              <p className="display-xs font-semibold text-neutral-950">FILTER</p>
              <FilterFields />
            </div>
          </aside>

          <section className="grid gap-3 lg:gap-4">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
              {books.map((book) => (
                <article
                  className={cn(
                    "grid gap-0 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-25"
                  )}
                  key={book.id}
                >
                  <div className="relative aspect-[224/336] w-full overflow-hidden rounded-t-2xl rounded-b-none">
                    <Image
                      alt={`${book.name} cover`}
                      className="object-cover"
                      fill
                      sizes="(min-width: 1024px) calc((100vw - 568px) / 4), calc((100vw - 44px) / 2)"
                      src={book.image}
                    />
                  </div>
                  <div className="grid gap-0 p-3">
                    <p className="text-sm font-semibold text-neutral-950 lg:text-md">{book.name}</p>
                    <p className="text-xs text-neutral-500 lg:text-sm">{book.author}</p>
                    <div className="flex items-center gap-1">
                      <Image alt="" aria-hidden="true" height={16} src="/icon-star.svg" width={16} />
                      <span className="text-xs text-neutral-700 lg:text-sm">{book.rating}</span>
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
