import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

const socialLinks = [
  { href: "#", icon: FaFacebookF, label: "Facebook" },
  { href: "#", icon: FaInstagram, label: "Instagram" },
  { href: "#", icon: FaLinkedinIn, label: "LinkedIn" },
  { href: "#", icon: SiTiktok, label: "TikTok" },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 ">
      <div className="grid gap-6 px-4 py-8 lg:px-[120px] lg:py-10">
        <div className="grid justify-items-center gap-4">
          <Link className="flex items-center gap-2" href="/">
            <Image
              alt="Booky logo"
              height={33}
              src="/booky-logo.svg"
              width={33}
            />
            <span className="display-xs font-semibold text-neutral-950">
              Booky
            </span>
          </Link>
          <p className="max-w-[680px] text-center text-sm text-neutral-700 lg:text-md">
            Discover inspiring stories & timeless knowledge, ready to borrow
            anytime. Explore online or visit our nearest library branch.
          </p>
          <div className="grid justify-items-center gap-2">
            <p className="text-md font-semibold text-neutral-950">
              Follow on Social Media
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-800 transition-colors hover:bg-neutral-100"
                  href={href}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
