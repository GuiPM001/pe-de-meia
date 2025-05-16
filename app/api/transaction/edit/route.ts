import { transactionService } from "@/core/services/transaction.service";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idTransaction = searchParams.get("idTransaction") || "";
    const transactionRequest = await request.json();

    await transactionService.updateTransaction(
      idTransaction,
      transactionRequest
    );

    return NextResponse.json(
      { message: "Transação atualizada com sucesso." },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
