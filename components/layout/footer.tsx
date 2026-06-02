import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t-2 border-foreground bg-foreground py-10 text-background">
      <div className="container grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <div>
          <p className="font-display text-4xl font-black uppercase md:text-6xl">Build the next growth story.</p>
          <p className="mt-4 max-w-xl text-background/75">
            Social media marketing, community growth, content strategy, and sales-aligned lead systems.
          </p>
        </div>
        <div className="grid gap-3 text-sm">
          <Link className="inline-flex items-center gap-2 hover:text-primary" href={`mailto:${siteConfig.email}`}>
            <Mail size={16} /> {siteConfig.email} <ArrowUpRight size={14} />
          </Link>
          <Link className="inline-flex items-center gap-2 hover:text-primary" href={`tel:${siteConfig.phone}`}>
            <Phone size={16} /> {siteConfig.phone}
          </Link>
          <span className="inline-flex items-center gap-2">
            <MapPin size={16} /> {siteConfig.location}
          </span>
          <p className="pt-4 text-background/55">Designed for recruiters, founders, and teams who care about growth.</p>
        </div>
      </div>
    </footer>
  );
}
