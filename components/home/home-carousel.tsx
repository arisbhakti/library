"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  { id: 1, alt: "Booky carousel banner 1" },
  { id: 2, alt: "Booky carousel banner 2" },
  { id: 3, alt: "Booky carousel banner 3" },
];

export function HomeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(timerId);
  }, []);

  return (
    <section className="grid gap-3">
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div className="relative aspect-1200/441 min-w-full" key={slide.id}>
              <Image
                alt={slide.alt}
                className="object-cover"
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) calc(100vw - 240px), calc(100vw - 32px)"
                src="/dummy-carousel.png"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-1.5">
        {slides.map((slide, index) => (
          <button
            aria-label={`Go to slide ${slide.id}`}
            className={`h-2 w-2 rounded-full ${index === activeIndex ? "bg-primary-300" : "bg-neutral-300"}`}
            key={slide.id}
            onClick={() => setActiveIndex(index)}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}
