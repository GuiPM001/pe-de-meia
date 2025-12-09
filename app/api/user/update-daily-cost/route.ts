import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/core/services/user.service";

export async function PUT(request: NextRequest) {
  try {
    const { idUser } = await request.json();

    await userService.updateDailyCost(idUser);

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}