import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function PreviewPage() {
  return (
    <>
      <main className="grid gap-8 px-4 pb-24 pt-4 lg:gap-10 lg:px-[120px] lg:pb-10 lg:pt-8">
        <Link
          className="flex w-fit items-center gap-2 text-neutral-950"
          href="/list?role=admin"
        >
          <ArrowLeft className="h-7 w-7" />
          <span className="display-xs font-semibold">Preview Book</span>
        </Link>

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

              <div className="hidden items-center gap-3 pt-2 lg:flex">
                <Button
                  className="h-12 w-[220px] rounded-full border border-neutral-300 bg-neutral-25 text-display-xs font-semibold text-neutral-950 shadow-none hover:bg-neutral-100"
                  variant="outline"
                >
                  Add to Cart
                </Button>
                <Button className="h-12 w-[220px] rounded-full bg-primary-300 text-display-xs font-semibold text-neutral-25 hover:bg-primary-300/90">
                  Borrow Book
                </Button>
              </div>
            </section>
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
