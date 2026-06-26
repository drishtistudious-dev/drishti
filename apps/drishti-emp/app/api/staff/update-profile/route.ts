import { NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_super_secret_drishti_key_123");

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, SECRET);
    const oldPhone = payload.phone as string;
    const role = payload.role as string;

    const { name, email, phone, password } = await request.json();

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
      }
      updateData.password = password;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    // Check if email is already taken
    if (email) {
      const existingEmail = await prisma.staff.findFirst({
        where: { email, NOT: { phone: oldPhone } }
      });
      if (existingEmail) {
        return NextResponse.json({ error: "Email is already in use" }, { status: 400 });
      }
    }

    // Check if phone number is already taken
    if (phone) {
      const existingPhone = await prisma.staff.findFirst({
        where: { phone, NOT: { phone: oldPhone } }
      });
      if (existingPhone) {
        return NextResponse.json({ error: "Phone number is already in use" }, { status: 400 });
      }
    }

    const staff = await prisma.staff.update({
      where: { phone: oldPhone },
      data: updateData
    });

    // If phone number was changed, we need to issue a new cookie
    if (phone && phone !== oldPhone) {
      const jwt = await new SignJWT({ phone, role })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(SECRET);

      cookieStore.set({
        name: "admin_session",
        value: jwt,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
    }

    return NextResponse.json({ success: true, staff: { name: staff.name, email: staff.email, phone: staff.phone } });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
