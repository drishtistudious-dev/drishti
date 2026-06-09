import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    const body = await req.json();
    const { status, totalAmount, advancePaid, equipmentNeeded } = body;

    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Update fields
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (totalAmount !== undefined) updateData.totalAmount = parseFloat(totalAmount);
    if (advancePaid !== undefined) updateData.advancePaid = parseFloat(advancePaid);
    if (equipmentNeeded !== undefined) updateData.equipmentNeeded = equipmentNeeded;

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData
    });

    return NextResponse.json({ booking: updatedBooking });
  } catch (err) {
    console.error("Booking PUT error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    
    await prisma.booking.delete({
      where: { id: bookingId }
    });
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Booking DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
