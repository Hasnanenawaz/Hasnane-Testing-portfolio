import { GraduationCap, Sparkles, Users } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const story = [
  {
    title: "The unusual advantage",
    copy: "Hasnane is pursuing BA LLB, but the marketing track became the arena: research, persuasion, audience psychology, and consistent execution all turned into practical growth skills.",
    icon: GraduationCap,
  },
  {
    title: "From posts to systems",
    copy: "The work is not just posting content. It is building repeatable systems around audience intent, channel positioning, lead capture, caller coordination, and conversion follow-through.",
    icon: Sparkles,
  },
  {
    title: "Community as a business asset",
    copy: "Across Telegram, WhatsApp, Facebook, and legal education communities, the pattern is clear: grow trust first, then turn attention into pipeline.",
    icon: Users,
  },
];

export function About() {
  return (
    <section id="about" className="section-pad">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow="About"
            title="A marketer who thinks like a researcher and executes like an operator."
            copy="The portfolio narrative is built around measurable community growth, sales alignment, and content-led trust."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {story.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <article className="brutal-card h-full p-6">
                <item.icon className="mb-8 h-10 w-10" />
                <h3 className="font-display text-2xl font-black uppercase">{item.title}</h3>
                <p className="mt-4 leading-7 text-muted-foreground">{item.copy}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
