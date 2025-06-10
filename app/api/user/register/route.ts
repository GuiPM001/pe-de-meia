import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/core/services/user.service";
import { getRequestLocale } from "@/core/utils/locale";

export async function POST(request: NextRequest) {
  try {
    const profileRequest = await request.json();

    await userService.register(profileRequest, getRequestLocale(request));

    return NextResponse.json({ status: 201 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
