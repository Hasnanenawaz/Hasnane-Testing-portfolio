import { Quote } from "lucide-react";
import { testimonials } from "@/lib/portfolio-data";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function Testimonials() {
  return (
    <section className="section-pad bg-muted/55">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow="Testimonials"
            title="Ready for real references when available."
            copy="The structure is included so verified manager, client, or founder quotes can be dropped in without redesigning the page."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <Reveal key={testimonial.name}>
              <figure className="brutal-card p-6">
                <Quote className="mb-6 h-10 w-10" />
                <blockquote className="font-display text-2xl font-black leading-tight">{testimonial.quote}</blockquote>
                <figcaption className="mt-6 border-t-2 border-foreground pt-4">
                  <p className="font-black uppercase">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
