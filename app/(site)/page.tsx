import Image from "next/image";

import { HomeCarousel } from "@/components/home/home-carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const categories = [
  { icon: "/category-fiction.svg", name: "Fiction" },
  { icon: "/category-non-fiction.svg", name: "Non-Fiction" },
  { icon: "/category-self-improvement.svg", name: "Self-Improvement" },
  { icon: "/category-finance.svg", name: "Finance" },
  { icon: "/category-science.svg", name: "Science" },
  { icon: "/category-education.svg", name: "Education" },
];

const recommendationItems = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  image: "/dummy-recommendation.png",
  name: "Book Name",
  author: "Author name",
  rating: "4.9",
}));

const popularAuthors = Array.from({ length: 4 }, (_, index) => ({
  id: index + 1,
  name: "Author name",
  books: "5 books",
  avatar: "/dummy-avatar.png",
}));

export default function HomePage() {
  return (
    <main className="grid gap-8 px-4 py-4 lg:gap-10 lg:px-[120px] lg:py-8">
      <HomeCarousel />

      <section className="grid gap-3 lg:gap-4">
        <div className="grid grid-cols-3 gap-3 lg:grid-cols-6 lg:gap-4">
          {categories.map((category) => (
            <article
              className="grid gap-2 rounded-2xl border border-neutral-200 bg-neutral-25 p-2 lg:p-3"
              key={category.name}
            >
              <div className="flex h-14 items-center justify-center rounded-xl bg-primary-100 lg:h-16">
                <Image alt={category.name} height={52} src={category.icon} width={52} />
              </div>
              <p className="text-xs font-semibold text-neutral-950 lg:text-sm">{category.name}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:gap-6">
        <h2 className="display-xs font-semibold text-neutral-950">Recommendation</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-4">
          {recommendationItems.map((book) => (
            <article className="grid gap-2 rounded-xl border border-neutral-200 bg-neutral-25 p-2" key={book.id}>
              <div className="relative aspect-[224/336] w-full overflow-hidden rounded-lg">
                <Image
                  alt={`${book.name} cover`}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) calc((100vw - 304px) / 5), calc((100vw - 44px) / 2)"
                  src={book.image}
                />
              </div>
              <div className="grid gap-0">
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

        <div className="flex items-center justify-center">
          <Button
            className="h-10 rounded-full border border-neutral-300 bg-neutral-25 px-8 text-sm font-semibold text-neutral-950 shadow-none hover:bg-neutral-100"
            variant="outline"
          >
            Load More
          </Button>
        </div>
      </section>

      <section className="grid gap-4 border-t border-neutral-200 pt-6 lg:gap-6 lg:pt-8">
        <h2 className="display-xs font-semibold text-neutral-950">Popular Authors</h2>
        <div className="grid gap-3 lg:grid-cols-4 lg:gap-4">
          {popularAuthors.map((author) => (
            <article
              className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-25 p-3"
              key={author.id}
            >
              <Avatar className="size-10 lg:size-12">
                <AvatarImage alt={author.name} src={author.avatar} />
                <AvatarFallback>AN</AvatarFallback>
              </Avatar>
              <div className="grid gap-0">
                <p className="text-sm font-semibold text-neutral-950 lg:text-md">{author.name}</p>
                <div className="flex items-center gap-1">
                  <Image alt="" aria-hidden="true" height={14} src="/blue-book-with-white-pin.svg" width={14} />
                  <span className="text-xs text-neutral-700 lg:text-sm">{author.books}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
