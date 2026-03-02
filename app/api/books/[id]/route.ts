import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const idParam = Number(rawId);
    const id = Number.isInteger(idParam) && idParam > 0 ? idParam : null;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID buku tidak valid.",
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

    const url = `${baseUrl.replace(/\/+$/, "")}/books/${id}`;
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
