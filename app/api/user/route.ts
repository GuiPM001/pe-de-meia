import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/core/services/user.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const user = await userService.get(id!);

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