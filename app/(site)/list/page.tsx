"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTabContent } from "@/app/(site)/list/components/user-tab-content";

type ListTab = "borrowed-list" | "user" | "book-list";

export default function ListPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<ListTab>("user");

  const role = searchParams.get("role") ?? "admin";
  const isAdmin = role === "admin";

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
          <TabsList className="h-14 w-full min-w-0 rounded-3xl bg-neutral-200 p-1 lg:h-[74px] lg:w-[560px] lg:rounded-3xl lg:p-2">
            <TabsTrigger
              className="h-full min-w-0 rounded-2xl px-2 text-md font-medium leading-none text-neutral-600 data-[state=active]:bg-neutral-25 data-[state=active]:text-neutral-950 data-[state=active]:shadow-none lg:text-xl"
              value="borrowed-list"
            >
              Borrowed List
            </TabsTrigger>
            <TabsTrigger
              className="h-full min-w-0 rounded-2xl px-2 text-md font-semibold leading-none text-neutral-600 data-[state=active]:bg-neutral-25 data-[state=active]:text-neutral-950 data-[state=active]:shadow-none lg:text-xl"
              value="user"
            >
              User
            </TabsTrigger>
            <TabsTrigger
              className="h-full min-w-0 rounded-2xl px-2 text-md font-medium leading-none text-neutral-600 data-[state=active]:bg-neutral-25 data-[state=active]:text-neutral-950 data-[state=active]:shadow-none lg:text-xl"
              value="book-list"
            >
              Book List
            </TabsTrigger>
          </TabsList>

          <TabsContent className="grid gap-4" value="borrowed-list">
            <h1 className="text-display-xs font-semibold text-neutral-950 lg:display-sm">
              Borrowed List
            </h1>
          </TabsContent>

          <TabsContent className="grid gap-4 lg:gap-6" value="user">
            <UserTabContent />
          </TabsContent>

          <TabsContent className="grid gap-4" value="book-list">
            <h1 className="text-display-xs font-semibold text-neutral-950 lg:display-sm">
              Book List
            </h1>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
