import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.userAccount.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "No account found with this email" }, { status: 404 });
    }

    const hashedPassword = Buffer.from(password).toString("base64");
    if (user.password !== hashedPassword) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
