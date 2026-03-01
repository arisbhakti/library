"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type HeaderProps = {
  isLoggedIn?: boolean;
};

function DesktopBrand() {
  return (
    <Link className="flex items-center gap-2" href="/">
      <Image
        alt="Booky logo"
        height={42}
        priority
        src="/booky-logo.svg"
        width={42}
      />
      <span className="display-md font-extrabold text-neutral-950">Booky</span>
    </Link>
  );
}

function MobileBrand() {
  return (
    <Link className="flex h-8 w-8 items-center justify-center" href="/">
      <Image
        alt="Booky logo"
        height={40}
        priority
        src="/booky-logo.svg"
        width={40}
      />
    </Link>
  );
}

function SearchField({ compact = false }: { compact?: boolean }) {
  return (
    <label className="flex h-11 w-full items-center gap-2 rounded-full border border-neutral-300  px-4">
      <Image
        alt=""
        aria-hidden="true"
        height={20}
        src="/icon-search.svg"
        width={20}
      />
      <Input
        className="h-full border-0 bg-transparent p-0 text-sm text-neutral-950 shadow-none placeholder:text-neutral-600 focus-visible:border-transparent focus-visible:ring-0 font-medium"
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
      <Image
        alt=""
        aria-hidden="true"
        height={28}
        src="/icon-shopping-bag.svg"
        width={28}
      />
      <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-danger-300 text-xs font-semibold text-neutral-25">
        1
      </span>
    </button>
  );
}

function UserMenuItems({ mobile = false }: { mobile?: boolean }) {
  const regularItemClass = mobile
    ? "h-14 cursor-pointer rounded-2xl px-4 text-display-xs font-medium text-neutral-950 focus:bg-neutral-100 focus:text-neutral-950"
    : "h-11 cursor-pointer rounded-xl px-3 text-xl font-medium text-neutral-950 focus:bg-neutral-100 focus:text-neutral-950";

  const logoutItemClass = mobile
    ? "h-14 cursor-pointer rounded-2xl px-4 text-display-xs font-medium text-danger-300 focus:bg-danger-300/10 focus:text-danger-300"
    : "h-11 cursor-pointer rounded-xl px-3 text-xl font-medium text-danger-300 focus:bg-danger-300/10 focus:text-danger-300";

  return (
    <div className="grid gap-1">
      <DropdownMenuItem asChild className={regularItemClass}>
        <Link href="/profile">Profile</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className={regularItemClass}>
        <Link href="/profile?tab=borrowed-list">Borrowed List</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className={regularItemClass}>
        <Link href="/profile?tab=reviews">Reviews</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className={logoutItemClass}>
        <Link href="/login">Logout</Link>
      </DropdownMenuItem>
    </div>
  );
}

