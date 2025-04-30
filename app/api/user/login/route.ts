import { NextResponse } from "next/server";
import { userService } from "@/core/services/user.service";

export async function POST(request: Request) {
  try {
    const loginRequest = await request.json();

    const loginResponse = await userService.login(loginRequest);

    return NextResponse.json(loginResponse, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
