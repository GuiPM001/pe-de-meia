import { NextRequest, NextResponse } from "next/server";
import { monthService } from "@/core/services/month.service";
import { getRequestLocale } from "@/core/utils/locale";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const idUser = session?.user?.id;

    if (!idUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const months = await monthService.getMonthsByIdUser(idUser);

    return NextResponse.json(months, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

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
