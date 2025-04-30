import { connectMongo } from '@/core/db/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { Months } from '@/core/models/months';
import { User } from '@/core/models/user';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    const { monthBalance, idUser, idMonth } = await request.json();

    if (!monthBalance || !idUser || !idMonth) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    await connectMongo();

    const existeUser = await User.findOne({ _id: new mongoose.Types.ObjectId(idUser) });
    if (!existeUser) {
      return NextResponse.json({ error: 'É necessario um usuario cadastrado para cadastrar um mes' }, { status: 400 });
    }

    const mesCadastrado = await Months.findOne({idMonth});

    if (mesCadastrado) {
      return NextResponse.json({ error: 'Mês ja cadastrado para usuario.' }, { status: 400 })
    }

    await Months.create({
      monthBalance,
      idUser,
      idMonth,
    });

    return NextResponse.json({ message: 'Mês cadastrado com sucesso' }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno ao cadastrar o mês.' }, { status: 500 });
  }
}
