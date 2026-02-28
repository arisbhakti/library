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
      <h1 className="display-md font-semibold text-neutral-950">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_430px] lg:gap-10">
        <section className="grid content-start gap-6">
          <section className="grid gap-3">
            <h2 className="display-sm font-semibold text-neutral-950 lg:display-xs">User Information</h2>
            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xl text-neutral-900">Name</span>
                <span className="display-xs font-semibold text-neutral-950">Johndoe</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xl text-neutral-900">Email</span>
                <span className="display-xs font-semibold text-neutral-950">johndoe@email.com</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xl text-neutral-900">Nomor Handphone</span>
                <span className="display-xs font-semibold text-neutral-950">081234567890</span>
              </div>
            </div>
          </section>

          <section className="grid gap-4 border-t border-neutral-200 pt-6">
            <h2 className="display-sm font-semibold text-neutral-950 lg:display-xs">Book List</h2>

            <div className="grid gap-4">
              {checkoutBooks.map((book) => (
                <article className="flex items-start gap-3" key={book.id}>
                  <div className="relative aspect-[224/336] w-[88px] overflow-hidden rounded-md lg:w-[96px]">
                    <Image alt={`${book.name} cover`} className="object-cover" fill sizes="96px" src={book.image} />
                  </div>
                  <div className="grid content-start gap-1">
                    <div className="inline-flex w-fit items-center rounded-xl border border-neutral-300 px-3 py-1">
                      <span className="text-md font-semibold text-neutral-950">{book.category}</span>
                    </div>
                    <p className="display-xs font-semibold text-neutral-950">{book.name}</p>
                    <p className="text-xl text-neutral-700">{book.author}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="grid gap-4 rounded-3xl border border-neutral-200 bg-neutral-25 p-5 lg:h-fit">
          <h2 className="display-sm font-semibold text-neutral-950 lg:display-md">Complete Your Borrow Request</h2>

          <div className="grid gap-2">
            <p className="display-xs font-semibold text-neutral-950">Borrow Date</p>
            <div className="flex h-12 items-center justify-between rounded-2xl border border-neutral-300 bg-neutral-100 px-4">
              <span className="display-xs text-neutral-950">28 Aug 2024</span>
              <Calendar className="h-5 w-5 text-neutral-900" />
            </div>
          </div>

          <div className="grid gap-3">
            <p className="display-xs font-semibold text-neutral-950">Borrow Duration</p>
            <RadioGroup className="grid gap-2" defaultValue="3">
              {borrowDurationOptions.map((option) => (
                <label className="flex items-center gap-3" key={option.value}>
                  <RadioGroupItem
                    className="h-6 w-6 border-neutral-300 text-neutral-25 data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300 [&_[data-slot=radio-group-indicator]_svg]:fill-neutral-25"
                    value={option.value}
                  />
                  <span className="display-xs text-neutral-950">{option.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <section className="grid gap-0 rounded-2xl bg-neutral-200 p-4">
            <h3 className="display-xs font-semibold text-neutral-950">Return Date</h3>
            <p className="text-xl text-neutral-900">Please return the book no later than</p>
            <p className="display-sm font-semibold text-danger-300 lg:display-xs">31 August 2025</p>
          </section>

          <div className="grid gap-2">
            <label className="flex items-start gap-2">
              <Checkbox className="border-neutral-300 data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300" />
              <span className="display-xs text-neutral-950">I agree to return the book(s) before the due date.</span>
            </label>
            <label className="flex items-start gap-2">
              <Checkbox className="border-neutral-300 data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300" />
              <span className="display-xs text-neutral-950">I accept the library borrowing policy.</span>
            </label>
          </div>

          <Button className="h-12 rounded-full bg-primary-300 text-lg font-semibold text-neutral-25 hover:bg-primary-300/90">
            Confirm & Borrow
          </Button>
        </aside>
      </div>
    </main>
  );
}
