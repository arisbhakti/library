"use client";

import { Calendar } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const checkoutBooks = Array.from({ length: 2 }, (_, index) => ({
  id: index + 1,
  category: "Category",
  name: "Book Name",
  author: "Author name",
  image: "/dummy-recommendation.png",
}));

const borrowDurationOptions = [
  { label: "3 Days", value: "3" },
  { label: "5 Days", value: "5" },
  { label: "10 Days", value: "10" },
];

export default function CheckoutPage() {
  return (
    <main className="grid gap-6 px-4 py-4 lg:gap-8 lg:px-[120px] lg:py-8">
      <h1 className="display-xs font-bold md:display-lg text-neutral-950">
        Checkout
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_430px] lg:gap-10">
        <section className="grid content-start gap-6">
          <section className="grid gap-3">
            <h2 className="text-lg md:display-xs font-bold text-neutral-950 ">
              User Information
            </h2>
            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm md:text-md text-neutral-900">
                  Name
                </span>
                <span className="text-sm font-bold md:text-md text-neutral-950">
                  Johndoe
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm md:text-md text-neutral-900">
                  Email
                </span>
                <span className="text-sm font-bold md:text-md text-neutral-950">
                  johndoe@email.com
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm md:text-md text-neutral-900">
                  Nomor Handphone
                </span>
                <span className="text-sm font-bold md:text-md text-neutral-950">
                  081234567890
                </span>
              </div>
            </div>
          </section>

          <section className="grid gap-4 border-t border-neutral-200 pt-6">
            <h2 className="text-lg md:display-xs font-bold text-neutral-950 ">
              Book List
            </h2>

            <div className="grid gap-4">
              {checkoutBooks.map((item) => (
                <article
                  className="grid gap-0 border-b border-neutral-200 py-4 last:border-b-0"
                  key={item.id}
                >
                  <div className="flex items-start gap-3">
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
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="grid gap-4 rounded-3xl border border-neutral-200 bg-neutral-25 p-5 lg:h-fit">
          <h2 className="text-xl md:display-sm font-bold text-neutral-950 ">
            Complete Your Borrow Request
          </h2>

          <div className="grid gap-2">
            <p className="text-sm md:text-md font-bold text-neutral-950">
              Borrow Date
            </p>
            <div className="flex h-12 items-center justify-between rounded-2xl border border-neutral-300 bg-neutral-100 px-4">
              <span className="text-md font-semibold text-neutral-950">
                28 Aug 2024
              </span>
              <Calendar className="h-5 w-5 text-neutral-900" />
            </div>
          </div>

          <div className="grid gap-3">
            <p className="text-sm md:text-md font-semibold text-neutral-950">
              Borrow Duration
            </p>
            <RadioGroup className="grid gap-2" defaultValue="3">
              {borrowDurationOptions.map((option) => (
                <label className="flex items-center gap-3" key={option.value}>
                  <RadioGroupItem
                    className="h-6 w-6 border-neutral-300 text-neutral-25 data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300 [&_[data-slot=radio-group-indicator]_svg]:fill-neutral-25"
                    value={option.value}
                  />
                  <span className="text-sm md:text-md font-semibold text-neutral-950">
                    {option.label}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <section className="grid gap-0 rounded-2xl bg-neutral-100 p-4">
            <h3 className="font-bold text-sm md:text-md text-neutral-950">
              Return Date
            </h3>
            <p className="font-medium text-sm md:text-md text-neutral-900">
              Please return the book no later than{" "}
              <span className="font-bold text-[#EE1D52]">31 August 2025</span>
            </p>
          </section>

          <div className="grid gap-2">
            <label className="flex items-center gap-2">
              <Checkbox className="border-neutral-300 data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300" />
              <span className="font-semibold text-sm md:text-md text-neutral-950">
                I agree to return the book(s) before the due date.
              </span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox className="border-neutral-300 data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300" />
              <span className="font-semibold text-sm md:text-md text-neutral-950">
                I accept the library borrowing policy.
              </span>
            </label>
          </div>

          <Button className="h-12 rounded-full bg-primary-300 text-md font-bold text-neutral-25 hover:bg-primary-300/90">
            Confirm & Borrow
          </Button>
        </aside>
      </div>
    </main>
  );
}
