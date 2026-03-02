"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ChangeEvent, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  clearAuthSession,
  getAuthRole,
  getAuthToken,
  getAuthUser,
  type UserRole,
} from "@/lib/auth";

type HeaderProps = {
  isLoggedIn?: boolean;
};

type AuthViewState = {
  isLoggedIn: boolean;
  role: UserRole | null;
  displayName: string;
  profilePhoto: string;
  fallbackName: string;
};

const DEFAULT_AVATAR = "/dummy-avatar.png";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function resolveProfilePhoto(profilePhoto: string | null | undefined): string {
  if (!profilePhoto) {
    return DEFAULT_AVATAR;
  }

  const normalized = profilePhoto.trim();
  if (!normalized) {
    return DEFAULT_AVATAR;
  }

  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("data:image/") ||
    normalized.startsWith("/")
  ) {
    return normalized;
  }

  if (/^[A-Za-z0-9+/=]+$/.test(normalized)) {
    return `data:image/png;base64,${normalized}`;
  }

  return normalized;
}

function getAuthViewState(isLoggedInProp: boolean): AuthViewState {
  const token = getAuthToken();
  const user = getAuthUser();
  const role = user?.role ?? getAuthRole();

  const nameFromRole = role === "ADMIN" ? "Admin" : "User";
  const displayName = user?.name?.trim() || nameFromRole;
  const fallbackName = getInitials(displayName);

  return {
    isLoggedIn: Boolean(token) || isLoggedInProp,
    role,
    displayName,
    profilePhoto: resolveProfilePhoto(user?.profilePhoto),
    fallbackName,
  };
}

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

function SearchField({
  compact = false,
  defaultValue,
  inputKey,
  onChange,
}: {
  compact?: boolean;
  defaultValue?: string;
  inputKey: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex h-11 w-full items-center gap-2 rounded-full border border-neutral-300 px-4">
      <Image
        alt=""
        aria-hidden="true"
        height={20}
        src="/icon-search.svg"
        width={20}
      />
      <Input
        className="h-full border-0 bg-transparent p-0 text-sm font-medium text-neutral-950 shadow-none placeholder:text-neutral-600 focus-visible:border-transparent focus-visible:ring-0"
        defaultValue={defaultValue}
        key={inputKey}
        onChange={onChange}
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
    </button>
  );
}

function UserMenuItems({
  mobile = false,
  role,
  onLogout,
}: {
  mobile?: boolean;
  role: UserRole | null;
  onLogout: () => void;
}) {
  const regularItemClass = mobile
    ? "h-14 cursor-pointer rounded-2xl px-4 text-display-xs font-medium text-neutral-950 focus:bg-neutral-100 focus:text-neutral-950"
    : "h-11 cursor-pointer rounded-xl px-3 text-md font-medium text-neutral-950 focus:bg-neutral-100 focus:text-neutral-950";

  const logoutItemClass = mobile
    ? "h-14 cursor-pointer rounded-2xl px-4 text-display-xs font-medium text-danger-300 focus:bg-danger-300/10 focus:text-danger-300"
    : "h-11 cursor-pointer rounded-xl px-3 text-md font-medium text-danger-300 focus:bg-danger-300/10 focus:text-danger-300";

  const isAdmin = role === "ADMIN";

  return (
    <div className="grid gap-1">
      {isAdmin ? (
        <>
          <DropdownMenuItem asChild className={regularItemClass}>
            <Link href="/list">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={regularItemClass}>
            <Link href="/list?tab=book-list">Book List</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={regularItemClass}>
            <Link href="/list?tab=user">User</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={regularItemClass}>
            <Link href="/list?tab=borrowed-list">Borrowed List</Link>
          </DropdownMenuItem>
        </>
      ) : (
        <>
          <DropdownMenuItem asChild className={regularItemClass}>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={regularItemClass}>
            <Link href="/profile?tab=borrowed-list">Borrowed List</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={regularItemClass}>
            <Link href="/profile?tab=reviews">Reviews</Link>
          </DropdownMenuItem>
        </>
      )}
      <DropdownMenuItem
        className={logoutItemClass}
        onSelect={(event) => {
          event.preventDefault();
          onLogout();
        }}
      >
        Logout
      </DropdownMenuItem>
    </div>
  );
}

