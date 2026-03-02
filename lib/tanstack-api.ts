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

export type CartItem = {
  id: number;
  bookId: number;
  addedAt: string;
  book: RecommendationBook;
};

export type CartData = {
  cartId: number;
  items: CartItem[];
  itemCount: number;
};

type CartResponse = {
  success: boolean;
  message: string;
  data?: CartData;
};

export type AddCartItemApiItem = {
  id: number;
  cartId: number;
  bookId: number;
  createdAt: string;
  book: RecommendationBook;
};

type AddCartItemResponse = {
  success: boolean;
  message: string;
  data?: {
    item: AddCartItemApiItem;
  };
};

export type RemoveCartItemResponse = {
  success: boolean;
  message: string;
  data?: {
    id: number;
  };
};

export type CheckoutUser = {
  name: string;
  email: string;
  nomorHandphone: string;
};

export type CheckoutItem = {
  id: number;
  bookId: number;
  book: RecommendationBook;
};

export type CheckoutData = {
  user: CheckoutUser;
  items: CheckoutItem[];
  itemCount: number;
};

type CheckoutResponse = {
  success: boolean;
  message: string;
  data?: CheckoutData;
};

export type LoanFromCart = {
  id: number;
  userId: number;
  bookId: number;
  status: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
  returnByMessage: string;
};

export type LoanFromCartData = {
  loans: LoanFromCart[];
  failed: unknown[];
  removedFromCart: number;
  message: string;
};

type LoanFromCartResponse = {
  success: boolean;
  message: string;
  data?: LoanFromCartData;
};

export type BorrowLoan = {
  id: number;
  userId: number;
  bookId: number;
  status: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
};

export type BorrowBookData = {
  loan: BorrowLoan;
};

export type BorrowBookResponse = {
  success: boolean;
  message: string;
  data?: BorrowBookData;
};

export type MyLoanStatusFilter = "all" | "active" | "returned" | "overdue";

export type MyLoan = {
  id: number;
  status: string;
  displayStatus: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
  durationDays: number;
  book: RecommendationBook;
};

export type MyLoansData = {
  loans: MyLoan[];
  pagination: RecommendationPagination;
};

type MyLoansResponse = {
  success: boolean;
  message: string;
  data?: MyLoansData;
};

export type MyReviewBook = RecommendationBook & {
  author?: {
    id: number;
    name: string;
  } | null;
  category?: {
    id: number;
    name: string;
  } | null;
};

export type MyReview = {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  book: MyReviewBook;
};

export type MyReviewsData = {
  reviews: MyReview[];
  pagination: RecommendationPagination;
};

type MyReviewsResponse = {
  success: boolean;
  message: string;
  data?: MyReviewsData;
};

export type ReturnLoan = {
  id: number;
  userId: number;
  bookId: number;
  status: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
};

export type ReturnLoanData = {
  loan: ReturnLoan;
};

export type ReturnLoanResponse = {
  success: boolean;
  message: string;
  data?: ReturnLoanData;
};

export type Review = {
  id: number;
  star: number;
  comment: string;
  userId: number;
  bookId: number;
  createdAt: string;
};

export type ReviewBookStats = {
  rating: number;
  reviewCount: number;
};

export type CreateReviewData = {
  review: Review;
  bookStats: ReviewBookStats;
};

export type CreateReviewResponse = {
  success: boolean;
  message: string;
  data?: CreateReviewData;
};

export type MyProfile = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  profilePhoto: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
};

export type MyProfileData = {
  profile: MyProfile;
};

type MyProfileResponse = {
  success: boolean;
  message: string;
  data?: MyProfileData;
};

export type UpdateMyProfilePayload = {
  name: string;
  phone: string;
  profilePhoto?: File | null;
  token?: string | null;
};

type UpdateMyProfileResponse = {
  success: boolean;
  message: string;
  data?: MyProfileData;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  profilePhoto: string | null;
  role: string;
  createdAt: string;
};

export type AdminUsersData = {
  users: AdminUser[];
  pagination: RecommendationPagination;
};

type AdminUsersResponse = {
  success: boolean;
  message: string;
  data?: AdminUsersData;
};

