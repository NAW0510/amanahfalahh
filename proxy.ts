import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

function getDashboardForRole(role: string): string {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard"
    case "PKM":
      return "/pkm/dashboard"
    case "DONATUR":
      return "/donatur/transparansi"
    default:
      return "/login"
  }
}

export const proxy = auth(async (req) => {
  const session = req.auth
  const { pathname } = req.nextUrl

  // Public route: login
  if (pathname === "/login") {
    if (session) {
      return NextResponse.redirect(
        new URL(getDashboardForRole(session.user.role), req.url)
      )
    }
    return NextResponse.next()
  }

  // All other routes require authentication
  // Homepage publik
  if (pathname === "/") {
    return NextResponse.next()
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }


  const role = session.user.role

  // /admin/* — ADMIN only
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(
      new URL(getDashboardForRole(role), req.url)
    )
  }

  // /pkm/* — ADMIN + PKM
  if (
    pathname.startsWith("/pkm") &&
    !["ADMIN", "PKM"].includes(role)
  ) {
    return NextResponse.redirect(
      new URL(getDashboardForRole(role), req.url)
    )
  }

  // /donatur/* — all authenticated users allowed

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..+$).*)"],
}
