import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

const tanstackApiClient = axios.create({
  baseURL: "/api",
});

export type RecommendationBook = {
  id: number;
  title: string;
  description: string;
  isbn: string;
  publishedYear: number;
  coverImage: string;
  rating: number;
  reviewCount: number;
  totalCopies: number;
  availableCopies: number;
  borrowCount: number;
  authorId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
  };
};

export type BookDetailAuthor = {
  id: number;
  name: string;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BookDetailCategory = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type BookDetailReview = {
  id: number;
  star: number;
  comment: string;
  userId: number;
  bookId: number;
  createdAt: string;
  user: {
    id: number;
    name: string;
  } | null;
};

export type BookDetail = {
  id: number;
  title: string;
  description: string;
  isbn: string;
  publishedYear: number;
  coverImage: string;
  rating: number;
  reviewCount: number;
  totalCopies: number;
  availableCopies: number;
  borrowCount: number;
  authorId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  author: BookDetailAuthor | null;
  category: BookDetailCategory | null;
  reviews: BookDetailReview[];
};

export type RecommendationPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type RecommendationData = {
  mode: string;
  books: RecommendationBook[];
  pagination: RecommendationPagination;
};

export type PopularAuthor = {
  id: number;
  name: string;
  bio: string | null;
  bookCount: number;
  accumulatedScore: number;
};

export type PopularAuthorsData = {
  authors: PopularAuthor[];
};

export type AuthorBooksData = {
  author: BookDetailAuthor | null;
  bookCount: number;
  books: RecommendationBook[];
  pagination: RecommendationPagination;
};

export type Category = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CategoriesData = {
  categories: Category[];
};

type RecommendationResponse = {
  success: boolean;
  message: string;
  data: RecommendationData;
};

type PopularAuthorsResponse = {
  success: boolean;
  message: string;
  data: PopularAuthorsData;
};

type AuthorBooksResponse = {
  success: boolean;
  message: string;
  data: AuthorBooksData;
};

type CategoriesResponse = {
  success: boolean;
  message: string;
  data: CategoriesData;
};

export type BooksListData = {
  books: RecommendationBook[];
  pagination: RecommendationPagination;
};

type BooksListResponse = {
  success: boolean;
  message: string;
  data: BooksListData;
};

type BookDetailResponse = {
  success: boolean;
  message: string;
  data: BookDetail;
};

type FetchRecommendationPageParams = {
  by: string;
  page: number;
  limit: number;
};

type FetchBooksPageParams = {
  q?: string;
  categoryId?: number;
  minRating?: number;
  page: number;
  limit: number;
};

type FetchAuthorBooksPageParams = {
  authorId: number;
  page: number;
  limit: number;
};

export const tanstackQueryKeys = {
  books: {
    all: ["books"] as const,
    list: (params: {
      q: string | null;
      categoryId: number | null;
      minRating: number | null;
      limit: number;
    }) => [...tanstackQueryKeys.books.all, params] as const,
  },
  recommendation: {
    all: ["recommendation"] as const,
    list: (params: { by: string; limit: number }) =>
      [...tanstackQueryKeys.recommendation.all, params] as const,
  },
  popularAuthors: {
    all: ["popular-authors"] as const,
    list: (params: { limit: number }) =>
      [...tanstackQueryKeys.popularAuthors.all, params] as const,
  },
  authorBooks: {
    all: ["author-books"] as const,
    list: (params: { authorId: number; limit: number }) =>
      [...tanstackQueryKeys.authorBooks.all, params] as const,
  },
  categories: {
    all: ["categories"] as const,
    list: () => [...tanstackQueryKeys.categories.all] as const,
  },
  bookDetail: {
    all: ["book-detail"] as const,
    detail: (id: number) => [...tanstackQueryKeys.bookDetail.all, id] as const,
  },
};

export async function fetchRecommendationPage(
  params: FetchRecommendationPageParams,
  signal?: AbortSignal,
): Promise<RecommendationData> {
  const response = await tanstackApiClient.get<RecommendationResponse>(
    "/books/recommend",
    {
      params,
      signal,
    },
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Gagal memuat recommendation.");
  }

  return response.data.data;
}

export async function fetchBooksPage(
  params: FetchBooksPageParams,
  signal?: AbortSignal,
): Promise<BooksListData> {
  const response = await tanstackApiClient.get<BooksListResponse>("/books", {
    params,
    signal,
  });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Gagal memuat daftar buku.");
  }

  return response.data.data;
}

export async function fetchAuthorBooksPage(
  params: FetchAuthorBooksPageParams,
  signal?: AbortSignal,
): Promise<AuthorBooksData> {
  const { authorId, page, limit } = params;

  const response = await tanstackApiClient.get<AuthorBooksResponse>(
    `/authors/${authorId}/books`,
    {
      params: {
        page,
        limit,
      },
      signal,
    },
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Gagal memuat buku author.");
  }

  return response.data.data;
}

type UseBooksInfiniteQueryParams = {
  q?: string;
  categoryId?: number;
  minRating?: number;
  limit?: number;
  enabled?: boolean;
};

