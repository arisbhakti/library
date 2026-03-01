"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookListTabContent } from "@/app/(site)/list/components/book-list-tab-content";
import { BorrowedListTabContent } from "@/app/(site)/list/components/borrowed-list-tab-content";
import { UserTabContent } from "@/app/(site)/list/components/user-tab-content";

type ListTab = "borrowed-list" | "user" | "book-list";

export default function ListPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const resolvedTab: ListTab =
    tabParam === "borrowed-list" ||
    tabParam === "book-list" ||
    tabParam === "user"
      ? tabParam
      : "user";
  const [activeTab, setActiveTab] = useState<ListTab>(resolvedTab);

  const role = searchParams.get("role") ?? "admin";
  const isAdmin = role === "admin";

  useEffect(() => {
    setActiveTab(resolvedTab);
  }, [resolvedTab]);

  if (!isAdmin) {
    return (
      <main className="grid gap-6 overflow-x-hidden px-4 py-4 lg:gap-8 lg:px-[120px] lg:py-8">
        <section className="grid w-full gap-3">
          <h1 className="text-display-xs font-semibold text-neutral-950 lg:display-sm">
            Access Restricted
          </h1>
          <p className="text-md text-neutral-700">
            This page is only accessible for admin role.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="grid gap-6 overflow-x-hidden px-4 py-4 lg:gap-8 lg:px-[120px] lg:py-8">
      <section className="grid w-full min-w-0 gap-6">
        <Tabs
          className="w-full min-w-0"
          onValueChange={(value) => setActiveTab(value as ListTab)}
          value={activeTab}
        >
          <TabsList className="h-14! w-full md:w-139.25! rounded-3xl bg-neutral-100 p-2 ">
            <TabsTrigger
              className="h-10! rounded-2xl text-sm font-bold leading-none text-neutral-600 data-[state=active]:bg-neutral-25 data-[state=active]:text-neutral-950 data-[state=active]:shadow-none lg:h-14 lg:text-md"
              value="borrowed-list"
            >
              Borrowed List
            </TabsTrigger>
            <TabsTrigger
              className="h-10! rounded-2xl text-sm font-bold leading-none text-neutral-600 data-[state=active]:bg-neutral-25 data-[state=active]:text-neutral-950 data-[state=active]:shadow-none lg:h-14 lg:text-md"
              value="user"
            >
              User
            </TabsTrigger>
            <TabsTrigger
              className="h-10! rounded-2xl text-sm font-bold leading-none text-neutral-600 data-[state=active]:bg-neutral-25 data-[state=active]:text-neutral-950 data-[state=active]:shadow-none lg:h-14 lg:text-md"
              value="book-list"
            >
              Book List
            </TabsTrigger>
          </TabsList>

          <TabsContent className="grid gap-4" value="borrowed-list">
            <BorrowedListTabContent />
          </TabsContent>

          <TabsContent className="grid gap-4 lg:gap-6" value="user">
            <UserTabContent />
          </TabsContent>

          <TabsContent className="grid gap-4" value="book-list">
            <BookListTabContent />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
