import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/core/db/mongodb";
import { User } from "@/core/models/user";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await connectMongo();

    const user = await User.findById(id).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro interno." }, { status: 500 });
  }
}
