import axios from "axios";
import { NextResponse } from "next/server";

type CreateReviewBody = {
  bookId?: unknown;
  star?: unknown;
  comment?: unknown;
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

    const body = (await request.json()) as CreateReviewBody;
    const bookId = Number(body.bookId);
    const star = Number(body.star);
    const comment = typeof body.comment === "string" ? body.comment.trim() : "";

    if (!Number.isInteger(bookId) || bookId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "bookId wajib berupa angka lebih dari 0.",
        },
        { status: 400 },
      );
    }

    if (!Number.isInteger(star) || star < 1 || star > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "star wajib berupa angka 1 sampai 5.",
        },
        { status: 400 },
      );
    }

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          message: "comment wajib diisi.",
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

    const url = `${baseUrl.replace(/\/+$/, "")}/reviews`;
    const response = await axios.post(
      url,
      {
        bookId,
        star,
        comment,
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
            "Gagal menyimpan review.",
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
