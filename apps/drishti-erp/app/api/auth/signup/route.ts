import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    if (email.toLowerCase().trim() === "drishtistudios@gmail.com") {
      return NextResponse.json({ error: "This email address is reserved for administrative use." }, { status: 403 });
    }

    const existing = await prisma.userAccount.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    // Simple base64 "hash" — in production use bcrypt
    const hashedPassword = Buffer.from(password).toString("base64");

    const user = await prisma.userAccount.create({
      data: { name, email, phone: phone || null, password: hashedPassword },
    });

    // Ensure the user also appears in the Client section (Customer table)
    const existingCustomer = await prisma.customer.findFirst({ where: { email } });
    if (!existingCustomer) {
      await prisma.customer.create({
        data: { name, email, phone: phone || null },
      });
    }

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
