import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // 1. Fetch bookings for stats
    const bookings = await prisma.booking.findMany();
    
    const totalBookings = bookings.length;
    const pendingCount = bookings.filter(b => b.status === "Pending").length;
    const confirmedCount = bookings.filter(b => b.status === "Confirmed").length;
    const completedCount = bookings.filter(b => b.status === "Completed").length;
    
    // Revenue calculations
    const activeBookings = bookings.filter(b => b.status === "Confirmed" || b.status === "Completed");
    const totalRevenue = activeBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalReceived = activeBookings.reduce((sum, b) => sum + b.advancePaid, 0);
    const totalOutstanding = totalRevenue - totalReceived;

    // 2. Fetch all customers/clients
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" }
    });

    // 3. Fetch all staff members (excluding main admin account)
    const staff = await prisma.staff.findMany({
      where: {
        NOT: {
          email: "drishtistudios@gmail.com"
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      stats: {
        totalBookings,
        pendingCount,
        confirmedCount,
        completedCount,
        totalRevenue,
        totalReceived,
        totalOutstanding
      },
      customers,
      staff
    });
  } catch (err) {
    console.error("Admin data route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
