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
      <main className="grid gap-4 lg:gap-6px-4 pb-24 pt-4 lg:px-30 lg:pb-20 lg:pt-8 px-4">
        <Breadcrumb>
          <BreadcrumbList className="gap-1 text-xs lg:text-sm">
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

        <section className="grid gap-9 lg:grid-cols-[auto_1fr] ">
          <div className="grid justify-center">
            <div className="bg-neutral-200 p-[5.29px] lg:p-2">
              <Image
                alt="The Psychology of Money"
                className="md:w-[321px] md:h-[482px]  object-cover"
                height={318}
                priority
                src="/dummy-header-detail.png"
                width={212}
              />
            </div>
          </div>

          <div className="grid content-start gap-4">
            <div className="inline-flex w-fit items-center rounded-[6px] border border-neutral-300 px-2 py-0">
              <span className="text-sm font-bold text-neutral-950 lg:text-md">
                Business & Economics
              </span>
            </div>

            <div className="grid gap-1">
              <h1 className="display-xs font-bold text-neutral-950 lg:display-sm">
                The Psychology of Money
              </h1>
              <p className="text-sm md:text-md text-neutral-700">
                Morgan Housel
              </p>
              <div className="flex items-center gap-1">
                <Image
                  alt=""
                  aria-hidden="true"
                  height={24}
                  src="/icon-star.svg"
                  width={24}
                />
                <span className="text-md font-bold text-neutral-950">4.9</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:w-[386px]">
              <div className="grid gap-0">
                <p className="text-lg md:display-xs font-bold text-neutral-950">
                  320
                </p>
                <p className="text-sm text-neutral-900 md:text-md font-medium">
                  Page
                </p>
              </div>
              <div className="grid gap-0 border-l border-neutral-300 pl-3">
                <p className="text-lg md:display-xs font-bold text-neutral-950">
                  212
                </p>
                <p className="text-sm text-neutral-900 md:text-md font-medium">
                  Rating
                </p>
              </div>
              <div className="grid gap-0 border-l border-neutral-300 pl-3">
                <p className="text-lg md:display-xs font-bold text-neutral-950">
                  179
                </p>
                <p className="text-sm text-neutral-900 md:text-md font-medium">
                  Reviews
                </p>
              </div>
            </div>

            <section className="grid gap-2 border-t border-neutral-200 pt-4">
              <h2 className="text-xl font-bold text-neutral-950">
                Description
              </h2>
              <p className="text-sm text-neutral-900 lg:text-md font-medium">
                The Psychology of Money explores how emotions, biases, and human
                behavior shape the way we think about money, investing, and
                financial decisions. Morgan Housel shares timeless lessons on
                wealth, greed, and happiness, showing that financial success is
                not about knowledge, but about behavior.
              </p>
            </section>
            <div className="hidden md:flex gap-3 w-fit">
              <Button
                className="h-11 w-50 p-2 rounded-full border border-neutral-300 bg-neutral-25 text-md font-bold text-neutral-950 shadow-none hover:bg-neutral-100"
                variant="outline"
              >
                Add to Cart
              </Button>
              <Button className="h-11 w-50 p-2 rounded-full bg-primary-300 text-md font-bold text-neutral-25 hover:bg-primary-300/90">
                Borrow Book
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 border-t border-neutral-200 pt-8">
          <h2 className="display-xs md:display-lg font-extrabold text-neutral-950">
            Review
          </h2>
          <div className="flex items-center gap-1">
            <Image
              alt=""
              aria-hidden="true"
              height={24}
              src="/icon-star.svg"
              width={24}
              className="md:w-8.5 md:h-8.5"
            />
            <span className="text-md md:text-xl font-bold md:font-extrabold text-neutral-950">
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
                  <Avatar className="size-14.5 md:size-16">
                    <AvatarImage alt={review.name} src={review.avatar} />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-0">
                    <p className="text-sm md:text-lg font-bold text-neutral-950">
                      {review.name}
                    </p>
                    <p className="text-sm md:text-md text-neutral-950 font-medium">
                      {review.datetime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Image
                      alt=""
                      aria-hidden="true"
                      height={24}
                      key={index}
                      src="/icon-star.svg"
                      width={24}
                    />
                  ))}
                </div>

                <p className="text-sm md:text-md text-neutral-950 font-semibold">
                  {review.text}
                </p>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <Button
              className="h-10 w-37.5 md:h-12 md:w-50 rounded-full border border-neutral-300 bg-neutral-25 px-10 text-sm md:text-md font-bold text-neutral-950 shadow-none hover:bg-neutral-100"
              variant="outline"
            >
              Load More
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:gap-10 border-t border-neutral-200 pt-8">
          <h2 className="display-xs font-bold md:display-lg text-neutral-950">
            Related Books
          </h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-4">
            {relatedBooks.map((book) => (
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
