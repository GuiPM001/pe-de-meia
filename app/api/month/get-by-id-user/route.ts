import { monthService } from "@/core/services/month.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idUser = searchParams.get("idUser");

    const months = await monthService.getMonthsByIdUser(idUser!);

    return NextResponse.json(months, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}