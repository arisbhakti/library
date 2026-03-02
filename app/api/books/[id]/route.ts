import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateBookBody = {
  title?: unknown;
  description?: unknown;
  isbn?: unknown;
  publishedYear?: unknown;
  authorId?: unknown;
  authorName?: unknown;
  categoryId?: unknown;
  totalCopies?: unknown;
  availableCopies?: unknown;
};

function parseBookId(rawId: string): number | null {
  const idParam = Number(rawId);
  const id = Number.isInteger(idParam) && idParam > 0 ? idParam : null;
  return id;
}

function getApiBaseUrl() {
  const baseUrl = process.env.BASE_URL_API_LIBRARY;
  if (!baseUrl) {
    return null;
  }

  return baseUrl.replace(/\/+$/, "");
}

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const id = parseBookId(rawId);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID buku tidak valid.",
        },
        { status: 400 },
      );
    }

    const baseUrl = getApiBaseUrl();

    if (!baseUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "BASE_URL_API_LIBRARY belum dikonfigurasi.",
        },
        { status: 500 },
      );
    }

    const url = `${baseUrl}/books/${id}`;
    const response = await axios.get(url);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          success: false,
          message:
            (error.response?.data as { message?: string } | undefined)?.message ??
            "Gagal memuat detail buku.",
        },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const id = parseBookId(rawId);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID buku tidak valid.",
        },
        { status: 400 },
      );
    }

    const authorization = request.headers.get("authorization")?.trim();
    if (!authorization) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization token wajib diisi.",
        },
        { status: 401 },
      );
    }

    const body = (await request.json()) as UpdateBookBody;
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : "";
    const isbn = typeof body.isbn === "string" ? body.isbn.trim() : "";
    const authorName =
      typeof body.authorName === "string" ? body.authorName.trim() : "";

    const publishedYear = Number(body.publishedYear);
    const authorId = Number(body.authorId);
    const categoryId = Number(body.categoryId);
    const totalCopies = Number(body.totalCopies);
    const availableCopies = Number(body.availableCopies);

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "title wajib diisi.",
        },
        { status: 400 },
      );
    }

    if (!description) {
      return NextResponse.json(
        {
          success: false,
          message: "description wajib diisi.",
        },
        { status: 400 },
      );
    }

    if (!isbn) {
      return NextResponse.json(
        {
          success: false,
          message: "isbn wajib diisi.",
        },
        { status: 400 },
      );
    }

    if (!isPositiveInteger(publishedYear)) {
      return NextResponse.json(
        {
          success: false,
          message: "publishedYear wajib berupa angka lebih dari 0.",
        },
        { status: 400 },
      );
    }

    if (!isPositiveInteger(categoryId)) {
      return NextResponse.json(
        {
          success: false,
          message: "categoryId wajib berupa angka lebih dari 0.",
        },
        { status: 400 },
      );
    }

    if (!isNonNegativeInteger(totalCopies)) {
      return NextResponse.json(
        {
          success: false,
          message: "totalCopies wajib berupa angka 0 atau lebih.",
        },
        { status: 400 },
      );
    }

    if (!isNonNegativeInteger(availableCopies)) {
      return NextResponse.json(
        {
          success: false,
          message: "availableCopies wajib berupa angka 0 atau lebih.",
        },
        { status: 400 },
      );
    }

    if (availableCopies > totalCopies) {
      return NextResponse.json(
        {
          success: false,
          message: "availableCopies tidak boleh lebih besar dari totalCopies.",
        },
        { status: 400 },
      );
    }

    const hasAuthorId = isPositiveInteger(authorId);
    const hasAuthorName = authorName.length > 0;

    if (!hasAuthorId && !hasAuthorName) {
      return NextResponse.json(
        {
          success: false,
          message: "authorId atau authorName wajib diisi.",
        },
        { status: 400 },
      );
    }

    const baseUrl = getApiBaseUrl();
    if (!baseUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "BASE_URL_API_LIBRARY belum dikonfigurasi.",
        },
        { status: 500 },
      );
    }

    const payload: {
      title: string;
      description: string;
      isbn: string;
      publishedYear: number;
      categoryId: number;
      totalCopies: number;
      availableCopies: number;
      authorId?: number;
      authorName?: string;
    } = {
      title,
      description,
      isbn,
      publishedYear,
      categoryId,
      totalCopies,
      availableCopies,
    };

    if (hasAuthorId) {
      payload.authorId = authorId;
    }

    if (hasAuthorName) {
      payload.authorName = authorName;
    }

    const response = await axios.put(`${baseUrl}/books/${id}`, payload, {
      headers: {
        Accept: "*/*",
        Authorization: authorization,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          success: false,
          message:
            (error.response?.data as { message?: string } | undefined)?.message ??
            "Gagal memperbarui buku.",
        },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const id = parseBookId(rawId);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID buku tidak valid.",
        },
        { status: 400 },
      );
    }

    const authorization = request.headers.get("authorization")?.trim();
    if (!authorization) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization token wajib diisi.",
        },
        { status: 401 },
      );
    }

    const baseUrl = getApiBaseUrl();
    if (!baseUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "BASE_URL_API_LIBRARY belum dikonfigurasi.",
        },
        { status: 500 },
      );
    }

    const response = await axios.delete(`${baseUrl}/books/${id}`, {
      headers: {
        Accept: "*/*",
        Authorization: authorization,
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          success: false,
          message:
            (error.response?.data as { message?: string } | undefined)?.message ??
            "Gagal menghapus buku.",
        },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 },
    );
  }
}
