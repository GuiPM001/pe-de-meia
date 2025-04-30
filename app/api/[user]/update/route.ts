import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/core/db/mongodb";
import { User } from "@/core/models/user";

export async function PUT(request: NextRequest) {
  try {
    const { _id, name, savingTarget } = await request.json();

    await connectMongo();

    const user = await User.findById(_id);

    user.name = name;
    user.savingTarget = savingTarget;

    await user.save();

    return NextResponse.json(
      { message: "Usuário atualizado com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro interno." }, { status: 500 });
  }
}
