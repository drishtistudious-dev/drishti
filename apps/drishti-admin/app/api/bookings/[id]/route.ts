import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    if (!status) return NextResponse.json({ error: "Missing status" }, { status: 400 });

    const updated = await prisma.booking.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error("Booking update error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
