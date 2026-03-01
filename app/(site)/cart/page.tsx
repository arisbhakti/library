"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type CartItem = {
  id: number;
  category: string;
  name: string;
  author: string;
  image: string;
  checked: boolean;
};

const initialCartItems: CartItem[] = [
  {
    id: 1,
    category: "Category",
    name: "Book Name",
    author: "Author name",
    image: "/dummy-recommendation.png",
    checked: true,
  },
  {
    id: 2,
    category: "Category",
    name: "Book Name",
    author: "Author name",
    image: "/dummy-recommendation.png",
    checked: true,
  },
  {
    id: 3,
    category: "Category",
    name: "Book Name",
    author: "Author name",
    image: "/dummy-recommendation.png",
    checked: false,
  },
  {
    id: 4,
    category: "Category",
    name: "Book Name",
    author: "Author name",
    image: "/dummy-recommendation.png",
    checked: false,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const selectedCount = useMemo(
    () => cartItems.filter((item) => item.checked).length,
    [cartItems],
  );
  const isAllSelected = selectedCount === cartItems.length;

  const handleSelectAll = (checked: boolean) => {
    setCartItems((prev) => prev.map((item) => ({ ...item, checked })));
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked } : item)),
    );
  };

  return (
    <>
      <main className="grid gap-6 px-4 pb-24 pt-4 lg:gap-8 lg:px-[120px] lg:pb-10 lg:pt-8">
        <h1 className="display-xs md:display-lg font-bold text-neutral-950">
          My Cart
        </h1>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:gap-10">
          <section className="grid gap-0">
            <label className="flex items-center gap-3 py-2">
              <Checkbox
                checked={isAllSelected}
                className="border-neutral-300 data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300"
                onCheckedChange={(checked) => handleSelectAll(checked === true)}
              />
              <span className="text-md font-semibold text-neutral-950">
                Select All
              </span>
            </label>

            <div className="grid gap-0">
              {cartItems.map((item) => (
                <article
                  className="grid gap-0 border-b border-neutral-200 py-4 last:border-b-0"
                  key={item.id}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={item.checked}
                      className="border-neutral-300 data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300"
                      onCheckedChange={(checked) =>
                        handleSelectItem(item.id, checked === true)
                      }
                    />

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

          <aside className="hidden lg:block w-79.5">
            <div className="grid gap-6 rounded-3xl border border-neutral-200 bg-neutral-25 p-5">
              <h2 className="text-xl font-bold text-neutral-950">
                Loan Summary
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-md font-medium text-neutral-900">
                  Total Book
                </span>
                <span className="text-md font-bold text-neutral-950">
                  {selectedCount} Items
                </span>
              </div>
              <Button className="h-12 rounded-full bg-primary-300 text-md font-bold text-neutral-25 hover:bg-primary-300/90">
                Borrow Book
              </Button>
            </div>
          </aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-neutral-200 bg-neutral-25 px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="grid gap-0">
            <span className="text-xl text-neutral-900">Total Book</span>
            <span className="display-xs font-semibold text-neutral-950">
              {selectedCount} Items
            </span>
          </div>
          <Button className="h-10 min-w-36 rounded-full bg-primary-300 px-6 text-md font-semibold text-neutral-25 hover:bg-primary-300/90">
            Borrow Book
          </Button>
        </div>
      </div>
    </>
  );
}
