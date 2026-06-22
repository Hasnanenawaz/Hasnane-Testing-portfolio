import { faqs } from "@/lib/portfolio-data";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function Faq() {
  return (
    <section id="faq" className="section-pad">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions, direct answers."
            copy="Everything a recruiter, founder, or client usually wants to know — answered plainly."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {faqs.map((faq, index) => (
            <Reveal key={faq.q} delay={index * 0.06}>
              <div className="brutal-card h-full p-6 md:p-8">
                <h3 className="font-display text-lg font-black uppercase leading-snug">{faq.q}</h3>
                <p className="mt-4 leading-7 text-muted-foreground">{faq.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
