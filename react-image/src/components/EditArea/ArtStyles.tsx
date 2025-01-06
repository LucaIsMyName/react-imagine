// src/components/EditArea/ArtStyles.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CircleX as NoneIcon, Boxes as CubismIcon, Grip as PointillismIcon, BrickWall as ModernIcon, Eclipse as AbstractIcon, Paintbrush as RenaissanceIcon } from "lucide-react";
import SliderLabel from "./SliderLabel";

interface ArtStylesProps {
  style: string;
  granularity: number;
  randomness: number;
  onStyleChange: (style: string) => void;
  onGranularityChange: (value: number) => void;
  onRandomnessChange: (value: number) => void;
}

const ArtStyles: React.FC<ArtStylesProps> = ({ style, granularity, randomness, onStyleChange, onGranularityChange, onRandomnessChange }) => {
  const iconClasses = "size-3 opacity-70 lg:size-4 ml-0.5";

  const styles = [
    {
      value: "none",
      isActive: true,
      icon: (
        <NoneIcon
          className={iconClasses}
          strokeWidth={1.5}
        />
      ),
      label: "None",
    },
    {
      value: "cubism",
      isActive: true,
      icon: (
        <CubismIcon
          className={iconClasses}
          strokeWidth={1.5}
        />
      ),
      label: "Cubism",
    },
    {
      value: "modern",
      isActive: true,
      icon: (
        <ModernIcon
          className={iconClasses}
          strokeWidth={1.5}
        />
      ),
      label: "Modern",
    },
    {
      value: "abstract",
      isActive: false,
      icon: (
        <AbstractIcon
          className={iconClasses}
          strokeWidth={1.5}
        />
      ),
      label: "Abstract",
    },
    {
      value: "pointillism",
      isActive: true,
      icon: (
        <PointillismIcon
          className={iconClasses}
          strokeWidth={1.5}
        />
      ),
      label: "Pointillism",
    },
    {
      value: "renaissance",
      isActive: false,
      icon: (
        <RenaissanceIcon
          className={iconClasses}
          strokeWidth={1.5}
        />
      ),
      label: "Renaissance",
    },
  ];

  return (
    <div className="space-y-2 px-2 pt-1 pb-2 shadow-sm bg-background-muted rounded-lg border">
      <label className="text-sm font-medium">Art Style</label>

      {/* Style Buttons */}
      <div className="flex gap-2 flex-wrap">
        {styles.map((artStyle) => (
          <Button
            key={artStyle.value}
            disabled={!artStyle.isActive}
            variant={style === artStyle.value ? "outline" : "outline"}
            onClick={() => onStyleChange(artStyle.value)}
            className={`w-auto text-[10px] font-mono font-[400] lg:text-[12px] rounded-full p-0 h-auto py-1 lg:pr-1 
              ${style === artStyle.value ? "bg-foreground hover:bg-foreground-muted hover:text-background-muted text-background" : ""}`}>
            <div className="px-1">{artStyle.icon}</div>
            <span className="mr-2">{artStyle.label}</span>
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

export default ArtStyles;
