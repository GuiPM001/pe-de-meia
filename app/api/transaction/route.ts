import { transactionService } from "@/core/services/transaction.service";
import { getRequestLocale } from "@/core/utils/locale";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const idUser = session?.user?.id;
    if (!idUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const jsonRequest = await request.json();
    jsonRequest.idUser = idUser;

    const newTransaction = await transactionService.registerTransaction(
      jsonRequest,
      getRequestLocale(request)
    );

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const idUser = session?.user?.id;
    if (!idUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const jsonRequest = await request.json();
    jsonRequest.transactions = jsonRequest.transactions.map((transaction: object) => ({
      ...transaction,
      idUser,
    }));

    await transactionService.deleteTransaction(
      jsonRequest.transactions,
      jsonRequest.deleteRecurrent
    );

    return NextResponse.json(
      { message: "Transação excluida com sucesso." },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const idUser = session?.user?.id;
    if (!idUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const jsonRequest = await request.json();
    jsonRequest.idUser = idUser;

    const updatedTransaction = await transactionService.updateTransaction(
      jsonRequest, getRequestLocale(request)
    );

    return NextResponse.json(updatedTransaction, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
