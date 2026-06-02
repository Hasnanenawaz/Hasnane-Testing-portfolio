import { NextResponse } from "next/server";
import { z } from "@/lib/zod-lite";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = contactSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ message: "Please check the form and try again." }, { status: 400 });
  }

  return NextResponse.json({
    message: "Thanks. Your message is ready to be routed to Hasnane.",
    data: result.data,
  });
}
