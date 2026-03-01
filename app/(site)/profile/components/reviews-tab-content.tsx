"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

const reviewItems = Array.from({ length: 3 }, (_, index) => ({
  id: index + 1,
  date: "25 August 2025, 13:38",
  category: "Category",
  name: "Book Name",
  author: "Author name",
  image: "/dummy-recommendation.png",
  review:
    "Lorem ipsum dolor sit amet consectetur. Pulvinar porttitor aliquam viverra nunc sed facilisis. Integer tristique nullam morbi mauris ante.",
}));

export function ReviewsTabContent() {
  const [reviewSearchTerm, setReviewSearchTerm] = useState("");

  const filteredReviewItems = useMemo(() => {
    if (!reviewSearchTerm.trim()) {
      return reviewItems;
    }

    const query = reviewSearchTerm.toLowerCase();
    return reviewItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query),
    );
  }, [reviewSearchTerm]);

  return (
    <section className="grid gap-4">
      <h1 className="display-xs md:display-sm font-extrabold text-neutral-950">
        Reviews
      </h1>

      <label className="flex h-11 w-full items-center gap-2 rounded-full border border-neutral-300  px-4 lg:w-[560px]">
        <Image
          alt=""
          aria-hidden="true"
          height={20}
          src="/icon-search.svg"
          width={20}
        />
        <input
          className="h-full w-full bg-transparent text-sm text-neutral-950 outline-none placeholder:text-neutral-500 "
          onChange={(event) => setReviewSearchTerm(event.target.value)}
          placeholder="Search book"
          type="text"
          value={reviewSearchTerm}
        />
      </label>

      <div className="grid gap-4 lg:gap-5">
        {filteredReviewItems.map((item) => (
          <Card
            className="gap-0 rounded-3xl py-4 shadow-card border-none"
            key={item.id}
          >
            <CardContent className="grid gap-3 px-4 lg:gap-4 lg:px-4">
              <p className="text-sm md:text-md font-semibold text-neutral-950 ">
                {item.date}
              </p>

              <div className="h-px w-full bg-neutral-200" />

              <div className="flex flex-row gap-3 md:gap-4">
                <Image
                  alt={`${item.name} cover`}
                  className="md:w-23 md:h-34.5"
                  width={70}
                  height={106}
                  src={item.image}
                />

                <div className="flex flex-col items-start justify-center gap-1">
                  <div className="inline-flex w-fit items-center rounded-[6px] border border-neutral-300 px-2">
                    <span className="text-sm font-bold text-neutral-950">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm md:text-lg font-bold text-neutral-950">
                    {item.name}
                  </p>
                  <p className="text-sm md:text-md font-medium text-neutral-700">
                    {item.author}
                  </p>
                </div>
              </div>

              <div className="h-px w-full bg-neutral-200" />

              <div className="grid gap-2">
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
                  {item.review}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
