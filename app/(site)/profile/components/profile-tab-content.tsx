import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function ProfileTabContent() {
  return (
    <section className="grid gap-4 w-full md:w-139.25 ">
      <h1 className="display-xs md:display-sm font-extrabold text-neutral-950">
        Profile
      </h1>
      <article
        className="shadow-card grid gap-4 rounded-3xl  p-4 lg:p-5"
        id="card-profile"
      >
        <Avatar className="size-16">
          <AvatarImage alt="John Doe" src="/dummy-avatar.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>

        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm md:text-md text-neutral-950 ">Name</span>
            <span className="text-sm md:text-md font-bold text-neutral-950 ">
              Johndoe
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm md:text-md text-neutral-950 ">Email</span>
            <span className="text-sm md:text-md font-bold text-neutral-950 ">
              johndoe@email.com
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm md:text-md text-neutral-950 ">
              Nomor Handphone
            </span>
            <span className="text-sm md:text-md font-bold text-neutral-950 ">
              081234567890
            </span>
          </div>
        </div>

        <Button className="h-11 rounded-full bg-primary-300 text-display-xs font-bold text-neutral-25 hover:bg-primary-300/90 text-md">
          Update Profile
        </Button>
      </article>
    </section>
  );
}
