"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ChevronDown, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { useAppToast } from "@/components/ui/app-toast";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAuthToken } from "@/lib/auth";
import {
  createBook,
  tanstackQueryKeys,
  type Author,
  useAuthorsQuery,
  useCategoriesQuery,
} from "@/lib/tanstack-api";

type BookFormMode = "add" | "edit";

type CoverState = {
  url: string;
  isObjectUrl: boolean;
};

type BookFormPageProps = {
  mode: BookFormMode;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const numberRegex = /^\d*$/;

export function BookFormPage({ mode }: BookFormPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { showErrorToast, showSuccessToast } = useAppToast();
  const token = getAuthToken();
  const hasToken = Boolean(token);

  const [title, setTitle] = useState(
    mode === "edit" ? "The Psychology of Money" : "",
  );
  const [authorInput, setAuthorInput] = useState(
    mode === "edit" ? "Morgan Housel" : "",
  );
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [numberOfPages, setNumberOfPages] = useState(mode === "edit" ? "320" : "");
  const [numberOfPagesError, setNumberOfPagesError] = useState("");
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
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverError, setCoverError] = useState("");

  const normalizedAuthorKeyword = authorInput.trim();

  const {
    data: categoriesData,
    error: categoriesError,
    isError: isCategoriesError,
    isLoading: isCategoriesLoading,
  } = useCategoriesQuery();

  const {
    data: authorsData,
    error: authorsError,
    isError: isAuthorsError,
    isFetching: isAuthorsFetching,
  } = useAuthorsQuery(normalizedAuthorKeyword, normalizedAuthorKeyword.length > 0);

  const categoryOptions = categoriesData?.categories ?? [];
  const authorOptions = useMemo(() => authorsData?.authors ?? [], [authorsData]);

  useEffect(() => {
    return () => {
      if (cover?.isObjectUrl) {
        URL.revokeObjectURL(cover.url);
      }
    };
  }, [cover]);

  const createBookMutation = useMutation({
    mutationFn: createBook,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: tanstackQueryKeys.adminBooks.all });
      showSuccessToast(response.message || "Book berhasil ditambahkan.");
      router.push("/list?tab=book-list");
    },
    onError: (mutationError) => {
      showErrorToast(mutationError.message || "Gagal menambahkan book.");
    },
  });

  const setCoverFromFile = (file: File) => {
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setCoverError("Please upload PNG or JPG image.");
      setCoverFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setCoverError("File size must be less than or equal to 5mb.");
      setCoverFile(null);
      return;
    }

    if (cover?.isObjectUrl) {
      URL.revokeObjectURL(cover.url);
    }

    const objectUrl = URL.createObjectURL(file);
    setCover({ url: objectUrl, isObjectUrl: true });
    setCoverFile(file);
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
    setCoverFile(null);
    setCoverError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAuthorInputChange = (nextValue: string) => {
    setAuthorInput(nextValue);

    if (selectedAuthor && selectedAuthor.name !== nextValue) {
      setSelectedAuthor(null);
    }
  };

  const handleAuthorValueChange = (value: string | null) => {
    if (!value) {
      setSelectedAuthor(null);
      return;
    }

    const matchedAuthor = authorOptions.find((author) => author.name === value) ?? null;
    setSelectedAuthor(matchedAuthor);
    setAuthorInput(value);
  };

  const handleNumberOfPagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    if (numberRegex.test(nextValue)) {
      setNumberOfPages(nextValue);
      setNumberOfPagesError("");
      return;
    }

    setNumberOfPagesError("Number of Pages hanya boleh berisi angka.");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasToken || !token) {
      showErrorToast("Sesi login tidak ditemukan. Silakan login ulang.");
      return;
    }

    if (mode !== "add") {
      return;
    }

    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();
    const normalizedAuthorName = authorInput.trim();
    const normalizedCategoryId = Number(categoryId);

    if (!normalizedTitle) {
      showErrorToast("Title wajib diisi.");
      return;
    }

    if (!normalizedAuthorName) {
      showErrorToast("Author wajib diisi.");
      return;
    }

    if (!Number.isInteger(normalizedCategoryId) || normalizedCategoryId <= 0) {
      showErrorToast("Category wajib dipilih.");
      return;
    }

    if (!numberOfPages) {
      setNumberOfPagesError("Number of Pages wajib diisi.");
      return;
    }

    if (!normalizedDescription) {
      showErrorToast("Description wajib diisi.");
      return;
    }

    if (!coverFile) {
      setCoverError("Cover image wajib diisi.");
      return;
    }

    createBookMutation.mutate({
      token,
      title: normalizedTitle,
      description: normalizedDescription,
      categoryId: normalizedCategoryId,
      coverImage: coverFile,
      authorId: selectedAuthor?.id,
      authorName: selectedAuthor ? undefined : normalizedAuthorName,
    });
  };

  return (
    <main className="grid gap-6 px-4 py-4 lg:gap-8 lg:px-[120px] lg:py-8">
      <section className="grid w-full justify-items-center">
        <form className="grid w-full gap-3 lg:w-[640px]" onSubmit={handleSubmit}>
          <Link
            className="flex w-fit items-center gap-2 text-neutral-950"
            href="/list?tab=book-list"
          >
            <ArrowLeft className="h-7 w-7" />
            <span className="display-xs font-semibold">
              {mode === "edit" ? "Edit Book" : "Add Book"}
            </span>
          </Link>

          {!hasToken ? (
            <div className="rounded-2xl border border-danger-300 bg-danger-300/10 px-4 py-3 text-sm text-danger-300">
              Sesi login tidak ditemukan. Silakan login ulang sebelum menambahkan book.
            </div>
          ) : null}

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
            <Combobox
              inputValue={authorInput}
              onInputValueChange={handleAuthorInputChange}
              onValueChange={handleAuthorValueChange}
              value={selectedAuthor?.name ?? null}
            >
              <ComboboxInput
                className="w-full rounded-2xl border-neutral-300 bg-neutral-25 [&_[data-slot=input-group-control]]:h-14 [&_[data-slot=input-group-control]]:px-4 [&_[data-slot=input-group-control]]:text-md [&_[data-slot=input-group-control]]:text-neutral-950"
                placeholder="Type author name"
                showClear
              />
              <ComboboxContent>
                <ComboboxList>
                  {authorOptions.map((author) => (
                    <ComboboxItem key={author.id} value={author.name}>
                      {author.name}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
                <ComboboxEmpty>
                  {normalizedAuthorKeyword.length === 0
                    ? "Type author name."
                    : isAuthorsFetching
                      ? "Searching author..."
                      : "Author tidak ditemukan. Kamu tetap bisa pakai nama yang diketik."}
                </ComboboxEmpty>
              </ComboboxContent>
            </Combobox>
            {selectedAuthor ? (
              <p className="text-xs text-neutral-700">
                Author terpilih: {selectedAuthor.name} (ID: {selectedAuthor.id})
              </p>
            ) : null}
            {isAuthorsError ? (
              <p className="text-xs text-danger-300">
                {(authorsError as Error)?.message || "Gagal memuat author."}
              </p>
            ) : null}
          </label>

          <label className="grid gap-1">
            <span className="text-md font-semibold text-neutral-950">Category</span>
            <div className="relative">
              <select
                className="h-14 w-full appearance-none rounded-2xl border border-neutral-300 bg-neutral-25 px-4 text-md text-neutral-950 outline-none"
                onChange={(event) => setCategoryId(event.target.value)}
                value={categoryId}
              >
                <option value="">
                  {isCategoriesLoading ? "Loading categories..." : "Select Category"}
                </option>
                {categoryOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-950" />
            </div>
            {isCategoriesError ? (
              <p className="text-xs text-danger-300">
                {(categoriesError as Error)?.message || "Gagal memuat category."}
              </p>
            ) : null}
          </label>

          <label className="grid gap-1">
            <span className="text-md font-semibold text-neutral-950">Number of Pages</span>
            <Input
              className="h-14 rounded-2xl border-neutral-300 bg-neutral-25 px-4 text-md text-neutral-950 shadow-none focus-visible:ring-0"
              inputMode="numeric"
              onChange={handleNumberOfPagesChange}
              pattern="[0-9]*"
              type="text"
              value={numberOfPages}
            />
            {numberOfPagesError ? (
              <p className="text-xs text-danger-300">{numberOfPagesError}</p>
            ) : null}
          </label>

          <label className="grid gap-1">
            <span className="text-md font-semibold text-neutral-950">Description</span>
            <Textarea
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

            {coverError ? <p className="text-md text-danger-300">{coverError}</p> : null}
          </div>

          <Button
            className="h-12 rounded-full bg-primary-300 text-display-xs font-semibold text-neutral-25 hover:bg-primary-300/90 disabled:opacity-60"
            disabled={createBookMutation.isPending || !hasToken}
          >
            {createBookMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </form>
      </section>
    </main>
  );
}
