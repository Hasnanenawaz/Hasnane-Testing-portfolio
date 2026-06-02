import { experience } from "@/lib/portfolio-data";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function Experience() {
  return (
    <section id="experience" className="section-pad bg-muted/55">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow="Experience"
            title="A timeline of growth systems, not just job titles."
            copy="Each role is framed around the business problem handled: community scale, lead generation, revenue growth, and content operations."
          />
        </Reveal>
        <div className="mt-14 grid gap-6">
          {experience.map((item, index) => (
            <Reveal key={`${item.company}-${item.role}`} delay={index * 0.06}>
              <article className="grid gap-5 border-2 border-foreground bg-background p-5 shadow-brutal md:grid-cols-[220px_1fr] md:p-7">
                <div>
                  <div className={`mb-5 inline-flex border-2 border-foreground ${item.color} p-3 shadow-brutal-sm`}>
                    <item.icon className="h-7 w-7" />
                  </div>
                  <p className="font-display text-2xl font-black uppercase">{item.company}</p>
                  <p className="mt-2 text-sm font-black uppercase text-muted-foreground">{item.period}</p>
                </div>
                <div>
                  <h3 className="font-display text-3xl font-black uppercase">{item.role}</h3>
                  <ul className="mt-5 grid gap-3">
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3 leading-7">
                        <span className="mt-2 h-3 w-3 shrink-0 border-2 border-foreground bg-primary" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
