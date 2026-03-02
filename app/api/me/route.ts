import axios from "axios";
import { NextResponse } from "next/server";

type ErrorResponseBody = {
  message?: string;
};

function getApiBaseUrl() {
  const baseUrl = process.env.BASE_URL_API_LIBRARY;

  if (!baseUrl) {
    throw new Error("BASE_URL_API_LIBRARY belum dikonfigurasi.");
  }

  return baseUrl.replace(/\/+$/, "");
}

function getAuthorizationHeader(request: Request): string | null {
  const authorization = request.headers.get("authorization")?.trim();
  return authorization || null;
}

export async function GET(request: Request) {
  try {
    const authorization = getAuthorizationHeader(request);

    if (!authorization) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization token wajib diisi.",
        },
        { status: 401 },
      );
    }

    const response = await axios.get(`${getApiBaseUrl()}/me`, {
      headers: {
        Accept: "*/*",
        Authorization: authorization,
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseBody = error.response?.data as ErrorResponseBody | undefined;

      return NextResponse.json(
        {
          success: false,
          message: responseBody?.message ?? "Gagal memuat profile.",
        },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan pada server.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const authorization = getAuthorizationHeader(request);

    if (!authorization) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization token wajib diisi.",
        },
        { status: 401 },
      );
    }

    const incomingFormData = await request.formData();
    const name = incomingFormData.get("name");
    const phone = incomingFormData.get("phone");
    const profilePhoto = incomingFormData.get("profilePhoto");

    const forwardedFormData = new FormData();

    if (typeof name === "string" && name.trim()) {
      forwardedFormData.append("name", name.trim());
    }

    if (typeof phone === "string" && phone.trim()) {
      forwardedFormData.append("phone", phone.trim());
    }

    if (profilePhoto instanceof File && profilePhoto.size > 0) {
      forwardedFormData.append("profilePhoto", profilePhoto, profilePhoto.name);
    }

    if (
      !forwardedFormData.has("name") &&
      !forwardedFormData.has("phone") &&
      !forwardedFormData.has("profilePhoto")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Tidak ada data profile yang dikirim.",
        },
        { status: 400 },
      );
    }

    const response = await axios.patch(`${getApiBaseUrl()}/me`, forwardedFormData, {
      headers: {
        Accept: "*/*",
        Authorization: authorization,
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseBody = error.response?.data as ErrorResponseBody | undefined;

      return NextResponse.json(
        {
          success: false,
          message: responseBody?.message ?? "Gagal memperbarui profile.",
        },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan pada server.",
      },
      { status: 500 },
    );
  }
}
