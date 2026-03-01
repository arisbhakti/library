"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BorrowedListTabContent } from "@/app/(site)/profile/components/borrowed-list-tab-content";
import { ProfileTabContent } from "@/app/(site)/profile/components/profile-tab-content";
import { ReviewsTabContent } from "@/app/(site)/profile/components/reviews-tab-content";

export default function ProfilePage() {
  return (
    <main className="grid gap-6 px-4 py-4 lg:gap-8 lg:px-[220px] lg:py-8">
      <section className="grid w-full gap-6 ">
        <Tabs className="w-full" defaultValue="profile">
          <TabsList className="h-14! w-full md:w-139.25! rounded-3xl bg-neutral-100 p-2   ">
            <TabsTrigger
              className="h-10! rounded-2xl text-sm font-bold leading-none text-neutral-600 data-[state=active]:bg-neutral-25 data-[state=active]:text-neutral-950 data-[state=active]:shadow-none lg:h-14 lg:text-md"
              value="profile"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              className="h-10! rounded-2xl text-sm font-bold leading-none text-neutral-600 data-[state=active]:bg-neutral-25 data-[state=active]:text-neutral-950 data-[state=active]:shadow-none lg:h-14 lg:text-md"
              value="borrowed-list"
            >
              Borrowed List
            </TabsTrigger>
            <TabsTrigger
              className="h-10! rounded-2xl text-sm font-bold leading-none text-neutral-600 data-[state=active]:bg-neutral-25 data-[state=active]:text-neutral-950 data-[state=active]:shadow-none lg:h-14 lg:text-md"
              value="reviews"
            >
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent className="grid gap-4" value="profile">
            <ProfileTabContent />
          </TabsContent>

          <TabsContent className="grid gap-4" value="borrowed-list">
            <BorrowedListTabContent />
          </TabsContent>

          <TabsContent className="grid gap-4" value="reviews">
            <ReviewsTabContent />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
