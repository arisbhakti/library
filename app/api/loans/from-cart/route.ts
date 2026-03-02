import axios from "axios";
import { NextResponse } from "next/server";

type LoanFromCartBody = {
  itemIds?: unknown;
  days?: unknown;
  borrowDate?: unknown;
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

    const body = (await request.json()) as LoanFromCartBody;
    const itemIds = Array.isArray(body.itemIds)
      ? body.itemIds
          .map((itemId) => Number(itemId))
          .filter((itemId) => Number.isInteger(itemId) && itemId > 0)
      : [];
    const days = Number(body.days);
    const borrowDate = typeof body.borrowDate === "string" ? body.borrowDate : "";

    if (itemIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "itemIds wajib berisi minimal satu item.",
        },
        { status: 400 },
      );
    }

    if (!Number.isInteger(days) || days <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "days wajib berupa angka lebih dari 0.",
        },
        { status: 400 },
      );
    }

    if (!borrowDate) {
      return NextResponse.json(
        {
          success: false,
          message: "borrowDate wajib diisi.",
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

    const url = `${baseUrl.replace(/\/+$/, "")}/loans/from-cart`;
    const response = await axios.post(
      url,
      {
        itemIds,
        days,
        borrowDate,
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
            "Gagal memproses checkout.",
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
