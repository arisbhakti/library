import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Booky",
    short_name: "Booky",
    description:
      "Booky adalah platform perpustakaan digital untuk menemukan buku, meminjam, dan mengelola koleksi dengan cepat.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F8FF",
    theme_color: "#1C65DA",
    lang: "id-ID",
    icons: [
      {
        src: "/booky-app-icon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
    ],
  };
}