export function Header({ isLoggedIn = false }: HeaderProps) {
  const [authView, setAuthView] = useState<AuthViewState>(() =>
    getAuthViewState(isLoggedIn),
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileGuestMenuOpen, setIsMobileGuestMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const syncAuth = () => setAuthView(getAuthViewState(isLoggedIn));
    syncAuth();

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, [isLoggedIn]);

  const startsWithSegment = (segment: string) =>
    pathname === segment || pathname.startsWith(`${segment}/`);

  const isAdmin = authView.role === "ADMIN";
  const isAdminLibraryPage =
    isAdmin &&
    (startsWithSegment("/list") ||
      startsWithSegment("/preview") ||
      startsWithSegment("/book"));

  const handleLogout = () => {
    clearAuthSession();
    setAuthView(getAuthViewState(false));
    setIsMobileGuestMenuOpen(false);
    setIsSearchOpen(false);
    router.push("/login");
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;

    const params = new URLSearchParams(
      pathname === "/category" ? searchParams.toString() : "",
    );

    if (nextValue) {
      params.set("q", nextValue);
    } else {
      params.delete("q");
    }

    params.delete("page");

    const query = params.toString();
    router.replace(query ? `/category?${query}` : "/category", {
      scroll: false,
    });
  };

  const categoryQuery = pathname === "/category" ? (searchParams.get("q") ?? "") : "";
  const searchFieldKey = `${pathname}-${categoryQuery}`;

  if (isAdminLibraryPage) {
    return (
      <header className="fixed top-0 z-50 w-full bg-white shadow-card">
        <div className="flex h-16 items-center justify-between px-4 lg:hidden">
          <MobileBrand />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Open profile menu"
                className="flex size-9 items-center justify-center"
                type="button"
              >
                <Avatar className="size-9">
                  <AvatarImage
                    alt={authView.displayName}
                    src={authView.profilePhoto}
                  />
                  <AvatarFallback>{authView.fallbackName}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[calc(100vw-32px)] rounded-4xl border-neutral-200 bg-neutral-25 p-4 shadow-none lg:hidden"
              sideOffset={12}
            >
              <UserMenuItems mobile onLogout={handleLogout} role={authView.role} />
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
                    <AvatarImage
                      alt={authView.displayName}
                      src={authView.profilePhoto}
                    />
                    <AvatarFallback>{authView.fallbackName}</AvatarFallback>
                  </Avatar>
                  <span className="text-md font-semibold text-neutral-950">
                    {authView.displayName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-neutral-800" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[220px] rounded-3xl border-neutral-200 bg-neutral-25 p-2 shadow-none"
                sideOffset={12}
              >
                <UserMenuItems onLogout={handleLogout} role={authView.role} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed z-50 w-full bg-white shadow-card">
      <div className="flex h-16 items-center px-4 lg:hidden">
        {isSearchOpen ? (
          <div className="flex w-full items-center gap-3">
            <MobileBrand />
            <SearchField
              compact
              defaultValue={categoryQuery}
              inputKey={searchFieldKey}
              onChange={handleSearchChange}
            />
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
              {authView.isLoggedIn && !isAdmin ? <CartButton /> : null}
              {authView.isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      aria-label="Open profile menu"
                      className="flex size-8 items-center justify-center"
                      type="button"
                    >
                      <Avatar className="size-8">
                        <AvatarImage
                          alt={authView.displayName}
                          src={authView.profilePhoto}
                        />
                        <AvatarFallback>{authView.fallbackName}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[calc(100vw-32px)] rounded-4xl border-neutral-200 bg-neutral-25 p-4 shadow-none lg:hidden"
                    sideOffset={20}
                  >
                    <UserMenuItems
                      mobile
                      onLogout={handleLogout}
                      role={authView.role}
                    />
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
                    className="-mt-2 w-[calc(100vw)] rounded-none border-none bg-neutral-25 p-4 shadow-none lg:hidden"
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

      <div className="hidden h-20 items-center px-[120px] lg:flex">
        <div className="flex w-full items-center justify-between gap-8">
          <DesktopBrand />
          {authView.isLoggedIn ? (
            <div className="w-[500px]">
              <SearchField
                defaultValue={categoryQuery}
                inputKey={searchFieldKey}
                onChange={handleSearchChange}
              />
            </div>
          ) : null}
          {authView.isLoggedIn ? (
            <div className="flex items-center gap-4">
              {!isAdmin ? <CartButton /> : null}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2" type="button">
                    <Avatar className="size-8">
                      <AvatarImage
                        alt={authView.displayName}
                        src={authView.profilePhoto}
                      />
                      <AvatarFallback>{authView.fallbackName}</AvatarFallback>
                    </Avatar>
                    <span className="text-md font-semibold text-neutral-950">
                      {authView.displayName}
                    </span>
                    <ChevronDown className="h-4 w-4 text-neutral-800" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[220px] rounded-3xl border-neutral-200 bg-neutral-25 p-2 shadow-none"
                  sideOffset={12}
                >
                  <UserMenuItems onLogout={handleLogout} role={authView.role} />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : null}
          {!authView.isLoggedIn ? (
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
