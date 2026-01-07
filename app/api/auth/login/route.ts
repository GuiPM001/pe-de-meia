import { NextResponse } from "next/server";
import { getRequestLocale } from "@/core/utils/locale";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { LoginRequest } from "@/core/types/LoginRequest";
import { LoginResponse } from "@/core/types/LoginResponse";
import { authService } from "@/core/services/authService";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const loginRequest: LoginRequest = await request.json();

    const loginResponse: LoginResponse = await authService.login(
      loginRequest,
      getRequestLocale(request)
    );

    const cookieStore = await cookies();
    await saveCookie(cookieStore, "authToken", loginResponse.token);
    await saveCookie(cookieStore, "profile", JSON.stringify(loginResponse.user));

    return NextResponse.json(loginResponse, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

const saveCookie = async (
  cookieStore: ReadonlyRequestCookies,
  cookieName: string,
  cookieValue: string
) => {
  const maxAge = 365 * 24 * 60 * 60; // 365 days
  cookieStore.set({
    name: cookieName,
    value: cookieValue,
    httpOnly: true,
    secure: false,
    path: "/",
    sameSite: "strict",
    maxAge,
  });
};
