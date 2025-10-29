import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.set("authToken", "", {
    httpOnly: true,
    secure: false,
    path: "/",
    sameSite: "strict",
    expires: new Date(0),
  });

  cookieStore.set("userId", "", {
    httpOnly: true,
    secure: false,
    path: "/",
    sameSite: "strict",
    expires: new Date(0),
  });

  return NextResponse.json({ status: 200 });
}
