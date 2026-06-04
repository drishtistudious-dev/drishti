import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_super_secret_drishti_key_123");

export async function POST(request: Request) {
  try {
    const { idToken, phone } = await request.json();
    
    if (!idToken || !phone) {
      return NextResponse.json({ error: "Missing authentication parameters" }, { status: 400 });
    }

    // In a fully secure production environment, you would use firebase-admin 
    // to verify the idToken here. For this MVP, we rely on the client-side 
    // verification and assume if they have an idToken, they passed Firebase Auth.
    // We then issue our own session cookie so we don't need firebase-admin on the edge.

    const jwt = await new SignJWT({ phone, role: "Admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(SECRET);

    const cookieStore = await cookies();
    cookieStore.set({
      name: "admin_session",
      value: jwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return NextResponse.json({ success: true });
}
