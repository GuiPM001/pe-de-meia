import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const PUBLIC_ROUTES = ["/login", "/register"] as const;
const REDIRECT_LOGIN = "/login";
const SUPPORTED_LOCALES = ["en", "pt"];

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = REDIRECT_LOGIN;
  return NextResponse.redirect(url);
}

function detectLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language");
  const preferredLang = header?.split(",")[0].split("-")[0];
  return SUPPORTED_LOCALES.includes(preferredLang!) ? preferredLang! : "en";
}

function getCurrentLocale(pathname: string): string | null {
  const match = pathname.match(/^\/(en|pt)/);
  return match ? match[1] : null;
}

function isPublicRoute(pathname: string): boolean {
  const cleanedPath = pathname.replace(/^\/(en|pt)/, "");
  return PUBLIC_ROUTES.includes(cleanedPath as (typeof PUBLIC_ROUTES)[number]);
}

function isTokenExpired(token: string): boolean {
  const decoded = jwtDecode<{ exp?: number }>(token);
  const now = Math.floor(Date.now() / 1000);
  return !!decoded.exp && decoded.exp < now;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authToken");
  const currentLocale = getCurrentLocale(pathname);

  if (!currentLocale) {
    const locale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  const isPublic = isPublicRoute(pathname);

  if (!token && isPublic) return NextResponse.next();

  if (!token && !isPublic) return redirectToLogin(request);

  if (token && isPublic) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${currentLocale}`;
    return NextResponse.redirect(redirectUrl);
  }

  if (token && isTokenExpired(token.value)) {
    const response = redirectToLogin(request);
    response.cookies.set("authToken", "", {
      path: "/",
      maxAge: 0,
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|sitemap.xml|robots.txt).*)",
  ],
};
