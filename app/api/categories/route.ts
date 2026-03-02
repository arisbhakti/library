import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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

    const url = `${baseUrl.replace(/\/+$/, "")}/categories`;
    const response = await axios.get(url);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          success: false,
          message:
            (error.response?.data as { message?: string } | undefined)?.message ??
            "Gagal memuat categories.",
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
