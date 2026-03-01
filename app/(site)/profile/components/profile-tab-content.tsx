import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function ProfileTabContent() {
  return (
    <section className="grid gap-4">
      <h1 className="display-md font-semibold text-neutral-950">Profile</h1>
      <article className="grid gap-4 rounded-3xl border border-neutral-200 bg-neutral-25 p-4 lg:p-5">
        <Avatar className="size-32 lg:size-20">
          <AvatarImage alt="John Doe" src="/dummy-avatar.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>

        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-display-xs text-neutral-950 lg:text-xl">Name</span>
            <span className="text-display-xs font-semibold text-neutral-950 lg:text-xl">
              Johndoe
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-display-xs text-neutral-950 lg:text-xl">Email</span>
            <span className="text-display-xs font-semibold text-neutral-950 lg:text-xl">
              johndoe@email.com
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-display-xs text-neutral-950 lg:text-xl">
              Nomor Handphone
            </span>
            <span className="text-display-xs font-semibold text-neutral-950 lg:text-xl">
              081234567890
            </span>
          </div>
        </div>

        <Button className="h-14 rounded-full bg-primary-300 text-display-xs font-semibold text-neutral-25 hover:bg-primary-300/90 lg:h-12 lg:text-lg">
          Update Profile
        </Button>
      </article>
    </section>
  );
}
