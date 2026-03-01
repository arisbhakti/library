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
      <h1 className="display-md font-semibold text-neutral-950">Reviews</h1>

      <label className="flex h-12 w-full items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 px-4 lg:w-[560px]">
        <Image alt="" aria-hidden="true" height={20} src="/icon-search.svg" width={20} />
        <input
          className="h-full w-full bg-transparent text-md text-neutral-950 outline-none placeholder:text-neutral-500 lg:text-sm"
          onChange={(event) => setReviewSearchTerm(event.target.value)}
          placeholder="Search book"
          type="text"
          value={reviewSearchTerm}
        />
      </label>

      <div className="grid gap-4 lg:gap-5">
        {filteredReviewItems.map((item) => (
          <Card
            className="gap-0 rounded-3xl border border-neutral-200 bg-neutral-25 py-4 shadow-none"
            key={item.id}
          >
            <CardContent className="grid gap-3 px-4 lg:gap-4 lg:px-4">
              <p className="text-md font-semibold text-neutral-950 lg:text-sm">
                {item.date}
              </p>

              <div className="h-px w-full bg-neutral-200" />

              <div className="flex items-start gap-3">
                <div className="relative aspect-[224/336] w-[84px] overflow-hidden rounded-md lg:w-[72px]">
                  <Image
                    alt={`${item.name} cover`}
                    className="object-cover"
                    fill
                    sizes="84px"
                    src={item.image}
                  />
                </div>

                <div className="grid content-start gap-1">
                  <div className="inline-flex w-fit items-center rounded-xl border border-neutral-300 px-3 py-1">
                    <span className="text-md font-semibold text-neutral-950 lg:text-sm">
                      {item.category}
                    </span>
                  </div>
                  <p className="display-xs font-semibold text-neutral-950 lg:text-display-xs">
                    {item.name}
                  </p>
                  <p className="text-xl text-neutral-700 lg:text-md">{item.author}</p>
                </div>
              </div>

              <div className="h-px w-full bg-neutral-200" />

              <div className="grid gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Image
                      alt=""
                      aria-hidden="true"
                      height={20}
                      key={index}
                      src="/icon-star.svg"
                      width={20}
                    />
                  ))}
                </div>
                <p className="text-display-xs text-neutral-950 lg:text-md">{item.review}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
