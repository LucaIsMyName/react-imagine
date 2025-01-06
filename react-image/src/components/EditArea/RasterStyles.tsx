// src/components/EditArea/RasterStyles.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CircleX as NoneIcon, CircleIcon, Tally3, AlignEndVertical, AlignEndHorizontal } from "lucide-react";
import SliderLabel from "./SliderLabel";

interface RasterStylesProps {
  style: string;
  granularity: number;
  randomness: number;
  onStyleChange: (style: string) => void;
  onGranularityChange: (value: number) => void;
  onRandomnessChange: (value: number) => void;
}

const RasterStyles: React.FC<RasterStylesProps> = ({ style, granularity, randomness, onStyleChange, onGranularityChange, onRandomnessChange }) => {
  const iconClasses = "size-3 opacity-70 lg:size-4 ml-0.5";

  const styles = [
    {
      value: "none",
      icon: (
        <NoneIcon
          className={iconClasses}
          strokeWidth={1.5}
        />
      ),
      label: "None",
    },
    {
      value: "dots",
      icon: (
        <CircleIcon
          className={iconClasses}
          strokeWidth={1.5}
        />
      ),
      label: "Dots",
    },
    {
      value: "lines-horizontal",
      icon: (
        <Tally3
          className={iconClasses}
          style={{ transform: "rotate(90deg) translateX(2px)", transformOrigin: "center" }}
          strokeWidth={1.5}
        />
      ),
      label: "H-Lines",
    },
    {
      value: "lines-vertical",
      icon: (
        <Tally3
          className={iconClasses}
          strokeWidth={1.5}
          style={{ transform: "rotate(0) translateX(2px)", transformOrigin: "center" }}
        />
      ),
      label: "V-Lines",
    },
  ];

  return (
    <div className="space-y-2 px-2 pt-1 pb-2 shadow-sm bg-background-muted rounded-lg border">
      <label className="text-sm font-medium">Raster Style</label>

      {/* Style Buttons */}
      <div className="flex gap-2 flex-wrap">
        {styles.map((rasterStyle) => (
          <Button
            key={rasterStyle.value}
            variant={style === rasterStyle.value ? "outline" : "outline"}
            onClick={() => onStyleChange(rasterStyle.value)}
            className={`w-auto text-[10px] font-mono font-[400] lg:text-[12px] rounded-full p-0 h-auto py-1 lg:pr-1 
              ${style === rasterStyle.value ? "bg-foreground hover:bg-foreground-muted hover:text-background-muted text-background" : ""}`}>
            <div className="px-1">{rasterStyle.icon}</div>
            <span className="mr-2">{rasterStyle.label}</span>
          </Button>
        ))}
      </div>

      {style !== "none" && (
        <div className="space-y-4 p-2 rounded-md border mt-8">
          <div className="space-y-2">
            <SliderLabel
              label="Granularity"
              value={granularity}
              onChange={onGranularityChange}
              min={0}
              max={100}
            />
            <Slider
              value={[granularity]}
              onValueChange={([value]) => onGranularityChange(value)}
              min={0}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <SliderLabel
              label="Randomness"
              value={randomness}
              onChange={onRandomnessChange}
              min={0}
              max={100}
            />
            <Slider
              value={[randomness]}
              onValueChange={([value]) => onRandomnessChange(value)}
              min={0}
              max={100}
              step={1}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RasterStyles;
