import { connectMongo } from '../db/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { Months } from '../models/months';
import { User } from '../models/user';


export async function POST(request: NextRequest) {

    const { monthBalance, idUsuario, idMounth } = await request.json();

    if (!monthBalance || !idUsuario || !idMounth) {
        return NextResponse.json({ error: 'Todos os campos são obrigatorios.' }, { status: 400 })
    }

    try {

        await connectMongo();

        const user = await User.findOne({ idMounth });

        if (!user) {
            return NextResponse.json({ message: 'Usuário não encontrado para cadastrar o mes' }, { status: 404 });
        }

        await Months.create({ monthBalance, idUsuario, idMounth });


        return NextResponse.json({ message: 'Mes cadastrado com sucesso' }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
