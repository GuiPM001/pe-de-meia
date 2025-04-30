import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/core/services/user.service";

export async function POST(request: NextRequest) {
  try {
    const profileRequest = await request.json();

    await userService.register(profileRequest);

    return NextResponse.json(
      { message: "Usuário criado com sucesso" },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
