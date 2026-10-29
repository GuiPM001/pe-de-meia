import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = process.env.API_TOKEN_SECRET;
    if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
      return NextResponse.json(
        { message: "API_TOKEN_SECRET must contain at least 32 bytes" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { email: session.user.email, name: session.user.name },
      secret,
      {
        algorithm: "HS256",
        subject: session.user.id,
        issuer: "pe-de-meia",
        audience: "pe-de-meia-api",
      }
    );

    return NextResponse.json({ token }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
