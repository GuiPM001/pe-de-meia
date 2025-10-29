import { NextRequest, NextResponse } from "next/server";
import { getRequestLocale } from "@/core/utils/locale";
import { authService } from "@/core/services/authService";

export async function POST(request: NextRequest) {
  try {
    const profileRequest = await request.json();

    await authService.register(profileRequest, getRequestLocale(request));

    return NextResponse.json({ status: 201 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
