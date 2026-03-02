import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(request: NextRequest, context: RouteContext) {
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

    const { id: rawId } = await context.params;
    const idParam = Number(rawId);
    const id = Number.isInteger(idParam) && idParam > 0 ? idParam : null;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID cart item tidak valid.",
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

    const url = `${baseUrl.replace(/\/+$/, "")}/cart/items/${id}`;
    const response = await axios.delete(url, {
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
            "Gagal menghapus buku dari cart.",
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
