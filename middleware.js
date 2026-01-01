
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key-change-this";
const key = new TextEncoder().encode(SECRET_KEY);

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
        const token = request.cookies.get("admin_token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        try {
            await jwtVerify(token, key);
            return NextResponse.next();
        } catch (e) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    // Auto-redirect to dashboard if accessing login page while already logged in
    if (path === "/admin/login") {
        const token = request.cookies.get("admin_token")?.value;
        if (token) {
            try {
                await jwtVerify(token, key);
                return NextResponse.redirect(new URL("/admin/dashboard", request.url));
            } catch (e) {
                // Token invalid, let them stay on login page
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
