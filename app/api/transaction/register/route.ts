import { NextRequest, NextResponse } from "next/server";
import { transactionService } from "@/core/services/transaction.service";

export async function POST(request: NextRequest) {
  try {
    const profileRequest = await request.json();

    await transactionService.registerTransaction(profileRequest);

    return NextResponse.json(
      { message: "Transação registrada com sucesso." },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
