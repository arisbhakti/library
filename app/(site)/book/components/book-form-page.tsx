"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ChevronDown, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getAuthToken } from "@/lib/auth";
import {
  createBook,
  tanstackQueryKeys,
  type Author,
  type BookDetail,
  updateBook,
  useAuthorsQuery,
  useBookDetailQuery,
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

type EditInitialFormData = {
  title: string;
  authorInput: string;
  selectedAuthor: Author | null;
  categoryId: string;
  description: string;
  isbn: string;
  publishedYear: string;
  totalCopies: string;
  availableCopies: string;
  coverUrl: string;
};

type BookFormContentProps = {
  mode: BookFormMode;
  bookId: number | null;
  initialEditData: EditInitialFormData | null;
};

const DEFAULT_BOOK_COVER = "/default-book-cover.svg";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const numberRegex = /^\d*$/;

function toInitialEditFormData(bookDetail: BookDetail): EditInitialFormData {
  return {
    title: bookDetail.title ?? "",
    authorInput: bookDetail.author?.name ?? "",
    selectedAuthor: bookDetail.author ? { ...bookDetail.author } : null,
    categoryId: String(bookDetail.categoryId),
    description: bookDetail.description ?? "",
    isbn: bookDetail.isbn ?? "",
    publishedYear: String(bookDetail.publishedYear ?? ""),
    totalCopies: String(bookDetail.totalCopies ?? ""),
    availableCopies: String(bookDetail.availableCopies ?? ""),
    coverUrl: bookDetail.coverImage?.trim() || DEFAULT_BOOK_COVER,
  };
}

function BookFormSkeleton() {
  return (
    <main className="grid gap-6 px-4 py-4 lg:gap-8 lg:px-[120px] lg:py-8">
      <section className="grid w-full justify-items-center">
        <div className="grid w-full gap-3 lg:w-[640px]">
          <div className="flex w-fit items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-7 w-32 rounded-md" />
          </div>

          {Array.from({ length: 8 }, (_, index) => (
            <div className="grid gap-2" key={`book-form-skeleton-${index}`}>
              <Skeleton className="h-5 w-28 rounded-md" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
          ))}

          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </section>
    </main>
  );
}

function BookFormContent({
  mode,
  bookId,
  initialEditData,
}: BookFormContentProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { showErrorToast, showSuccessToast } = useAppToast();
  const token = getAuthToken();
  const hasToken = Boolean(token);

  const [title, setTitle] = useState(() => initialEditData?.title ?? "");
  const [authorInput, setAuthorInput] = useState(
    () => initialEditData?.authorInput ?? "",
  );
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(
    () => initialEditData?.selectedAuthor ?? null,
  );
  const [categoryId, setCategoryId] = useState(
    () => initialEditData?.categoryId ?? "",
  );
  const [numberOfPages, setNumberOfPages] = useState("");
  const [numberOfPagesError, setNumberOfPagesError] = useState("");
  const [description, setDescription] = useState(
    () => initialEditData?.description ?? "",
  );
  const [cover, setCover] = useState<CoverState | null>(() =>
    mode === "edit"
      ? {
          url: initialEditData?.coverUrl ?? DEFAULT_BOOK_COVER,
          isObjectUrl: false,
        }
      : null,
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverError, setCoverError] = useState("");

  const [isbn, setIsbn] = useState(() => initialEditData?.isbn ?? "");
  const [publishedYear, setPublishedYear] = useState(
    () => initialEditData?.publishedYear ?? "",
  );
  const [publishedYearError, setPublishedYearError] = useState("");
  const [totalCopies, setTotalCopies] = useState(
    () => initialEditData?.totalCopies ?? "",
  );
  const [totalCopiesError, setTotalCopiesError] = useState("");
  const [availableCopies, setAvailableCopies] = useState(
    () => initialEditData?.availableCopies ?? "",
  );
  const [availableCopiesError, setAvailableCopiesError] = useState("");

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
  } = useAuthorsQuery(
    normalizedAuthorKeyword,
    normalizedAuthorKeyword.length > 0,
  );

  const categoryOptions = categoriesData?.categories ?? [];
  const authorOptions = useMemo(
    () => authorsData?.authors ?? [],
    [authorsData],
  );
  const authorEmptyMessage =
    normalizedAuthorKeyword.length === 0
      ? "Type author name."
      : isAuthorsFetching && authorOptions.length === 0
        ? "Searching author..."
        : !isAuthorsFetching && authorOptions.length === 0
          ? "Author tidak ditemukan. Kamu tetap bisa pakai nama yang diketik."
          : null;

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
      await queryClient.invalidateQueries({
        queryKey: tanstackQueryKeys.adminBooks.all,
      });
      showSuccessToast(response.message || "Book berhasil ditambahkan.");
      router.push("/list?tab=book-list");
    },
    onError: (mutationError) => {
      showErrorToast(mutationError.message || "Gagal menambahkan book.");
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: updateBook,
    onSuccess: async (response) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: tanstackQueryKeys.adminBooks.all,
        }),
        queryClient.invalidateQueries({
          queryKey: tanstackQueryKeys.bookDetail.detail(bookId ?? 0),
        }),
      ]);
      showSuccessToast(response.message || "Book berhasil diperbarui.");
      router.push("/list?tab=book-list");
    },
    onError: (mutationError) => {
      showErrorToast(mutationError.message || "Gagal memperbarui book.");
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

  const handleInputFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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

    const matchedAuthor =
      authorOptions.find((author) => author.name === value) ?? null;
    setSelectedAuthor(matchedAuthor);
    setAuthorInput(value);
  };

  const handleNumberOfPagesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nextValue = event.target.value;
    if (numberRegex.test(nextValue)) {
      setNumberOfPages(nextValue);
      setNumberOfPagesError("");
      return;
    }

    setNumberOfPagesError("Number of Pages hanya boleh berisi angka.");
  };

  const handlePublishedYearChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nextValue = event.target.value;
    if (numberRegex.test(nextValue)) {
      setPublishedYear(nextValue);
      setPublishedYearError("");
      return;
    }

    setPublishedYearError("Published Year hanya boleh berisi angka.");
  };

  const handleTotalCopiesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nextValue = event.target.value;
    if (numberRegex.test(nextValue)) {
      setTotalCopies(nextValue);
      setTotalCopiesError("");
      return;
    }

    setTotalCopiesError("Total Copies hanya boleh berisi angka.");
  };

  const handleAvailableCopiesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nextValue = event.target.value;
    if (numberRegex.test(nextValue)) {
      setAvailableCopies(nextValue);
      setAvailableCopiesError("");
      return;
    }

    setAvailableCopiesError("Available Copies hanya boleh berisi angka.");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasToken || !token) {
      showErrorToast("Sesi login tidak ditemukan. Silakan login ulang.");
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

    if (!normalizedDescription) {
      showErrorToast("Description wajib diisi.");
      return;
    }

    if (mode === "add") {
      if (!numberOfPages) {
        setNumberOfPagesError("Number of Pages wajib diisi.");
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

      return;
    }

    if (!bookId) {
      showErrorToast("ID book tidak valid.");
      return;
    }

    const normalizedIsbn = isbn.trim();
    const normalizedPublishedYear = Number(publishedYear);
    const normalizedTotalCopies = Number(totalCopies);
    const normalizedAvailableCopies = Number(availableCopies);

    if (!normalizedIsbn) {
      showErrorToast("ISBN wajib diisi.");
      return;
    }

    if (
      !Number.isInteger(normalizedPublishedYear) ||
      normalizedPublishedYear <= 0
    ) {
      setPublishedYearError("Published Year wajib berupa angka lebih dari 0.");
      return;
    }

    if (!Number.isInteger(normalizedTotalCopies) || normalizedTotalCopies < 0) {
      setTotalCopiesError("Total Copies wajib berupa angka 0 atau lebih.");
      return;
    }

    if (
      !Number.isInteger(normalizedAvailableCopies) ||
      normalizedAvailableCopies < 0
    ) {
      setAvailableCopiesError(
        "Available Copies wajib berupa angka 0 atau lebih.",
      );
      return;
    }

    if (normalizedAvailableCopies > normalizedTotalCopies) {
      setAvailableCopiesError(
        "Available Copies tidak boleh lebih besar dari Total Copies.",
      );
      return;
    }

    updateBookMutation.mutate({
      id: bookId,
      token,
      title: normalizedTitle,
      description: normalizedDescription,
      isbn: normalizedIsbn,
      publishedYear: normalizedPublishedYear,
      authorId: selectedAuthor?.id,
      authorName: normalizedAuthorName,
      categoryId: normalizedCategoryId,
      totalCopies: normalizedTotalCopies,
      availableCopies: normalizedAvailableCopies,
    });
  };

  const isSubmitting =
    createBookMutation.isPending || updateBookMutation.isPending;

  return (
    <main className="grid gap-6 px-4 py-4 lg:gap-8 lg:px-[120px] lg:py-8">
      <section className="grid w-full justify-items-center">
        <form
          className="grid w-full gap-3 lg:w-[640px]"
          onSubmit={handleSubmit}
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

          {!hasToken ? (
            <div className="rounded-2xl border border-danger-300 bg-danger-300/10 px-4 py-3 text-sm text-danger-300">
              Sesi login tidak ditemukan. Silakan login ulang sebelum{" "}
              {mode === "edit" ? "mengubah" : "menambahkan"} book.
            </div>
          ) : null}

          <label className="grid gap-1">
            <span className="text-md font-semibold text-neutral-950">
              Title
            </span>
            <Input
              className="h-14 rounded-2xl border-neutral-300 bg-neutral-25 px-4 text-md text-neutral-950 shadow-none focus-visible:ring-0"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-md font-semibold text-neutral-950">
              Author
            </span>
            <Combobox
              inputValue={authorInput}
              onInputValueChange={handleAuthorInputChange}
              onValueChange={handleAuthorValueChange}
              value={selectedAuthor?.name ?? null}
            >
              <ComboboxInput
                className="w-full h-14 rounded-2xl border-neutral-300 bg-neutral-25 [&_[data-slot=input-group-control]]:h-14 [&_[data-slot=input-group-control]]:px-4 [&_[data-slot=input-group-control]]:text-md [&_[data-slot=input-group-control]]:text-neutral-950"
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
                {authorEmptyMessage ? (
                  <ComboboxEmpty>{authorEmptyMessage}</ComboboxEmpty>
                ) : null}
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
            <span className="text-md font-semibold text-neutral-950">
              Category
            </span>
            <div className="relative">
              <select
                className="h-14 w-full appearance-none rounded-2xl border border-neutral-300 bg-neutral-25 px-4 text-md text-neutral-950 outline-none"
                onChange={(event) => setCategoryId(event.target.value)}
                value={categoryId}
              >
                <option value="">
                  {isCategoriesLoading
                    ? "Loading categories..."
                    : "Select Category"}
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
                {(categoriesError as Error)?.message ||
                  "Gagal memuat category."}
              </p>
            ) : null}
          </label>

          {mode === "edit" ? (
            <>
              <label className="grid gap-1">
                <span className="text-md font-semibold text-neutral-950">
                  ISBN
                </span>
                <Input
                  className="h-14 rounded-2xl border-neutral-300 bg-neutral-25 px-4 text-md text-neutral-950 shadow-none focus-visible:ring-0"
                  onChange={(event) => setIsbn(event.target.value)}
                  value={isbn}
                />
              </label>

              <label className="grid gap-1">
                <span className="text-md font-semibold text-neutral-950">
                  Published Year
                </span>
                <Input
                  className="h-14 rounded-2xl border-neutral-300 bg-neutral-25 px-4 text-md text-neutral-950 shadow-none focus-visible:ring-0"
                  inputMode="numeric"
                  onChange={handlePublishedYearChange}
                  pattern="[0-9]*"
                  type="text"
                  value={publishedYear}
                />
                {publishedYearError ? (
                  <p className="text-xs text-danger-300">
                    {publishedYearError}
                  </p>
                ) : null}
              </label>

              <label className="grid gap-1">
                <span className="text-md font-semibold text-neutral-950">
                  Total Copies
                </span>
                <Input
                  className="h-14 rounded-2xl border-neutral-300 bg-neutral-25 px-4 text-md text-neutral-950 shadow-none focus-visible:ring-0"
                  inputMode="numeric"
                  onChange={handleTotalCopiesChange}
                  pattern="[0-9]*"
                  type="text"
                  value={totalCopies}
                />
                {totalCopiesError ? (
                  <p className="text-xs text-danger-300">{totalCopiesError}</p>
                ) : null}
              </label>

              <label className="grid gap-1">
                <span className="text-md font-semibold text-neutral-950">
                  Available Copies
                </span>
                <Input
                  className="h-14 rounded-2xl border-neutral-300 bg-neutral-25 px-4 text-md text-neutral-950 shadow-none focus-visible:ring-0"
                  inputMode="numeric"
                  onChange={handleAvailableCopiesChange}
                  pattern="[0-9]*"
                  type="text"
                  value={availableCopies}
                />
                {availableCopiesError ? (
                  <p className="text-xs text-danger-300">
                    {availableCopiesError}
                  </p>
                ) : null}
              </label>
            </>
          ) : (
            <label className="grid gap-1">
              <span className="text-md font-semibold text-neutral-950">
                Number of Pages
              </span>
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
          )}

          <label className="grid gap-1">
            <span className="text-md font-semibold text-neutral-950">
              Description
            </span>
            <Textarea
              className="h-[164px] w-full rounded-2xl border border-neutral-300 bg-neutral-25 px-4 py-3 text-md text-neutral-950 outline-none"
              onChange={(event) => setDescription(event.target.value)}
              value={description}
            />
          </label>

          {mode === "add" ? (
            <div className="grid gap-1">
              <span className="text-md font-semibold text-neutral-950">
                Cover Image
              </span>

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

                <p className="text-md text-neutral-950">
                  PNG or JPG (max. 5mb)
                </p>
              </label>

              {coverError ? (
                <p className="text-md text-danger-300">{coverError}</p>
              ) : null}
            </div>
          ) : (
            <div className="grid gap-1">
              <span className="text-md font-semibold text-neutral-950">
                Cover Image
              </span>
              <div className="flex items-center gap-4 rounded-2xl border border-neutral-300 bg-neutral-25 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Book cover"
                  className="h-[120px] w-[80px] rounded-sm object-cover"
                  onError={(event) => {
                    const image = event.currentTarget;
                    if (image.src.endsWith(DEFAULT_BOOK_COVER)) {
                      return;
                    }
                    image.src = DEFAULT_BOOK_COVER;
                  }}
                  src={cover?.url || DEFAULT_BOOK_COVER}
                />
                <p className="text-sm text-neutral-700">
                  Cover image dari buku yang ada saat ini.
                </p>
              </div>
            </div>
          )}

          <Button
            className="h-12 rounded-full bg-primary-300 text-display-xs font-semibold text-neutral-25 hover:bg-primary-300/90 disabled:opacity-60"
            disabled={isSubmitting || !hasToken}
          >
            {isSubmitting ? "Saving..." : mode === "edit" ? "Update" : "Save"}
          </Button>
        </form>
      </section>
    </main>
  );
}

