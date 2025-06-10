import { NextResponse } from "next/server";
import { userService } from "@/core/services/user.service";
import { getRequestLocale } from "@/core/utils/locale";

export async function POST(request: Request) {
  try {
    const loginRequest = await request.json();

    const loginResponse = await userService.login(loginRequest, getRequestLocale(request));

    return NextResponse.json(loginResponse, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