export function Header({ isLoggedIn = false }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileGuestMenuOpen, setIsMobileGuestMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAdminLibraryPage =
    pathname.startsWith("/list") ||
    pathname.startsWith("/preview") ||
    pathname.startsWith("/book");
  const resolvedIsLoggedIn =
    searchParams.get("auth") === "1" ||
    isLoggedIn ||
    pathname.startsWith("/detail") ||
    pathname.startsWith("/category") ||
    pathname.startsWith("/book-by-author") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/success") ||
    pathname.startsWith("/profile");

  if (isAdminLibraryPage) {
    return (
      <header className="border-b border-neutral-200 bg-neutral-25">
        <div className="flex h-16 md:h-20 items-center justify-between px-4 lg:hidden">
          <MobileBrand />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Open profile menu"
                className="flex size-9 items-center justify-center"
                type="button"
              >
                <Avatar className="size-9">
                  <AvatarImage alt="John Doe" src="/dummy-avatar.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[148px] rounded-2xl border-neutral-200 bg-neutral-25 p-2 shadow-none lg:hidden"
              sideOffset={12}
            >
              <DropdownMenuItem
                asChild
                className="h-11 cursor-pointer rounded-xl px-3 text-xl font-medium text-danger-300 focus:bg-danger-300/10 focus:text-danger-300"
              >
                <Link href="/login">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden h-20 items-center px-[120px] lg:flex">
          <div className="flex w-full items-center justify-between">
            <DesktopBrand />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2" type="button">
                  <Avatar className="size-8">
                    <AvatarImage alt="John Doe" src="/dummy-avatar.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span className="text-md font-semibold text-neutral-950">
                    John Doe
                  </span>
                  <ChevronDown className="h-4 w-4 text-neutral-800" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[160px] rounded-3xl border-neutral-200 bg-neutral-25 p-2 shadow-none"
                sideOffset={12}
              >
                <DropdownMenuItem
                  asChild
                  className="h-11 cursor-pointer rounded-xl px-3 text-xl font-medium text-danger-300 focus:bg-danger-300/10 focus:text-danger-300"
                >
                  <Link href="/login">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    );
  }

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
              <Image
                alt=""
                aria-hidden="true"
                height={24}
                src="/icon-close-search.svg"
                width={24}
              />
            </button>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between">
            <MobileBrand />
            <div className="flex items-center gap-3">
              <button
                aria-label="Open search"
                className="flex h-8 w-8 items-center justify-center"
                onClick={() => {
                  setIsMobileGuestMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                type="button"
              >
                <Image
                  alt=""
                  aria-hidden="true"
                  height={24}
                  src="/icon-search-black.svg"
                  width={24}
                />
              </button>
              <CartButton />
              {resolvedIsLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      aria-label="Open profile menu"
                      className="flex size-8 items-center justify-center"
                      type="button"
                    >
                      <Avatar className="size-8">
                        <AvatarImage alt="John Doe" src="/dummy-avatar.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[calc(100vw-32px)] rounded-4xl border-neutral-200 bg-neutral-25 p-4 shadow-none lg:hidden"
                    sideOffset={20}
                  >
                    <UserMenuItems mobile />
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu
                  onOpenChange={setIsMobileGuestMenuOpen}
                  open={isMobileGuestMenuOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      aria-label="Open menu"
                      className="flex h-8 w-8 items-center justify-center"
                      type="button"
                    >
                      <Image
                        alt=""
                        aria-hidden="true"
                        height={24}
                        src={
                          isMobileGuestMenuOpen
                            ? "/icon-close-search.svg"
                            : "/icon-humberger-menu.svg"
                        }
                        width={24}
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[calc(100vw)] bg-neutral-25 p-4 shadow-none lg:hidden -mt-2 border-none rounded-none"
                    sideOffset={20}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        asChild
                        className="h-10 rounded-full border border-neutral-300 bg-neutral-25 text-md font-semibold text-neutral-950 shadow-none hover:bg-neutral-100"
                        variant="outline"
                      >
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button
                        asChild
                        className="h-10 rounded-full bg-primary-300 text-md font-semibold text-neutral-25 hover:bg-primary-300/90"
                      >
                        <Link href="/register">Register</Link>
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        )}
      </div>

      {/* <div className="hidden h-20 items-center px-[120px] lg:flex">
        <div className="flex w-full items-center justify-between gap-8">
          <DesktopBrand />
          {resolvedIsLoggedIn ? (
            <div className="flex items-center gap-8 ">
              <div className="w-[500px]">
                <SearchField />
              </div>
              <div className="flex items-center gap-4">
                <CartButton />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2" type="button">
                      <Avatar className="size-8">
                        <AvatarImage alt="John Doe" src="/dummy-avatar.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <span className="text-md font-semibold text-neutral-950">
                        John Doe
                      </span>
                      <ChevronDown className="h-4 w-4 text-neutral-800" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[220px] rounded-3xl border-neutral-200 bg-neutral-25 p-2 shadow-none"
                    sideOffset={12}
                  >
                    <UserMenuItems />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                asChild
                className="h-12 w-40.75 rounded-full border border-neutral-300 bg-neutral-25 text-md font-bold text-neutral-950 shadow-none hover:bg-neutral-100"
                variant="outline"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="h-12 w-40.75 rounded-full bg-primary-300 text-md font-bold text-neutral-25 hover:bg-primary-300/90"
              >
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div> */}
      <div className="hidden h-20 items-center px-[120px] lg:flex">
        <div className="flex w-full items-center justify-between gap-8">
          <DesktopBrand />
          {resolvedIsLoggedIn ? (
            <div className="w-[500px]">
              <SearchField />
            </div>
          ) : null}
          {resolvedIsLoggedIn ? (
            <div className="flex items-center gap-4">
              <CartButton />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2" type="button">
                    <Avatar className="size-8">
                      <AvatarImage alt="John Doe" src="/dummy-avatar.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span className="text-md font-semibold text-neutral-950">
                      John Doe
                    </span>
                    <ChevronDown className="h-4 w-4 text-neutral-800" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[220px] rounded-3xl border-neutral-200 bg-neutral-25 p-2 shadow-none"
                  sideOffset={12}
                >
                  <UserMenuItems />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : null}
          {!resolvedIsLoggedIn ? (
            <div className="flex items-center gap-3">
              <Button
                asChild
                className="h-12 w-40.75 rounded-full border border-neutral-300 bg-neutral-25 text-md font-bold text-neutral-950 shadow-none hover:bg-neutral-100"
                variant="outline"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="h-12 w-40.75 rounded-full bg-primary-300 text-md font-bold text-neutral-25 hover:bg-primary-300/90"
              >
                <Link href="/register">Register</Link>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
