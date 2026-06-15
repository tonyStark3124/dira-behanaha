"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-full w-full"
        style={{
          height: "8px",
          boxShadow: "var(--shadow-inset)",
          backgroundColor: "var(--muted)",
        }}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, var(--chart-1), var(--primary))",
          }}
        />
      </SliderPrimitive.Track>
      {_values.map((_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            "block shrink-0 rounded-full",
            "border-2 border-primary bg-background",
            "shadow-[0_0_0_3px_color-mix(in_oklch,var(--primary)_20%,transparent)]",
            "transition-all duration-200",
            "hover:shadow-[0_0_0_5px_color-mix(in_oklch,var(--primary)_25%,transparent)] hover:scale-110",
            "focus-visible:shadow-[0_0_0_5px_color-mix(in_oklch,var(--primary)_30%,transparent)] focus-visible:outline-none",
            "disabled:pointer-events-none",
          )}
          style={{ width: "22px", height: "22px" }}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
