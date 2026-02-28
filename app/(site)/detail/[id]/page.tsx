"use client";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

const reviewItems = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  name: "John Doe",
  datetime: "25 August 2025, 13:38",
  text: "Lorem ipsum dolor sit amet consectetur. Pulvinar porttitor aliquam viverra nunc sed facilisis. Integer tristique nullam morbi mauris ante.",
  avatar: "/dummy-avatar.png",
}));

const relatedBooks = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  name: "Book Name",
  author: "Author name",
  rating: "4.9",
  image: "/dummy-recommendation.png",
}));

export default function DetailPage() {
  return (
    <>
      <main className="grid gap-8 px-4 pb-24 pt-4 lg:gap-10 lg:px-[120px] lg:pb-10 lg:pt-8">
        <Breadcrumb>
          <BreadcrumbList className="gap-2 text-xs lg:text-sm">
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="font-semibold text-primary-300 hover:text-primary-300/90"
              >
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-neutral-900 [&>svg]:size-4" />
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="font-semibold text-primary-300 hover:text-primary-300/90"
              >
                <Link href="/">Category</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-neutral-900 [&>svg]:size-4" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-neutral-950">
                The Psychology of Money
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section className="grid gap-5 lg:grid-cols-[auto_1fr] lg:gap-6">
          <div className="grid justify-center">
            <div className="bg-neutral-200 p-[5.29px] lg:p-2">
              <Image
                alt="The Psychology of Money"
                className="h-auto w-[321px] max-w-full object-cover"
                height={482}
                priority
                src="/dummy-header-detail.png"
                width={321}
              />
            </div>
          </div>

          <div className="grid content-start gap-4">
            <div className="inline-flex w-fit items-center rounded-xl border border-neutral-300 px-3 py-1">
              <span className="text-xs font-semibold text-neutral-950 lg:text-sm">
                Business & Economics
              </span>
            </div>

            <div className="grid gap-1">
              <h1 className="display-sm font-semibold text-neutral-950 lg:display-xs">
                The Psychology of Money
              </h1>
              <p className="text-xl text-neutral-700">Morgan Housel</p>
              <div className="flex items-center gap-1">
                <Image
                  alt=""
                  aria-hidden="true"
                  height={20}
                  src="/icon-star.svg"
                  width={20}
                />
                <span className="text-xl font-semibold text-neutral-950">
                  4.9
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-0">
                <p className="display-xs font-semibold text-neutral-950">320</p>
                <p className="text-xl text-neutral-900">Page</p>
              </div>
              <div className="grid gap-0 border-l border-neutral-300 pl-3">
                <p className="display-xs font-semibold text-neutral-950">212</p>
                <p className="text-xl text-neutral-900">Rating</p>
              </div>
              <div className="grid gap-0 border-l border-neutral-300 pl-3">
                <p className="display-xs font-semibold text-neutral-950">179</p>
                <p className="text-xl text-neutral-900">Reviews</p>
              </div>
            </div>

            <section className="grid gap-2 border-t border-neutral-200 pt-4">
              <h2 className="display-xs font-semibold text-neutral-950">
                Description
              </h2>
              <p className="text-sm text-neutral-900 lg:text-md">
                The Psychology of Money explores how emotions, biases, and human
                behavior shape the way we think about money, investing, and
                financial decisions. Morgan Housel shares timeless lessons on
                wealth, greed, and happiness, showing that financial success is
                not about knowledge, but about behavior.
              </p>
            </section>
          </div>
        </section>

        <section className="grid gap-4 border-t border-neutral-200 pt-8">
          <h2 className="display-xs font-semibold text-neutral-950">Review</h2>
          <div className="flex items-center gap-1">
            <Image
              alt=""
              aria-hidden="true"
              height={20}
              src="/icon-star.svg"
              width={20}
            />
            <span className="text-xl font-semibold text-neutral-950">
              4.9 (24 Ulasan)
            </span>
          </div>

          <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
            {reviewItems.map((review) => (
              <article
                className="grid gap-2 rounded-2xl border border-neutral-200 bg-neutral-25 p-4"
                key={review.id}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage alt={review.name} src={review.avatar} />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-0">
                    <p className="text-md font-semibold text-neutral-950">
                      {review.name}
                    </p>
                    <p className="text-sm text-neutral-700">
                      {review.datetime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Image
                      alt=""
                      aria-hidden="true"
                      height={16}
                      key={index}
                      src="/icon-star.svg"
                      width={16}
                    />
                  ))}
                </div>

                <p className="text-sm text-neutral-900 lg:text-md">
                  {review.text}
                </p>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <Button
              className="h-10 rounded-full border border-neutral-300 bg-neutral-25 px-10 text-md font-semibold text-neutral-950 shadow-none hover:bg-neutral-100"
              variant="outline"
            >
              Load More
            </Button>
          </div>
        </section>

        <section className="grid gap-4 border-t border-neutral-200 pt-8">
          <h2 className="display-xs font-semibold text-neutral-950">
            Related Books
          </h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-4">
            {relatedBooks.map((book) => (
              <article
                className="grid gap-2 rounded-xl border border-neutral-200 bg-neutral-25 p-2"
                key={book.id}
              >
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
                  <p className="text-sm font-semibold text-neutral-950 lg:text-md">
                    {book.name}
                  </p>
                  <p className="text-xs text-neutral-500 lg:text-sm">
                    {book.author}
                  </p>
                  <div className="flex items-center gap-1">
                    <Image
                      alt=""
                      aria-hidden="true"
                      height={16}
                      src="/icon-star.svg"
                      width={16}
                    />
                    <span className="text-xs text-neutral-700 lg:text-sm">
                      {book.rating}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-neutral-200 bg-neutral-25 px-4 py-4 lg:hidden">
        <div className="flex h-10 w-full gap-3">
          <Button
            className="h-10 flex-1 rounded-full border border-neutral-300 bg-neutral-25 text-md font-semibold text-neutral-950 shadow-none hover:bg-neutral-100"
            variant="outline"
          >
            Add to Cart
          </Button>
          <Button className="h-10 flex-1 rounded-full bg-primary-300 text-md font-semibold text-neutral-25 hover:bg-primary-300/90">
            Borrow Book
          </Button>
        </div>
      </div>
    </>
  );
}
