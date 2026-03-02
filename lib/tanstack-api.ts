import { useInfiniteQuery } from "@tanstack/react-query";
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

type RecommendationResponse = {
  success: boolean;
  message: string;
  data: RecommendationData;
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
