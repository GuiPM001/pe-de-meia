import { transactionService } from "@/core/services/transaction.service";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
   const { searchParams } = new URL(request.url);
    const idTransaction = searchParams.get("idTransaction") || "";

    await transactionService.deleteTransaction(idTransaction);

    return NextResponse.json(
      { message: "Transação excluida com sucesso." },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
