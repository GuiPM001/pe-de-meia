import { monthService } from "@/core/services/month.service";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const monthRequest = await request.json();

    await monthService.updateBalance(monthRequest);

    return NextResponse.json({ status: 204 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
