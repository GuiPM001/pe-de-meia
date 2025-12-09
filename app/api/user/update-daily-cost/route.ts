import { NextResponse } from "next/server";
import { userService } from "@/core/services/user.service";

export async function PUT() {
  try {
    await userService.updateDailyCost();

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}