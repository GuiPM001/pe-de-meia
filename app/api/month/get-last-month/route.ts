import { monthService } from "@/core/services/month.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idUser = searchParams.get("idUser") || '';
    const actualIdMonth = searchParams.get("actualIdMonth") || '0';

    const months = await monthService.getLastMonth(actualIdMonth, idUser);

    return NextResponse.json(months, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}