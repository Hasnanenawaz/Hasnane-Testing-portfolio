"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

export function LoadingScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const tl = gsap.timeline();
    tl.to(element, {
      yPercent: -100,
      delay: 0.55,
      duration: 0.8,
      ease: "power4.inOut",
      // Let React unmount the node — never call element.remove() directly
      onComplete: () => setGone(true),
    });

    return () => { tl.kill() };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[100] grid place-items-center border-b-2 border-foreground bg-primary text-primary-foreground"
    >
      <div className="text-center">
        <p className="font-display text-5xl font-black uppercase md:text-8xl">Hasnane</p>
        <p className="mt-3 border-2 border-foreground bg-background px-4 py-2 font-black uppercase text-foreground shadow-brutal-sm">
          Growth stories loading
        </p>
      </div>
    </div>
  );
}
