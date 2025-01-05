// src/components/ui/slider.tsx
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}>
    <SliderPrimitive.Track className="relative h-0.5 w-full grow overflow-hidden rounded-full bg-muted-foreground/30">
      <SliderPrimitive.Range className="absolute h-full bg-transparent shadow bg-muted-foreground/15" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block w-3 lg:h-4 h-3 lg:w-4 rounded-full border-2 border-muted-foreground/30 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:border-foreground hover:shadow-lg" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
