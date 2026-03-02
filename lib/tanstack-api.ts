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

export const tanstackQueryKeys = {
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
