import { transactionService } from "@/core/services/transaction.service";
import { getRequestLocale } from "@/core/utils/locale";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idMonth = searchParams.get("idMonth") || "";
    const idUser = searchParams.get("idUser") || "";

    const months = await transactionService.getTransactionsByMonthId(
      idMonth,
      idUser,
      getRequestLocale(request)
    );

    return NextResponse.json(months, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
