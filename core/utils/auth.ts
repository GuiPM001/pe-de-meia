import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import jwt, { JwtPayload } from "jsonwebtoken";
import { authOptions } from "@/lib/authOptions";

export const getAuthenticatedUserId = async (
  request: NextRequest,
): Promise<string | null> => {
  const authorization = request.headers.get("authorization");

  if (authorization) {
    const [scheme, token] = authorization.split(" ");
    const secret = process.env.API_TOKEN_SECRET;
    if (scheme !== "Bearer" || !token || !secret) return null;

    try {
      const payload = jwt.verify(token, secret, {
        algorithms: ["HS256"],
        issuer: "pe-de-meia",
        audience: "pe-de-meia-api",
      }) as JwtPayload;

      return typeof payload.sub === "string" ? payload.sub : null;
    } catch {
      return null;
    }
  }

  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
};
