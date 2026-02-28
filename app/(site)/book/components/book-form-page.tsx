"use client";

import { ArrowLeft, ChevronDown, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type BookFormMode = "add" | "edit";

type CoverState = {
  url: string;
  isObjectUrl: boolean;
};

type BookFormPageProps = {
  mode: BookFormMode;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const categoryOptions = [
  "Business & Economics",
  "Fiction",
  "Non-Fiction",
  "Self-Improvement",
  "Science",
  "Education",
];

export function BookFormPage({ mode }: BookFormPageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState(
    mode === "edit" ? "The Psychology of Money" : "",
  );
  const [author, setAuthor] = useState(mode === "edit" ? "Morgan Housel" : "");
  const [category, setCategory] = useState(
    mode === "edit" ? "Business & Economics" : "",
  );
  const [numberOfPages, setNumberOfPages] = useState(mode === "edit" ? "320" : "");
  const [description, setDescription] = useState(
    mode === "edit"
      ? "The Psychology of Money explores how emotions, biases, and human behavior shape the way we think about money, investing, and financial decisions. Morgan Housel shares timeless lessons on wealth, greed, and happiness, showing that financial success is not about knowledge, but about behavior."
      : "",
  );
  const [cover, setCover] = useState<CoverState | null>(
    mode === "edit"
      ? { url: "/dummy-header-detail.png", isObjectUrl: false }
      : null,
  );
  const [coverError, setCoverError] = useState("");

  useEffect(() => {
    return () => {
      if (cover?.isObjectUrl) {
        URL.revokeObjectURL(cover.url);
      }
    };
  }, [cover]);

  const setCoverFromFile = (file: File) => {
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setCoverError("Please upload PNG or JPG image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setCoverError("File size must be less than or equal to 5mb.");
      return;
    }

    if (cover?.isObjectUrl) {
      URL.revokeObjectURL(cover.url);
    }

    const objectUrl = URL.createObjectURL(file);
    setCover({ url: objectUrl, isObjectUrl: true });
    setCoverError("");
  };

  const handleInputFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setCoverFromFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    setCoverFromFile(file);
  };

  const handleDeleteCover = () => {
    if (cover?.isObjectUrl) {
      URL.revokeObjectURL(cover.url);
    }

    setCover(null);
    setCoverError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <main className="grid gap-6 px-4 py-4 lg:gap-8 lg:px-[120px] lg:py-8">
      <section className="grid w-full justify-items-center">
        <form
          className="grid w-full gap-3 lg:w-[640px]"
          onSubmit={(event) => event.preventDefault()}
        >
          <Link
            className="flex w-fit items-center gap-2 text-neutral-950"
            href="/list?tab=book-list"
          >
            <ArrowLeft className="h-7 w-7" />
            <span className="display-xs font-semibold">
              {mode === "edit" ? "Edit Book" : "Add Book"}
            </span>
          </Link>

          <label className="grid gap-1">
            <span className="text-md font-semibold text-neutral-950">Title</span>
            <Input
              className="h-14 rounded-2xl border-neutral-300 bg-neutral-25 px-4 text-md text-neutral-950 shadow-none focus-visible:ring-0"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-md font-semibold text-neutral-950">Author</span>
            <Input
              className="h-14 rounded-2xl border-neutral-300 bg-neutral-25 px-4 text-md text-neutral-950 shadow-none focus-visible:ring-0"
              onChange={(event) => setAuthor(event.target.value)}
              value={author}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-md font-semibold text-neutral-950">Category</span>
            <div className="relative">
              <select
                className="h-14 w-full appearance-none rounded-2xl border border-neutral-300 bg-neutral-25 px-4 text-md text-neutral-950 outline-none"
                onChange={(event) => setCategory(event.target.value)}
                value={category}
              >
                <option value="">Select Category</option>
                {categoryOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-950" />
            </div>
          </label>

          <label className="grid gap-1">
            <span className="text-md font-semibold text-neutral-950">Number of Pages</span>
            <Input
              className="h-14 rounded-2xl border-neutral-300 bg-neutral-25 px-4 text-md text-neutral-950 shadow-none focus-visible:ring-0"
              min={1}
              onChange={(event) => setNumberOfPages(event.target.value)}
              type="number"
              value={numberOfPages}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-md font-semibold text-neutral-950">Description</span>
            <textarea
              className="h-[164px] w-full rounded-2xl border border-neutral-300 bg-neutral-25 px-4 py-3 text-md text-neutral-950 outline-none"
              onChange={(event) => setDescription(event.target.value)}
              value={description}
            />
          </label>

          <div className="grid gap-1">
            <span className="text-md font-semibold text-neutral-950">Cover Image</span>

            <label
              className={`grid min-h-[208px] w-full cursor-pointer justify-items-center gap-3 rounded-2xl border border-dashed bg-neutral-25 p-4 ${
                coverError ? "border-danger-300" : "border-neutral-300"
              }`}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
            >
              <input
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleInputFileChange}
                ref={fileInputRef}
                type="file"
              />

              {cover ? (
                <>
                  <div className="relative h-[120px] w-[80px] overflow-hidden rounded-sm bg-neutral-100">
                    <Image
                      alt="Book cover preview"
                      className="object-cover"
                      fill
                      sizes="80px"
                      src={cover.url}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button
                      className="h-10 rounded-xl border border-neutral-300 bg-neutral-25 px-4 text-md font-semibold text-neutral-950 shadow-none hover:bg-neutral-100"
                      onClick={(event) => {
                        event.preventDefault();
                        fileInputRef.current?.click();
                      }}
                      type="button"
                      variant="outline"
                    >
                      <Upload className="h-4 w-4" />
                      Change Image
                    </Button>
                    <Button
                      className="h-10 rounded-xl border border-neutral-300 bg-neutral-25 px-4 text-md font-semibold text-danger-300 shadow-none hover:bg-danger-300/10"
                      onClick={(event) => {
                        event.preventDefault();
                        handleDeleteCover();
                      }}
                      type="button"
                      variant="outline"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Image
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-300">
                    <Upload className="h-5 w-5 text-neutral-950" />
                  </span>
                  <p className="text-center text-md text-neutral-950">
                    <span className="font-semibold text-primary-300">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                </>
              )}

              <p className="text-md text-neutral-950">PNG or JPG (max. 5mb)</p>
            </label>

            {coverError ? (
              <p className="text-md text-danger-300">{coverError}</p>
            ) : null}
          </div>

          <Button className="h-12 rounded-full bg-primary-300 text-display-xs font-semibold text-neutral-25 hover:bg-primary-300/90">
            Save
          </Button>
        </form>
      </section>
    </main>
  );
}
