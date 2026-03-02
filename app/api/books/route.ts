import axios from "axios";
import { NextResponse } from "next/server";

function parsePositiveInteger(value: string | null, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function getBaseUrl() {
  return process.env.BASE_URL_API_LIBRARY;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q")?.trim() || undefined;
    const categoryId = parsePositiveInteger(searchParams.get("categoryId"), 0);
    const minRating = parsePositiveInteger(searchParams.get("minRating"), 0);
    const page = parsePositiveInteger(searchParams.get("page"), 1);
    const limit = parsePositiveInteger(searchParams.get("limit"), 8);

    const baseUrl = getBaseUrl();

    if (!baseUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "BASE_URL_API_LIBRARY belum dikonfigurasi.",
        },
        { status: 500 },
      );
    }

    const url = `${baseUrl.replace(/\/+$/, "")}/books`;
    const response = await axios.get(url, {
      params: {
        ...(q ? { q } : {}),
        ...(categoryId > 0 ? { categoryId } : {}),
        ...(minRating > 0 ? { minRating } : {}),
        page,
        limit,
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
            "Gagal memuat daftar buku.",
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

export async function POST(request: Request) {
  try {
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

    const baseUrl = getBaseUrl();

    if (!baseUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "BASE_URL_API_LIBRARY belum dikonfigurasi.",
        },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const url = `${baseUrl.replace(/\/+$/, "")}/books`;
    const response = await axios.post(url, formData, {
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
            "Gagal menambahkan buku.",
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
