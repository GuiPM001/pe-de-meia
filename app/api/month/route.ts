import { NextRequest, NextResponse } from "next/server";
import { monthService } from "@/core/services/month.service";

export async function POST(request: NextRequest) {
  try {
    const monthRequest = await request.json();

    await monthService.saveMonth(monthRequest);

    return NextResponse.json(
      { message: "Mês cadastrado com sucesso" },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
