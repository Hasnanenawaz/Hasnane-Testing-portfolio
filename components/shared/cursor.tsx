"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function Cursor() {
  const [visible, setVisible] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { stiffness: 420, damping: 35 });
  const y = useSpring(mouseY, { stiffness: 420, damping: 35 });

  useEffect(() => {
    const update = (event: MouseEvent) => {
      setVisible(true);
      mouseX.set(event.clientX - 12);
      mouseY.set(event.clientY - 12);
    };

    window.addEventListener("mousemove", update);
    window.addEventListener("mouseleave", () => setVisible(false));
    return () => window.removeEventListener("mousemove", update);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-6 w-6 rounded-full border-2 border-foreground bg-primary mix-blend-difference md:block"
      style={{ x, y, opacity: visible ? 1 : 0 }}
    />
  );
}
