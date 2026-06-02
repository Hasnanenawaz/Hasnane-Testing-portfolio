"use client";

import { ArrowDown, ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { metrics } from "@/lib/portfolio-data";
import { siteConfig } from "@/lib/site-config";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 md:pt-32">
      <div className="container grid min-h-[calc(100vh-4rem)] gap-10 pb-16 md:grid-cols-[1.12fr_0.88fr] md:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-6 inline-flex border-2 border-foreground bg-cyan px-4 py-2 font-black uppercase shadow-brutal-sm"
          >
            Social Media Marketer | Content & Growth
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="font-display text-6xl font-black uppercase leading-[0.88] text-balance md:text-8xl lg:text-9xl"
          >
            Hasnane Nawaz
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl"
          >
            I turn scattered attention into structured communities, qualified leads, and measurable growth. My edge is
            simple: content instincts, sales discipline, and the research mindset of a law student.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <MagneticButton asChild size="lg">
              <Link href="#projects">
                View growth cases <ArrowDown size={18} />
              </Link>
            </MagneticButton>
            <MagneticButton asChild size="lg" variant="secondary">
              <Link href={`mailto:${siteConfig.email}`}>
                Hire Hasnane <Mail size={18} />
              </Link>
            </MagneticButton>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, rotate: 2, y: 20 }}
          animate={{ opacity: 1, rotate: -1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="brutal-card relative bg-primary p-5 md:p-7"
        >
          <div className="absolute -right-4 -top-4 border-2 border-foreground bg-coral px-4 py-2 font-display font-black uppercase shadow-brutal-sm">
            2.5+ yrs
          </div>
          <div className="border-2 border-foreground bg-background p-5">
            <p className="font-display text-2xl font-black uppercase">Growth operator profile</p>
            <div className="mt-6 grid gap-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between border-b-2 border-foreground pb-3">
                  <span className="font-display text-4xl font-black">{metric.value}</span>
                  <span className="max-w-32 text-right text-sm font-bold uppercase">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
          <Link
            href="#contact"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 border-2 border-foreground bg-foreground px-5 py-4 font-black uppercase text-background"
          >
            Start a conversation <ArrowUpRight size={18} />
          </Link>
        </motion.div>
      </div>
      <div className="border-y-2 border-foreground bg-foreground py-3 text-background">
        <div className="flex w-[200%] animate-marquee gap-8 font-display text-xl font-black uppercase">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex min-w-1/2 gap-8">
              <span>Community Growth</span>
              <span>Lead Generation</span>
              <span>Meta Ads</span>
              <span>Content Strategy</span>
              <span>Sales Alignment</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
