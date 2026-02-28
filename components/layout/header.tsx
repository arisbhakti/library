"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type HeaderProps = {
  isLoggedIn?: boolean;
};

function DesktopBrand() {
  return (
    <Link className="flex items-center gap-2" href="/">
      <Image alt="Booky logo" height={33} priority src="/booky-logo.svg" width={33} />
      <span className="display-xs font-semibold text-neutral-950">Booky</span>
    </Link>
  );
}

function MobileBrand() {
  return (
    <Link className="flex h-8 w-8 items-center justify-center" href="/">
      <Image alt="Booky logo" height={28} priority src="/booky-logo.svg" width={28} />
    </Link>
  );
}

function SearchField({ compact = false }: { compact?: boolean }) {
  return (
    <label className="flex h-11 w-full items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 px-4">
      <Image alt="" aria-hidden="true" height={20} src="/icon-search.svg" width={20} />
      <Input
        className="h-full border-0 bg-transparent p-0 text-sm text-neutral-950 shadow-none placeholder:text-neutral-500 focus-visible:border-transparent focus-visible:ring-0 lg:text-md"
        placeholder="Search book"
        type="text"
      />
      {compact ? null : <span className="sr-only">Search</span>}
    </label>
  );
}

function CartButton() {
  return (
    <button
      aria-label="Open cart"
      className="relative flex h-8 w-8 items-center justify-center"
      type="button"
    >
      <Image alt="" aria-hidden="true" height={24} src="/icon-shopping-bag.svg" width={24} />
      <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-danger-300 text-xs font-semibold text-neutral-25">
        1
      </span>
    </button>
  );
}

export function Header({ isLoggedIn = false }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const resolvedIsLoggedIn =
    searchParams.get("auth") === "1" || isLoggedIn || pathname.startsWith("/detail") || pathname.startsWith("/category");

  return (
    <header className="border-b border-neutral-200 bg-neutral-25">
      <div className="flex h-16 items-center px-4 lg:hidden">
        {isSearchOpen ? (
          <div className="flex w-full items-center gap-3">
            <MobileBrand />
            <SearchField compact />
            <button
              aria-label="Close search"
              className="flex h-8 w-8 items-center justify-center"
              onClick={() => setIsSearchOpen(false)}
              type="button"
            >
              <Image alt="" aria-hidden="true" height={24} src="/icon-close-search.svg" width={24} />
            </button>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between">
            <MobileBrand />
            <div className="flex items-center gap-3">
              <button
                aria-label="Open search"
                className="flex h-8 w-8 items-center justify-center"
                onClick={() => setIsSearchOpen(true)}
                type="button"
              >
                <Image alt="" aria-hidden="true" height={20} src="/icon-search.svg" width={20} />
              </button>
              <CartButton />
              {resolvedIsLoggedIn ? (
                <Avatar className="size-8">
                  <AvatarImage alt="John Doe" src="/dummy-avatar.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              ) : (
                <button aria-label="Open menu" className="flex h-8 w-8 items-center justify-center" type="button">
                  <Image
                    alt=""
                    aria-hidden="true"
                    height={24}
                    src="/icon-humberger-menu.svg"
                    width={24}
                  />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="hidden h-20 items-center px-[120px] lg:flex">
        <div className="flex w-full items-center justify-between gap-8">
          <DesktopBrand />
          {resolvedIsLoggedIn ? (
            <div className="flex items-center gap-8">
              <div className="w-[420px]">
                <SearchField />
              </div>
              <div className="flex items-center gap-4">
                <CartButton />
                <button className="flex items-center gap-2" type="button">
                  <Avatar className="size-8">
                    <AvatarImage alt="John Doe" src="/dummy-avatar.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span className="text-md font-semibold text-neutral-950">John Doe</span>
                  <ChevronDown className="h-4 w-4 text-neutral-800" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                asChild
                className="h-10 w-36 rounded-full border border-neutral-300 bg-neutral-25 text-md font-semibold text-neutral-950 shadow-none hover:bg-neutral-100"
                variant="outline"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="h-10 w-36 rounded-full bg-primary-300 text-md font-semibold text-neutral-25 hover:bg-primary-300/90"
              >
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
