import Image from "next/image";

const books = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: "Book Name",
  author: "Author name",
  rating: "4.9",
  image: "/dummy-recommendation.png",
}));

export default function BookByAuthorPage() {
  return (
    <main className="grid gap-5 px-4 py-4 lg:gap-8 lg:px-[120px] lg:py-8">
      <section className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-3 md:p-4">
        <div className="flex items-center gap-3 md:gap-4">
          <Image
            alt="Author avatar"
            className="h-15 w-15 md:w-20.25 md:h-20.25 rounded-full object-cover"
            height={64}
            src="/dummy-avatar.png"
            width={64}
          />
          <div className="grid gap-0.5">
            <p className="text-md md:text-lg font-bold text-neutral-900">
              Author name
            </p>
            <div className="flex items-center gap-1">
              <Image
                alt=""
                aria-hidden="true"
                height={24}
                src="/blue-book-with-white-pin.svg"
                width={24}
              />
              <span className="text-sm md:text-md font-medium text-neutral-900">
                5 books
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 lg:gap-4">
        <h1 className="display-xs md:display-lg font-bold text-neutral-950">
          Book List
        </h1>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-5">
          {books.map((book) => (
            <article
              className="grid gap-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-25"
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
    </main>
  );
}
