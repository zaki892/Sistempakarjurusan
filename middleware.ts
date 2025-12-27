import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this-in-production")

const publicRoutes = ["/login", "/"]
const roleRoutes = {
  siswa: ["/siswa"],
  guru: ["/guru"],
  kepala_sekolah: ["/kepala-sekolah"],
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const verified = await jwtVerify(token, secret)
    const role = verified.payload.role as string

    // Check if user has access to the route
    for (const [userRole, routes] of Object.entries(roleRoutes)) {
      if (role === userRole) {
        for (const route of routes) {
          if (pathname.startsWith(route)) {
            return NextResponse.next()
          }
        }
      }
    }

    // If no matching route, redirect to home
    return NextResponse.redirect(new URL("/", request.url))
  } catch {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
