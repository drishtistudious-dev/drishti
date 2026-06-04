import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json();
    if (!status) return NextResponse.json({ error: "Missing status" }, { status: 400 });

    const updated = await prisma.lead.update({
      where: { id: params.id },
      data: { status }
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error("Lead update error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
