import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  topic: z.enum([
    "general",
    "provider",
    "partnership",
    "affiliate",
    "billing",
    "technical",
  ]),
  message: z.string().trim().min(10).max(3000),
  consent: z.literal(true),
});

const topicLabels: Record<string, string> = {
  general: "General question",
  provider: "Provider Network",
  partnership: "Church / community partnership",
  affiliate: "Affiliate program",
  billing: "Billing support",
  technical: "Technical support",
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Unable to send your message right now. Please try again." },
        { status: 502 }
      );
    }

    const body = await request.json();
    const input = schema.parse(body);

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL!,
      to: [process.env.CONTACT_TO_EMAIL!],
      replyTo: input.email,
      subject: `[Soul Care Contact] ${topicLabels[input.topic]}: ${input.name}`,
      text: [
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        `Topic: ${topicLabels[input.topic]}`,
        ``,
        input.message,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Unable to send your message right now. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Please complete every required field correctly." },
      { status: 400 }
    );
  }
}
