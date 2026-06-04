import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    
    if (!phone) {
      return NextResponse.json({ error: "Phone number required" }, { status: 400 });
    }

    // Look up staff member by phone
    const staff = await prisma.staff.findUnique({
      where: { phone }
    });

    if (!staff) {
      return NextResponse.json({ error: "Access denied. Employee account not found." }, { status: 403 });
    }

    return NextResponse.json({ success: true, name: staff.name });
  } catch (error) {
    console.error("Role check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
