import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  copy?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, copy, className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className="mb-4 inline-flex border-2 border-foreground bg-primary px-3 py-1 font-display text-xs font-black uppercase">
        {eyebrow}
      </p>
      <h2 className="font-display text-4xl font-black leading-none text-balance md:text-6xl">{title}</h2>
      {copy ? <p className="mt-5 text-base leading-7 text-muted-foreground md:text-lg">{copy}</p> : null}
    </div>
  );
}
