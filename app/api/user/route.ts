import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/core/services/user.service";
import { getRequestLocale } from "@/core/utils/locale";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || '';
    
    const user = await userService.getByEmail(email);

    return NextResponse.json(user, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updateRequest = await request.json();

    await userService.update(updateRequest);

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const registerRequest = await request.json();

    const userId = await userService.create(registerRequest, getRequestLocale(request));

    return NextResponse.json(userId, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}