import axios from "axios";
import { NextResponse } from "next/server";

type AddCartItemBody = {
  bookId?: unknown;
};

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

    const body = (await request.json()) as AddCartItemBody;
    const rawBookId = Number(body.bookId);
    const bookId = Number.isInteger(rawBookId) && rawBookId > 0 ? rawBookId : null;

    if (!bookId) {
      return NextResponse.json(
        {
          success: false,
          message: "bookId wajib berupa angka lebih dari 0.",
        },
        { status: 400 },
      );
    }

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

    const url = `${baseUrl.replace(/\/+$/, "")}/cart/items`;
    const response = await axios.post(
      url,
      {
        bookId,
      },
      {
        headers: {
          Accept: "*/*",
          Authorization: authorization,
          "Content-Type": "application/json",
        },
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          success: false,
          message:
            (error.response?.data as { message?: string } | undefined)?.message ??
            "Gagal menambahkan buku ke cart.",
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
