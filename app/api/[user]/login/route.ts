import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectMongo } from '@/core/db/mongodb';
import { User } from '@/core/models/user';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email e senha obrigatórios' }, { status: 400 });
    }

    await connectMongo();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ message: 'Senha incorreta' }, { status: 401 });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email, name: user.name, savingTarget: user.savingTarget },
      //process.env.JWT_SECRET!,
      'seuSegredoSuperSecretoAqui123',
      { expiresIn: '1h' }
    );

    return NextResponse.json({ token, user }, { status: 200 });

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}
