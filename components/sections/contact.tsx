"use client";

import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/lib/site-config";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    const message = encodeURIComponent(String(payload.message));
    const subject = encodeURIComponent(`Portfolio inquiry from ${payload.name}`);
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${message}`;
    setStatus("sent");
    event.currentTarget.reset();
  }

  return (
    <section id="contact" className="section-pad">
      <div className="container grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <Reveal>
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="For growth roles, internships, freelance campaigns, and collaborations."
              copy="The fastest path is email or phone. The form validates the inquiry and opens a ready-to-send email."
            />
            <div className="mt-8 grid gap-3">
              <Link className="inline-flex items-center gap-3 font-bold hover:text-coral" href={`mailto:${siteConfig.email}`}>
                <Mail size={20} /> {siteConfig.email} <ArrowUpRight size={16} />
              </Link>
              <Link className="inline-flex items-center gap-3 font-bold hover:text-coral" href={`tel:${siteConfig.phone}`}>
                <Phone size={20} /> {siteConfig.phone}
              </Link>
              <span className="inline-flex items-center gap-3 font-bold">
                <MapPin size={20} /> {siteConfig.location}
              </span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="brutal-card grid gap-4 p-5 md:p-7">
            <label className="grid gap-2 font-black uppercase">
              Name
              <input
                className="border-2 border-foreground bg-background px-4 py-3 font-medium outline-none focus:bg-primary/20"
                name="name"
                minLength={2}
                required
                placeholder="Your name"
              />
            </label>
            <label className="grid gap-2 font-black uppercase">
              Email
              <input
                className="border-2 border-foreground bg-background px-4 py-3 font-medium outline-none focus:bg-primary/20"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </label>
            <label className="grid gap-2 font-black uppercase">
              Message
              <textarea
                className="min-h-36 resize-y border-2 border-foreground bg-background px-4 py-3 font-medium outline-none focus:bg-primary/20"
                name="message"
                minLength={10}
                required
                placeholder="Tell me about the role, campaign, or community you want to grow."
              />
            </label>
            <Button type="submit" size="lg" disabled={status === "sending"}>
              {status === "sending" ? "Preparing..." : "Send inquiry"} <ArrowUpRight size={18} />
            </Button>
            {status === "sent" ? <p className="text-sm font-bold">Email draft opened. Send it from your mail app.</p> : null}
            {status === "error" ? <p className="text-sm font-bold text-coral">Please check the details and try again.</p> : null}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
