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
    <main className="grid gap-8 px-4 py-4 lg:gap-10 lg:px-[120px] lg:py-8 bg-white">
      <HomeCarousel />

      <section className="grid gap-3 lg:gap-4">
        <div className="grid grid-cols-3 gap-3 lg:grid-cols-6 lg:gap-4">
          {categories.map((category) => (
            <article
              className="grid gap-2 rounded-2xl  p-2 lg:p-3 shadow-card"
              key={category.name}
            >
              <div className="flex items-center justify-center rounded-xl bg-primary-50 p-[5.6px] md:p-[6.4px] ">
                <Image
                  alt={category.name}
                  height={44.8}
                  src={category.icon}
                  width={44.8}
                  className="md:w-[51.2px] md:h-[51.2px]"
                />
              </div>
              <p className="text-xs font-semibold text-neutral-950 md:text-md">
                {category.name}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:gap-6">
        <h2 className="display-xs font-bold text-neutral-950 md:text-display-lg">
          Recommendation
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-5">
          {recommendationItems.map((book) => (
            <article
              className="grid gap-0 overflow-hidden rounded-xl shadow-card "
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

        <div className="flex items-center justify-center">
          <Button
            className="h-10 md:h-12 md:w-50 w-37.5 rounded-full border border-neutral-300 bg-neutral-25 p-2 text-sm  text-neutral-950 shadow-none hover:bg-neutral-100 md:text-md font-bold"
            variant="outline"
          >
            Load More
          </Button>
        </div>
      </section>

      <section className="grid gap-4 border-t border-neutral-200 pt-6 lg:gap-6 lg:pt-8">
        <h2 className="display-xs font-bold text-neutral-950 md:text-display-lg">
          Popular Authors
        </h2>
        <div className="grid gap-4 lg:grid-cols-4 lg:gap-5">
          {popularAuthors.map((author) => (
            <article
              className="flex items-center gap-3 rounded-xl shadow-card p-3 md:p-4 md:gap-4"
              key={author.id}
            >
              <Avatar className="size-15 lg:size-20.25">
                <AvatarImage alt={author.name} src={author.avatar} />
                <AvatarFallback>AN</AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5">
                <p className="text-md font-bold text-neutral-950 md:text-lg">
                  {author.name}
                </p>
                <div className="flex items-center gap-1.5">
                  <Image
                    alt=""
                    aria-hidden="true"
                    height={24}
                    src="/blue-book-with-white-pin.svg"
                    width={24}
                  />
                  <span className="text-sm text-neutral-950 md:text-md">
                    {author.books}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
