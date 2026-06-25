import { ArrowUpRight, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t-2 border-foreground bg-foreground py-10 text-background">
      <div className="container grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <div>
          <p className="font-display text-3xl font-black uppercase sm:text-4xl md:text-6xl">Build the next growth story.</p>
          <p
            className="mt-4 max-w-xl font-display text-xl font-black uppercase tracking-widest sm:text-2xl"
            style={{
              background: "linear-gradient(90deg, #d4af37, #fff8dc, #f5c518, #d4af37, #fff8dc, #d4af37)",
              backgroundSize: "300% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 3s linear infinite",
            }}
          >
            ✦ Created by Hasnane Nawaz ✦
          </p>
          <style>{`
            @keyframes shimmer {
              0% { background-position: 0% center; }
              100% { background-position: 300% center; }
            }
          `}</style>
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
          <Link
            className="inline-flex items-center gap-2 hover:text-primary"
            href={siteConfig.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={16} /> LinkedIn <ArrowUpRight size={14} />
          </Link>
          <p className="pt-4 text-background/55">Designed for recruiters, founders, and teams who care about growth.</p>
        </div>
      </div>
    </footer>
  );
}
