import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/core/services/user.service";

export async function PUT(request: NextRequest) {
  try {
    const updateRequest = await request.json();

    await userService.update(updateRequest);

    return NextResponse.json(
      { message: "Usuário atualizado com sucesso." },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
