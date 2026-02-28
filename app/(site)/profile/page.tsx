"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfilePage() {
  return (
    <main className="grid gap-6 px-4 py-4 lg:gap-8 lg:px-[120px] lg:py-8">
      <section className="grid w-full gap-6 lg:max-w-[560px]">
        <Tabs className="w-full" defaultValue="profile">
          <TabsList className="h-28 w-full rounded-4xl bg-neutral-200 p-2 lg:h-14 lg:rounded-3xl">
            <TabsTrigger
              className="h-full rounded-2xl text-display-xs font-semibold text-neutral-600 data-[state=active]:bg-neutral-25 data-[state=active]:text-neutral-950 lg:text-display-xs"
              value="profile"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              className="h-full rounded-2xl text-display-xs font-semibold text-neutral-600 data-[state=active]:bg-neutral-25 data-[state=active]:text-neutral-950 lg:text-display-xs"
              value="borrowed-list"
            >
              Borrowed List
            </TabsTrigger>
            <TabsTrigger
              className="h-full rounded-2xl text-display-xs font-semibold text-neutral-600 data-[state=active]:bg-neutral-25 data-[state=active]:text-neutral-950 lg:text-display-xs"
              value="reviews"
            >
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent className="grid gap-4" value="profile">
            <h1 className="display-md font-semibold text-neutral-950">Profile</h1>
            <article className="grid gap-4 rounded-3xl border border-neutral-200 bg-neutral-25 p-4 lg:p-5">
              <Avatar className="size-32 lg:size-20">
                <AvatarImage alt="John Doe" src="/dummy-avatar.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>

              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-display-xs text-neutral-950 lg:text-xl">Name</span>
                  <span className="text-display-xs font-semibold text-neutral-950 lg:text-xl">Johndoe</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-display-xs text-neutral-950 lg:text-xl">Email</span>
                  <span className="text-display-xs font-semibold text-neutral-950 lg:text-xl">johndoe@email.com</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-display-xs text-neutral-950 lg:text-xl">Nomor Handphone</span>
                  <span className="text-display-xs font-semibold text-neutral-950 lg:text-xl">081234567890</span>
                </div>
              </div>

              <Button className="h-14 rounded-full bg-primary-300 text-display-xs font-semibold text-neutral-25 hover:bg-primary-300/90 lg:h-12 lg:text-lg">
                Update Profile
              </Button>
            </article>
          </TabsContent>

          <TabsContent className="grid gap-4" value="borrowed-list">
            <h1 className="display-md font-semibold text-neutral-950">Borrowed List</h1>
            <article className="grid gap-2 rounded-3xl border border-neutral-200 bg-neutral-25 p-5">
              <p className="text-xl text-neutral-700">No borrowed books yet.</p>
            </article>
          </TabsContent>

          <TabsContent className="grid gap-4" value="reviews">
            <h1 className="display-md font-semibold text-neutral-950">Reviews</h1>
            <article className="grid gap-2 rounded-3xl border border-neutral-200 bg-neutral-25 p-5">
              <p className="text-xl text-neutral-700">No reviews yet.</p>
            </article>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
