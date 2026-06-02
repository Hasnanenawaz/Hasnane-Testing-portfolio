import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/portfolio-data";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function Projects() {
  return (
    <section id="projects" className="section-pad bg-foreground text-background">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow="Case studies"
            title="Portfolio projects written as measurable growth stories."
            copy="Recruiters and founders can scan the result first, then understand the operating thinking behind it."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal key={project.title} delay={index * 0.07}>
              <article className="group h-full border-2 border-background bg-background p-5 text-foreground shadow-[8px_8px_0_#B8FF2C] transition-transform hover:-translate-x-1 hover:-translate-y-1 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="border-2 border-foreground bg-primary p-3 shadow-brutal-sm">
                    <project.icon className="h-7 w-7" />
                  </div>
                  <ArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <p className="mt-8 text-sm font-black uppercase text-muted-foreground">{project.type}</p>
                <h3 className="mt-2 font-display text-3xl font-black uppercase md:text-4xl">{project.title}</h3>
                <p className="mt-4 inline-flex border-2 border-foreground bg-coral px-3 py-2 font-black uppercase">
                  {project.result}
                </p>
                <p className="mt-5 leading-7 text-muted-foreground">{project.summary}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="border-2 border-foreground bg-muted px-3 py-1 text-xs font-black uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
