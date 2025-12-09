import { NextResponse } from "next/server";
import { monthService } from "@/core/services/month.service";

export async function POST() {
  try {
    await monthService.removeDailyCost();

    return NextResponse.json({ status: 204 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
