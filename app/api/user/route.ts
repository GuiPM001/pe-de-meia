import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "../db/mongodb";
import { User } from "../models/user";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { name, email, password, savingTarget } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Preencha todos os campos para concluir o cadastro.' }, { status: 400 })
        }

        
        await connectMongo();
        
        const existeUser = await User.findOne({ email });
        
        if (existeUser) {
            return NextResponse.json({ message: 'Email já cadastrado' }, { status: 400 });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            savingTarget
        });

        return NextResponse.json({ message: 'Usuário criado com sucesso' }, { status: 201 });

    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
    }
}