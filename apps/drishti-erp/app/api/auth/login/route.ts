import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // 1. Check if it is the restricted Admin account
    if (email === "drishtistudios@gmail.com") {
      const admin = await prisma.staff.findFirst({
        where: { email, role: "Admin" }
      });
      if (!admin) {
        return NextResponse.json({ error: "Admin account not found" }, { status: 404 });
      }
      if (admin.password !== password) {
        return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
      }
      return NextResponse.json({
        user: { id: admin.id, name: admin.name, email: admin.email, phone: admin.phone, role: "Admin" },
      });
    }

    // 2. Check if it is a Crew member (other staff accounts created by admin)
    const staff = await prisma.staff.findFirst({
      where: { email }
    });
    if (staff) {
      if (staff.password !== password) {
        return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
      }
      return NextResponse.json({
        user: { id: staff.id, name: staff.name, email: staff.email, phone: staff.phone, role: "Crew" },
      });
    }

    // 3. Normal Client check
    const user = await prisma.userAccount.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "No account found with this email" }, { status: 404 });
    }

    const hashedPassword = Buffer.from(password).toString("base64");
    if (user.password !== hashedPassword) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: "Client" },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
