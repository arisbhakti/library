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
      <section className="grid gap-3 rounded-2xl border border-neutral-200 bg-neutral-25 p-4">
        <div className="flex items-center gap-3">
          <Image alt="Author avatar" className="h-16 w-16 rounded-full object-cover" height={64} src="/dummy-avatar.png" width={64} />
          <div className="grid gap-0">
            <p className="display-xs font-semibold text-neutral-950">Author name</p>
            <div className="flex items-center gap-1">
              <Image alt="" aria-hidden="true" height={16} src="/blue-book-with-white-pin.svg" width={16} />
              <span className="text-xl text-neutral-900">5 books</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 lg:gap-4">
        <h1 className="display-md font-semibold text-neutral-950">Book List</h1>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-4">
          {books.map((book) => (
            <article className="grid gap-0 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-25" key={book.id}>
              <div className="relative aspect-[224/336] w-full overflow-hidden rounded-t-2xl rounded-b-none">
                <Image
                  alt={`${book.name} cover`}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) calc((100vw - 304px) / 5), calc((100vw - 44px) / 2)"
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
    </main>
  );
}
