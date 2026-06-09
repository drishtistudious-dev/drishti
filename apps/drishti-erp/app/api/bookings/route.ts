import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const blocked = searchParams.get("blocked");
    const all = searchParams.get("all");
    const staffEmail = searchParams.get("staffEmail");

    if (blocked === "true") {
      const bookings = await prisma.booking.findMany({
        where: {
          status: {
            in: ["Confirmed", "Completed"]
          }
        },
        orderBy: { startDate: "asc" }
      });
      return NextResponse.json({ bookings });
    }

    if (all === "true") {
      const bookings = await prisma.booking.findMany({
        include: { customer: true },
        orderBy: { startDate: "desc" }
      });
      return NextResponse.json({ bookings });
    }

    if (staffEmail) {
      const staff = await prisma.staff.findFirst({
        where: { email: staffEmail }
      });
      if (!staff) return NextResponse.json({ bookings: [] });

      const assignments = await prisma.assignment.findMany({
        where: { staffId: staff.id },
        include: {
          booking: {
            include: { customer: true }
          }
        },
        orderBy: { booking: { startDate: "desc" } }
      });
      const bookings = assignments.map(a => a.booking);
      return NextResponse.json({ bookings });
    }

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    // Find customer by email via UserAccount
    const userAccount = await prisma.userAccount.findUnique({ where: { email } });
    if (!userAccount) return NextResponse.json({ bookings: [] });

    // Find customer record
    const customer = await prisma.customer.findFirst({
      where: { email },
    });

    if (!customer) return NextResponse.json({ bookings: [] });

    const bookings = await prisma.booking.findMany({
      where: { customerId: customer.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings, customer });
  } catch (err) {
    console.error("Bookings GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, phone, type, startDate, endDate, equipmentNeeded, totalAmount, advancePaid } = body;

    if (!email || !type || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ensure customer exists (upsert by email)
    let customer = await prisma.customer.findFirst({ where: { email } });
    if (!customer) {
      customer = await prisma.customer.create({
        data: { name: name || "Portal User", email, phone: phone || null },
      });
    }

    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        equipmentNeeded: equipmentNeeded || null,
        totalAmount: totalAmount || 0,
        advancePaid: advancePaid || 0,
        status: "Pending",
      },
    });

    return NextResponse.json({ booking });
  } catch (err) {
    console.error("Booking POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
