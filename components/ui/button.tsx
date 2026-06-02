import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap border-2 border-foreground text-sm font-black uppercase tracking-normal shadow-brutal-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal",
        secondary: "bg-background text-foreground hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal",
        accent: "bg-accent text-accent-foreground hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal",
        ghost: "border-transparent bg-transparent shadow-none hover:border-foreground hover:bg-muted",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3 text-xs",
        lg: "h-13 px-7 py-4 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
