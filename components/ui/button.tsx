import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    // Base
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "disabled:pointer-events-none disabled:opacity-40 outline-none",
    "focus-visible:ring-[2px] focus-visible:ring-ring/60",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0",
    // Motion — 300ms ease-out per spec
    "transition-all duration-300 ease-out",
    "active:scale-[0.95] active:duration-100",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-primary text-primary-foreground text-sm card-shadow hover:card-shadow-hover hover:brightness-110",
        destructive:
          "rounded-full bg-destructive text-destructive-foreground text-sm shadow-sm hover:brightness-110",
        outline:
          "rounded-full border bg-card text-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/70",
        ghost:
          "rounded-full text-sm hover:bg-accent hover:text-accent-foreground",
        link:
          "rounded text-primary text-sm underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-5 py-2 has-[>svg]:px-3",
        sm:      "h-7 px-3.5 text-xs has-[>svg]:px-2.5",
        lg:      "h-11 px-7 text-base has-[>svg]:px-5",
        icon:    "size-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
