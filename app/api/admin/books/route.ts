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

function parseStatus(value: string | null):
  | "all"
  | "available"
  | "borrowed"
  | "returned" {
  if (value === "available" || value === "borrowed" || value === "returned") {
    return value;
  }

  return "all";
}

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || undefined;
    const status = parseStatus(searchParams.get("status"));
    const page = parsePositiveInteger(searchParams.get("page"), 1);
    const limit = parsePositiveInteger(searchParams.get("limit"), 4);

    const baseUrl = process.env.BASE_URL_API_LIBRARY;

    if (!baseUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "BASE_URL_API_LIBRARY belum dikonfigurasi.",
        },
        { status: 500 },
      );
    }

    const url = `${baseUrl.replace(/\/+$/, "")}/admin/books`;
    const response = await axios.get(url, {
      headers: {
        Accept: "*/*",
        Authorization: authorization,
      },
      params: {
        ...(q ? { q } : {}),
        status,
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
            "Gagal memuat daftar buku admin.",
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
