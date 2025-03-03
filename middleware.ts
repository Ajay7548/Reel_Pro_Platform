import { log } from "console";
import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware() {
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl
                console.log(pathname);
                //allow auth related routes or url
                if (pathname.startsWith("/api/auth") ||
                    pathname === "/login" ||
                    pathname === "/register") {
                    return true
                }
                //public path 
                if (pathname === "/" || pathname.startsWith("/api/video")) { return true }

                return !!token
            }
        }
    }
)

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|publuc/).*"]
}