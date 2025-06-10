import { NextRequest, NextResponse } from "next/server";
import { monthService } from "@/core/services/month.service";
import { getRequestLocale } from "@/core/utils/locale";

export async function POST(request: NextRequest) {
  try {
    const monthRequest = await request.json();

    const month = await monthService.saveMonth(
      monthRequest,
      getRequestLocale(request)
    );

    return NextResponse.json(month, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
