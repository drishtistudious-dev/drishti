import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, role, password } = await req.json();

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    // Must start with + for OTP validation in crew portal
    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+" + formattedPhone;
    }

    const existingStaff = await prisma.staff.findFirst({
      where: { phone: formattedPhone },
    });

    if (existingStaff) {
      return NextResponse.json({ error: "Staff member with this phone number already exists." }, { status: 409 });
    }

    const staff = await prisma.staff.create({
      data: {
        name,
        email: email || `${formattedPhone.replace("+", "")}@drishtistudios.in`, // Fallback email since it's @unique
        phone: formattedPhone,
        role: role || "Staff",
        designation: "Crew",
        password: password || "otp_only_account", // Used for Crew Portal Email flow
      },
    });

    return NextResponse.json({ staff });
  } catch (error) {
    console.error("Error creating staff:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