export function useBooksInfiniteQuery({
  q,
  categoryId,
  minRating,
  limit = 8,
  enabled = true,
}: UseBooksInfiniteQueryParams = {}) {
  const normalizedQ = q?.trim() ?? "";
  const effectiveQ = normalizedQ.length > 0 ? normalizedQ : undefined;

  return useInfiniteQuery({
    queryKey: tanstackQueryKeys.books.list({
      q: effectiveQ ?? null,
      categoryId: categoryId ?? null,
      minRating: minRating ?? null,
      limit,
    }),
    queryFn: ({ pageParam, signal }) => {
      const page = typeof pageParam === "number" ? pageParam : 1;
      return fetchBooksPage(
        {
          q: effectiveQ,
          categoryId,
          minRating,
          page,
          limit,
        },
        signal,
      );
    },
    enabled,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const {
        pagination: { page, totalPages },
      } = lastPage;

      if (page >= totalPages) {
        return undefined;
      }

      return page + 1;
    },
  });
}

type UseAuthorBooksInfiniteQueryParams = {
  authorId: number | null;
  limit?: number;
  enabled?: boolean;
};

export function useAuthorBooksInfiniteQuery({
  authorId,
  limit = 8,
  enabled = true,
}: UseAuthorBooksInfiniteQueryParams) {
  return useInfiniteQuery({
    queryKey: tanstackQueryKeys.authorBooks.list({
      authorId: authorId ?? 0,
      limit,
    }),
    queryFn: ({ pageParam, signal }) => {
      if (!authorId || authorId <= 0) {
        throw new Error("ID author tidak valid.");
      }

      const page = typeof pageParam === "number" ? pageParam : 1;
      return fetchAuthorBooksPage(
        {
          authorId,
          page,
          limit,
        },
        signal,
      );
    },
    enabled:
      enabled &&
      typeof authorId === "number" &&
      Number.isFinite(authorId) &&
      authorId > 0,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const {
        pagination: { page, totalPages },
      } = lastPage;

      if (page >= totalPages) {
        return undefined;
      }

      return page + 1;
    },
  });
}

type UseRecommendationInfiniteQueryParams = {
  by?: string;
  limit?: number;
};

export function useRecommendationInfiniteQuery({
  by = "rating",
  limit = 10,
}: UseRecommendationInfiniteQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: tanstackQueryKeys.recommendation.list({ by, limit }),
    queryFn: ({ pageParam, signal }) => {
      const page = typeof pageParam === "number" ? pageParam : 1;
      return fetchRecommendationPage({ by, page, limit }, signal);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const {
        pagination: { page, totalPages },
      } = lastPage;

      if (page >= totalPages) {
        return undefined;
      }

      return page + 1;
    },
  });
}

type FetchPopularAuthorsParams = {
  limit: number;
};

export async function fetchPopularAuthors(
  params: FetchPopularAuthorsParams,
  signal?: AbortSignal,
): Promise<PopularAuthorsData> {
  const response = await tanstackApiClient.get<PopularAuthorsResponse>(
    "/authors/popular",
    {
      signal,
      params,
    },
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Gagal memuat popular author.");
  }

  return response.data.data;
}

type UsePopularAuthorsInfiniteQueryParams = {
  limit?: number;
};

export function usePopularAuthorsInfiniteQuery({
  limit = 4,
}: UsePopularAuthorsInfiniteQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: tanstackQueryKeys.popularAuthors.list({ limit }),
    queryFn: ({ pageParam, signal }) => {
      const page = typeof pageParam === "number" ? pageParam : 1;
      const requestedLimit = page * limit;
      return fetchPopularAuthors({ limit: requestedLimit }, signal);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const page = typeof lastPageParam === "number" ? lastPageParam : 1;
      const requestedLimit = page * limit;
      const currentLength = lastPage.authors.length;

      if (currentLength === 0) {
        return undefined;
      }

      if (currentLength < requestedLimit) {
        return undefined;
      }

      if (allPages.length > 1) {
        const previousLength = allPages[allPages.length - 2]?.authors.length ?? 0;
        if (currentLength <= previousLength) {
          return undefined;
        }
      }

      return page + 1;
    },
  });
}

export async function fetchCategories(
  signal?: AbortSignal,
): Promise<CategoriesData> {
  const response = await tanstackApiClient.get<CategoriesResponse>("/categories", {
    signal,
  });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Gagal memuat categories.");
  }

  return response.data.data;
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: tanstackQueryKeys.categories.list(),
    queryFn: ({ signal }) => fetchCategories(signal),
  });
}

export async function fetchBookDetail(
  id: number,
  signal?: AbortSignal,
): Promise<BookDetail> {
  const response = await tanstackApiClient.get<BookDetailResponse>(
    `/books/${id}`,
    {
      signal,
    },
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Gagal memuat detail buku.");
  }

  return response.data.data;
}

export function useBookDetailQuery(id: number | null) {
  return useQuery({
    queryKey: tanstackQueryKeys.bookDetail.detail(id ?? 0),
    queryFn: ({ signal }) => {
      if (!id || id <= 0) {
        throw new Error("ID buku tidak valid.");
      }
      return fetchBookDetail(id, signal);
    },
    enabled: typeof id === "number" && Number.isFinite(id) && id > 0,
  });
}
