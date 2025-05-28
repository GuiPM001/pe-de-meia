import { transactionService } from "@/core/services/transaction.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const profileRequest = await request.json();

    const newTransaction = await transactionService.registerTransaction(profileRequest);

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const jsonRequest = await request.json();

    await transactionService.deleteTransaction(
      jsonRequest.transactions,
      jsonRequest.deleteRecurrent
    );

    return NextResponse.json(
      { message: "Transação excluida com sucesso." },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
