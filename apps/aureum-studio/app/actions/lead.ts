"use server";

import { prisma } from "@/lib/prisma";

export async function createLead(formData: {
  name: string;
  email: string;
  project: string;
  message: string;
}) {
  try {
    const lead = await prisma.lead.create({
      data: {
        name: formData.name,
        email: formData.email,
        source: "Website",
        status: "New",
        notes: `Project Type: ${formData.project}\n\nVision: ${formData.message}`,
      },
    });

    return { success: true, lead };
  } catch (error) {
    console.error("Error creating lead:", error);
    return { success: false, error: "Failed to submit your enquiry." };
  }
}

type LeadFormState = { success: boolean; error: string };

export async function submitLead(
  _prevState: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { success: false, error: "Please fill in all required fields." };
  }

  const result = await createLead({
    name,
    email,
    project: "Website enquiry",
    message,
  });

  if (result.success) {
    return { success: true, error: "" };
  }

  return {
    success: false,
    error: result.error ?? "Failed to submit your enquiry.",
  };
}
