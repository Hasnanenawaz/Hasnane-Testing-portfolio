import { achievements, metrics } from "@/lib/portfolio-data";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function Achievements() {
  return (
    <section className="section-pad">
      <div className="container">
        <Reveal>
          <SectionHeading eyebrow="Proof" title="Numbers that make the story recruiter-friendly." />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {metrics.map((metric, index) => (
            <Reveal key={metric.label} delay={index * 0.05}>
              <div className="border-2 border-foreground bg-primary p-5 shadow-brutal-sm">
                <p className="font-display text-5xl font-black">{metric.value}</p>
                <p className="mt-3 text-sm font-black uppercase">{metric.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {achievements.map((achievement, index) => (
            <Reveal key={achievement.title} delay={index * 0.06}>
              <article className="brutal-card h-full p-6">
                <achievement.icon className="mb-6 h-9 w-9" />
                <h3 className="font-display text-2xl font-black uppercase">{achievement.title}</h3>
                <p className="mt-4 leading-7 text-muted-foreground">{achievement.copy}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
