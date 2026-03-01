import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function PreviewPage() {
  return (
    <>
      <main className="grid gap-4 px-4 pb-24 pt-4 lg:gap-6 lg:px-30 lg:pb-20 lg:pt-8">
        <Link
          className="flex w-fit items-center gap-2 text-neutral-950"
          href="/list?role=admin"
        >
          <ArrowLeft className="size-6 md:size-7" />
          <span className="display-xs md:display-sm font-bold">Preview Book</span>
        </Link>

        <section className="grid gap-9 lg:grid-cols-[auto_1fr]">
          <div className="grid justify-center">
            <div className="bg-neutral-200 p-[5.29px] lg:p-2">
              <Image
                alt="The Psychology of Money"
                className="object-cover md:h-[482px] md:w-[321px]"
                height={318}
                priority
                src="/dummy-header-detail.png"
                width={212}
              />
            </div>
          </div>

          <div className="grid content-start gap-4">
            <div className="inline-flex w-fit items-center rounded-[6px] border border-neutral-300 px-2 py-0">
              <span className="text-sm md:text-md font-bold text-neutral-950">
                Business & Economics
              </span>
            </div>

            <div className="grid gap-1">
              <h1 className="display-xs lg:display-sm font-bold text-neutral-950">
                The Psychology of Money
              </h1>
              <p className="text-sm md:text-md text-neutral-700">Morgan Housel</p>
              <div className="flex items-center gap-1">
                <Image
                  alt=""
                  aria-hidden="true"
                  height={24}
                  src="/icon-star.svg"
                  width={24}
                />
                <span className="text-md font-bold text-neutral-950">
                  4.9
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:w-96.5">
              <div className="grid gap-0">
                <p className="text-lg md:display-xs font-bold text-neutral-950">
                  320
                </p>
                <p className="text-sm md:text-md font-medium text-neutral-900">
                  Page
                </p>
              </div>
              <div className="grid gap-0 border-l border-neutral-300 pl-3">
                <p className="text-lg md:display-xs font-bold text-neutral-950">
                  212
                </p>
                <p className="text-sm md:text-md font-medium text-neutral-900">
                  Rating
                </p>
              </div>
              <div className="grid gap-0 border-l border-neutral-300 pl-3">
                <p className="text-lg md:display-xs font-bold text-neutral-950">
                  179
                </p>
                <p className="text-sm md:text-md font-medium text-neutral-900">
                  Reviews
                </p>
              </div>
            </div>

            <section className="grid gap-2 border-t border-neutral-200 pt-4">
              <h2 className="text-xl font-bold text-neutral-950">
                Description
              </h2>
              <p className="text-sm md:text-md font-medium text-neutral-900">
                The Psychology of Money explores how emotions, biases, and human
                behavior shape the way we think about money, investing, and
                financial decisions. Morgan Housel shares timeless lessons on
                wealth, greed, and happiness, showing that financial success is
                not about knowledge, but about behavior.
              </p>
            </section>
            <div className="hidden w-fit gap-3 md:flex">
              <Button
                className="h-11 w-50 rounded-full border border-neutral-300 bg-neutral-25 p-2 text-md font-bold text-neutral-950 shadow-none hover:bg-neutral-100"
                variant="outline"
              >
                Add to Cart
              </Button>
              <Button className="h-11 w-50 rounded-full bg-primary-300 p-2 text-md font-bold text-neutral-25 hover:bg-primary-300/90">
                Borrow Book
              </Button>
            </div>
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
