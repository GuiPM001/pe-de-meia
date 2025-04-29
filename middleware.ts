import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const routes = [
  { path: "/login", whenAuthenticated: "redirect" },
  { path: "/register", whenAuthenticated: "redirect" },
  { path: "/home", whenAuthenticated: "next" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login";

function redirectToLogin(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
  return NextResponse.redirect(redirectUrl);
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = routes.find((route) => route.path === path);
  const token = request.cookies.get("authToken");

  if (!token && publicRoute) {
    return NextResponse.next();
  }

  if (!token && !publicRoute) {
    return redirectToLogin(request);
  }

  if (token && publicRoute && publicRoute.whenAuthenticated === "redirect") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  if (token && !publicRoute) {
    const decoded = jwtDecode(token.value);
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp < now) {
      const response = redirectToLogin(request);

      response.cookies.set("authToken", "", {
        path: "/",
        maxAge: 0,
      });

      return response;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