export function BookFormPage({ mode }: BookFormPageProps) {
  const params = useParams<{ id?: string }>();

  const bookId = useMemo(() => {
    if (mode !== "edit") {
      return null;
    }

    const idParam = Number(params?.id);
    if (!Number.isInteger(idParam) || idParam <= 0) {
      return null;
    }

    return idParam;
  }, [mode, params?.id]);

  const {
    data: bookDetail,
    error: bookDetailError,
    isError: isBookDetailError,
    isLoading: isBookDetailLoading,
    refetch: refetchBookDetail,
  } = useBookDetailQuery(bookId);

  if (mode === "edit" && !bookId) {
    return (
      <main className="grid gap-6 px-4 py-4 lg:gap-8 lg:px-[120px] lg:py-8">
        <section className="grid w-full justify-items-center">
          <div className="grid w-full gap-3 lg:w-[640px]">
            <Link
              className="flex w-fit items-center gap-2 text-neutral-950"
              href="/list?tab=book-list"
            >
              <ArrowLeft className="h-7 w-7" />
              <span className="display-xs font-semibold">Edit Book</span>
            </Link>
            <div className="rounded-2xl border border-danger-300 bg-danger-300/10 px-4 py-3 text-sm text-danger-300">
              ID book tidak valid.
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (mode === "edit" && isBookDetailLoading) {
    return <BookFormSkeleton />;
  }

  if (mode === "edit" && isBookDetailError) {
    return (
      <main className="grid gap-6 px-4 py-4 lg:gap-8 lg:px-[120px] lg:py-8">
        <section className="grid w-full justify-items-center">
          <div className="grid w-full gap-3 lg:w-[640px]">
            <Link
              className="flex w-fit items-center gap-2 text-neutral-950"
              href="/list?tab=book-list"
            >
              <ArrowLeft className="h-7 w-7" />
              <span className="display-xs font-semibold">Edit Book</span>
            </Link>
            <div className="grid gap-3 rounded-2xl border border-neutral-300 bg-neutral-25 p-4">
              <p className="text-sm text-neutral-700">
                {(bookDetailError as Error)?.message ||
                  "Gagal memuat detail buku."}
              </p>
              <Button
                className="h-11 rounded-full"
                onClick={() => refetchBookDetail()}
              >
                Coba Lagi
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const initialEditData =
    mode === "edit" && bookDetail ? toInitialEditFormData(bookDetail) : null;
  const formKey =
    mode === "edit" && bookDetail
      ? `edit-${bookId}-${bookDetail.updatedAt}`
      : "add";

  return (
    <BookFormContent
      bookId={bookId}
      initialEditData={initialEditData}
      key={formKey}
      mode={mode}
    />
  );
}