export type AdminBookStatus = "all" | "available" | "borrowed" | "returned";

export type AdminBooksData = {
  books: RecommendationBook[];
  pagination: RecommendationPagination;
};

type AdminBooksResponse = {
  success: boolean;
  message: string;
  data?: AdminBooksData;
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

type FetchMyLoansPageParams = {
  status: MyLoanStatusFilter;
  q?: string;
  page: number;
  limit: number;
  token?: string | null;
};

type FetchMyReviewsPageParams = {
  q?: string;
  page: number;
  limit: number;
  token?: string | null;
};

type FetchAdminUsersPageParams = {
  q?: string;
  page: number;
  limit: number;
  token?: string | null;
};

type FetchAdminBooksPageParams = {
  status: AdminBookStatus;
  q?: string;
  page: number;
  limit: number;
  token?: string | null;
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
  cart: {
    all: ["cart"] as const,
    detail: (token: string | null) =>
      [...tanstackQueryKeys.cart.all, token ?? ""] as const,
  },
  checkout: {
    all: ["checkout"] as const,
    detail: (token: string | null) =>
      [...tanstackQueryKeys.checkout.all, token ?? ""] as const,
  },
  profile: {
    all: ["profile"] as const,
    detail: (token: string | null) =>
      [...tanstackQueryKeys.profile.all, token ?? ""] as const,
  },
  myLoans: {
    all: ["my-loans"] as const,
    list: (params: {
      token: string | null;
      status: MyLoanStatusFilter;
      q: string | null;
      limit: number;
    }) => [...tanstackQueryKeys.myLoans.all, params] as const,
  },
  myReviews: {
    all: ["my-reviews"] as const,
    list: (params: {
      token: string | null;
      q: string | null;
      limit: number;
    }) => [...tanstackQueryKeys.myReviews.all, params] as const,
  },
  adminUsers: {
    all: ["admin-users"] as const,
    list: (params: {
      token: string | null;
      q: string | null;
      page: number;
      limit: number;
    }) => [...tanstackQueryKeys.adminUsers.all, params] as const,
  },
  adminBooks: {
    all: ["admin-books"] as const,
    list: (params: {
      token: string | null;
      status: AdminBookStatus;
      q: string | null;
      limit: number;
    }) => [...tanstackQueryKeys.adminBooks.all, params] as const,
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

export async function fetchAdminUsersPage(
  params: FetchAdminUsersPageParams,
  signal?: AbortSignal,
): Promise<AdminUsersData> {
  try {
    const token = params.token?.trim() ?? "";

    const response = await tanstackApiClient.get<AdminUsersResponse>(
      "/admin/users",
      {
        signal,
        params: {
          ...(params.q ? { q: params.q } : {}),
          page: params.page,
          limit: params.limit,
        },
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      },
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Gagal memuat daftar user.");
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError<AdminUsersResponse>(error)) {
      const message = error.response?.data?.message || "Gagal memuat daftar user.";
      throw new Error(message);
    }

    throw new Error("Terjadi kesalahan saat memuat daftar user.");
  }
}

type UseAdminUsersQueryParams = {
  token?: string | null;
  q?: string;
  page: number;
  limit?: number;
  enabled?: boolean;
};

export function useAdminUsersQuery({
  token,
  q,
  page,
  limit = 10,
  enabled = true,
}: UseAdminUsersQueryParams) {
  const normalizedQ = q?.trim() ?? "";
  const effectiveQ = normalizedQ.length > 0 ? normalizedQ : undefined;

  return useQuery({
    queryKey: tanstackQueryKeys.adminUsers.list({
      token: token ?? null,
      q: effectiveQ ?? null,
      page,
      limit,
    }),
    queryFn: ({ signal }) =>
      fetchAdminUsersPage(
        {
          token,
          q: effectiveQ,
          page,
          limit,
        },
        signal,
      ),
    enabled,
  });
}

export async function fetchAdminBooksPage(
  params: FetchAdminBooksPageParams,
  signal?: AbortSignal,
): Promise<AdminBooksData> {
  try {
    const token = params.token?.trim() ?? "";

    const response = await tanstackApiClient.get<AdminBooksResponse>(
      "/admin/books",
      {
        signal,
        params: {
          status: params.status,
          ...(params.q ? { q: params.q } : {}),
          page: params.page,
          limit: params.limit,
        },
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      },
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Gagal memuat daftar buku admin.");
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError<AdminBooksResponse>(error)) {
      const message =
        error.response?.data?.message || "Gagal memuat daftar buku admin.";
      throw new Error(message);
    }

    throw new Error("Terjadi kesalahan saat memuat daftar buku admin.");
  }
}

type UseAdminBooksInfiniteQueryParams = {
  token?: string | null;
  status: AdminBookStatus;
  q?: string;
  limit?: number;
  enabled?: boolean;
};

export function useAdminBooksInfiniteQuery({
  token,
  status,
  q,
  limit = 4,
  enabled = true,
}: UseAdminBooksInfiniteQueryParams) {
  const normalizedQ = q?.trim() ?? "";
  const effectiveQ = normalizedQ.length > 0 ? normalizedQ : undefined;

  return useInfiniteQuery({
    queryKey: tanstackQueryKeys.adminBooks.list({
      token: token ?? null,
      status,
      q: effectiveQ ?? null,
      limit,
    }),
    queryFn: ({ pageParam, signal }) => {
      const page = typeof pageParam === "number" ? pageParam : 1;
      return fetchAdminBooksPage(
        {
          token,
          status,
          q: effectiveQ,
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

export async function fetchMyLoansPage(
  params: FetchMyLoansPageParams,
  signal?: AbortSignal,
): Promise<MyLoansData> {
  try {
    const token = params.token?.trim() ?? "";

    const response = await tanstackApiClient.get<MyLoansResponse>("/loans/my", {
      signal,
      params: {
        status: params.status,
        ...(params.q ? { q: params.q } : {}),
        page: params.page,
        limit: params.limit,
      },
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Gagal memuat daftar peminjaman.");
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError<MyLoansResponse>(error)) {
      const message =
        error.response?.data?.message || "Gagal memuat daftar peminjaman.";
      throw new Error(message);
    }

    throw new Error("Terjadi kesalahan saat memuat daftar peminjaman.");
  }
}

type UseMyLoansInfiniteQueryParams = {
  token?: string | null;
  status: MyLoanStatusFilter;
  q?: string;
  limit?: number;
  enabled?: boolean;
};

export function useMyLoansInfiniteQuery({
  token,
  status,
  q,
  limit = 3,
  enabled = true,
}: UseMyLoansInfiniteQueryParams) {
  const normalizedQ = q?.trim() ?? "";
  const effectiveQ = normalizedQ.length > 0 ? normalizedQ : undefined;

  return useInfiniteQuery({
    queryKey: tanstackQueryKeys.myLoans.list({
      token: token ?? null,
      status,
      q: effectiveQ ?? null,
      limit,
    }),
    queryFn: ({ pageParam, signal }) => {
      const page = typeof pageParam === "number" ? pageParam : 1;
      return fetchMyLoansPage(
        {
          token,
          status,
          q: effectiveQ,
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

export async function fetchMyReviewsPage(
  params: FetchMyReviewsPageParams,
  signal?: AbortSignal,
): Promise<MyReviewsData> {
  try {
    const token = params.token?.trim() ?? "";

    const response = await tanstackApiClient.get<MyReviewsResponse>("/me/reviews", {
      signal,
      params: {
        ...(params.q ? { q: params.q } : {}),
        page: params.page,
        limit: params.limit,
      },
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Gagal memuat daftar review.");
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError<MyReviewsResponse>(error)) {
      const message = error.response?.data?.message || "Gagal memuat daftar review.";
      throw new Error(message);
    }

    throw new Error("Terjadi kesalahan saat memuat daftar review.");
  }
}

type UseMyReviewsInfiniteQueryParams = {
  token?: string | null;
  q?: string;
  limit?: number;
  enabled?: boolean;
};

export function useMyReviewsInfiniteQuery({
  token,
  q,
  limit = 3,
  enabled = true,
}: UseMyReviewsInfiniteQueryParams) {
  const normalizedQ = q?.trim() ?? "";
  const effectiveQ = normalizedQ.length > 0 ? normalizedQ : undefined;

  return useInfiniteQuery({
    queryKey: tanstackQueryKeys.myReviews.list({
      token: token ?? null,
      q: effectiveQ ?? null,
      limit,
    }),
    queryFn: ({ pageParam, signal }) => {
      const page = typeof pageParam === "number" ? pageParam : 1;
      return fetchMyReviewsPage(
        {
          token,
          q: effectiveQ,
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

export async function fetchMyProfile(
  options?: {
    token?: string | null;
  },
  signal?: AbortSignal,
): Promise<MyProfileData> {
  try {
    const token = options?.token?.trim() ?? "";

    const response = await tanstackApiClient.get<MyProfileResponse>("/me", {
      signal,
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });

    if (!response.data.success || !response.data.data?.profile) {
      throw new Error(response.data.message || "Gagal memuat profile.");
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError<MyProfileResponse>(error)) {
      const message = error.response?.data?.message || "Gagal memuat profile.";
      throw new Error(message);
    }

    throw new Error("Terjadi kesalahan saat memuat profile.");
  }
}

export async function updateMyProfile(
  payload: UpdateMyProfilePayload,
): Promise<UpdateMyProfileResponse> {
  try {
    const token = payload.token?.trim() ?? "";
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("phone", payload.phone);

    if (payload.profilePhoto instanceof File) {
      formData.append("profilePhoto", payload.profilePhoto);
    }

    const response = await tanstackApiClient.patch<UpdateMyProfileResponse>(
      "/me",
      formData,
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      },
    );

    if (!response.data.success || !response.data.data?.profile) {
      throw new Error(response.data.message || "Gagal memperbarui profile.");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError<UpdateMyProfileResponse>(error)) {
      const message =
        error.response?.data?.message || "Gagal memperbarui profile.";
      throw new Error(message);
    }

    throw new Error("Terjadi kesalahan saat memperbarui profile.");
  }
}

export function useMyProfileQuery(
  options?: {
    token?: string | null;
    enabled?: boolean;
  },
) {
  const token = options?.token ?? null;
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: tanstackQueryKeys.profile.detail(token),
    queryFn: ({ signal }) =>
      fetchMyProfile(
        {
          token,
        },
        signal,
      ),
    enabled,
  });
}

export async function fetchCart(
  options?: {
    token?: string | null;
  },
  signal?: AbortSignal,
): Promise<CartData> {
  try {
    const token = options?.token?.trim() ?? "";
    const response = await tanstackApiClient.get<CartResponse>("/cart", {
      signal,
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Gagal memuat cart.");
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError<CartResponse>(error)) {
      const message = error.response?.data?.message || "Gagal memuat cart.";
      throw new Error(message);
    }

    throw new Error("Terjadi kesalahan saat memuat cart.");
  }
}

export function normalizeCartItem(item: AddCartItemApiItem): CartItem {
  return {
    id: item.id,
    bookId: item.bookId,
    addedAt: item.createdAt,
    book: item.book,
  };
}

export async function addCartItem(options: {
  bookId: number;
  token?: string | null;
}): Promise<AddCartItemResponse> {
  try {
    const token = options.token?.trim() ?? "";
    const response = await tanstackApiClient.post<AddCartItemResponse>(
      "/cart/items",
      {
        bookId: options.bookId,
      },
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      },
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Gagal menambahkan buku ke cart.");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError<AddCartItemResponse>(error)) {
      const message =
        error.response?.data?.message || "Gagal menambahkan buku ke cart.";
      throw new Error(message);
    }

    throw new Error("Terjadi kesalahan saat menambahkan buku ke cart.");
  }
}

export async function removeCartItem(options: {
  itemId: number;
  token?: string | null;
}): Promise<RemoveCartItemResponse> {
  try {
    const token = options.token?.trim() ?? "";
    const response = await tanstackApiClient.delete<RemoveCartItemResponse>(
      `/cart/items/${options.itemId}`,
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      },
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Gagal menghapus buku dari cart.");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError<RemoveCartItemResponse>(error)) {
      const message =
        error.response?.data?.message || "Gagal menghapus buku dari cart.";
      throw new Error(message);
    }

    throw new Error("Terjadi kesalahan saat menghapus buku dari cart.");
  }
}

export async function fetchCheckout(
  options?: {
    token?: string | null;
  },
  signal?: AbortSignal,
): Promise<CheckoutData> {
  try {
    const token = options?.token?.trim() ?? "";
    const response = await tanstackApiClient.get<CheckoutResponse>("/cart/checkout", {
      signal,
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Gagal memuat data checkout.");
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError<CheckoutResponse>(error)) {
      const message =
        error.response?.data?.message || "Gagal memuat data checkout.";
      throw new Error(message);
    }

    throw new Error("Terjadi kesalahan saat memuat data checkout.");
  }
}

export function useCheckoutQuery(
  options?: {
    token?: string | null;
    enabled?: boolean;
  },
) {
  const token = options?.token ?? null;
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: tanstackQueryKeys.checkout.detail(token),
    queryFn: ({ signal }) =>
      fetchCheckout(
        {
          token,
        },
        signal,
      ),
    enabled,
  });
}

export async function borrowFromCart(options: {
  itemIds: number[];
  days: number;
  borrowDate: string;
  token?: string | null;
}): Promise<LoanFromCartResponse> {
  try {
    const token = options.token?.trim() ?? "";
    const response = await tanstackApiClient.post<LoanFromCartResponse>(
      "/loans/from-cart",
      {
        itemIds: options.itemIds,
        days: options.days,
        borrowDate: options.borrowDate,
      },
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      },
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Gagal memproses checkout.");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError<LoanFromCartResponse>(error)) {
      const message = error.response?.data?.message || "Gagal memproses checkout.";
      throw new Error(message);
    }

    throw new Error("Terjadi kesalahan saat memproses checkout.");
  }
}

export async function borrowBook(options: {
  bookId: number;
  days?: number;
  token?: string | null;
}): Promise<BorrowBookResponse> {
  try {
    const token = options.token?.trim() ?? "";
    const response = await tanstackApiClient.post<BorrowBookResponse>(
      "/loans",
      {
        bookId: options.bookId,
        days: options.days ?? 7,
      },
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      },
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Gagal meminjam buku.");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError<BorrowBookResponse>(error)) {
      const message = error.response?.data?.message || "Gagal meminjam buku.";
      throw new Error(message);
    }

    throw new Error("Terjadi kesalahan saat meminjam buku.");
  }
}

export async function returnLoan(options: {
  loanId: number;
  token?: string | null;
}): Promise<ReturnLoanResponse> {
  try {
    const token = options.token?.trim() ?? "";
    const response = await tanstackApiClient.patch<ReturnLoanResponse>(
      `/loans/${options.loanId}/return`,
      undefined,
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      },
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Return failed");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError<ReturnLoanResponse>(error)) {
      const message = error.response?.data?.message || "Return failed";
      throw new Error(message);
    }

    throw new Error("Terjadi kesalahan saat mengembalikan buku.");
  }
}

export async function createReview(options: {
  bookId: number;
  star: number;
  comment: string;
  token?: string | null;
}): Promise<CreateReviewResponse> {
  try {
    const token = options.token?.trim() ?? "";
    const response = await tanstackApiClient.post<CreateReviewResponse>(
      "/reviews",
      {
        bookId: options.bookId,
        star: options.star,
        comment: options.comment,
      },
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      },
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Gagal menyimpan review.");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError<CreateReviewResponse>(error)) {
      const message = error.response?.data?.message || "Gagal menyimpan review.";
      throw new Error(message);
    }

    throw new Error("Terjadi kesalahan saat menyimpan review.");
  }
}

export function useCartQuery(
  options?: {
    token?: string | null;
    enabled?: boolean;
  },
) {
  const token = options?.token ?? null;
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: tanstackQueryKeys.cart.detail(token),
    queryFn: ({ signal }) =>
      fetchCart(
        {
          token,
        },
        signal,
      ),
    enabled,
  });
}
