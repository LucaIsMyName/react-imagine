// src/components/EditArea/TransformControls.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCw, Crop, Square, RectangleHorizontal, MonitorSmartphone, MonitorPlay, Maximize, X } from "lucide-react";
import SliderLabel from "./SliderLabel";
import type { CropMode, RotationMode } from "@/types/editor-types";

interface TransformControlsProps {
  cropMode: CropMode;
  rotationMode: RotationMode;
  rotationAngle: number;
  onCropModeChange: (mode: CropMode) => void;
  onRotationModeChange: (mode: RotationMode, angle?: number) => void;
  onRotationAngleChange: (angle: number) => void;
  onResetCrop: () => void;
  onResetRotation: () => void;
}

const TransformControls: React.FC<TransformControlsProps> = ({ cropMode, rotationMode, rotationAngle, onCropModeChange, onRotationModeChange, onRotationAngleChange, onResetCrop, onResetRotation }) => {
  const cropModes: { value: CropMode; icon: React.ReactNode; label: string }[] = [
    { value: "square", icon: <Square className="w-3 h-3" />, label: "1:1" },
    { value: "portrait", icon: <RectangleHorizontal className="w-3 h-3" />, label: "3:4" },
    { value: "landscape", icon: <RectangleHorizontal className="w-3 h-3" />, label: "4:3" },
    { value: "widescreen", icon: <MonitorSmartphone className="w-3 h-3" />, label: "16:9" },
    { value: "video", icon: <MonitorPlay className="w-3 h-3" />, label: "9:16" },
    { value: "free", icon: <Maximize className="w-3 h-3" />, label: "Free" },
  ];

  const rotationModes: { value: RotationMode; angle: number; label: string }[] = [
    { value: "90", angle: 90, label: "90°" },
    { value: "180", angle: 180, label: "180°" },
    { value: "270", angle: 270, label: "270°" },
    { value: "free", angle: 0, label: "Free" },
  ];

  return (
    <div className="space-y-6">
      {/* Crop Controls */}
      <div className="space-y-4 p-2 pb-4 rounded border bg-background-muted rounded-md shadow-sm bg-background">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium flex items-center gap-2">
            <Crop className="w-4 h-4 text-muted-foreground" />
            Crop
          </h3>
          {cropMode !== "none" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetCrop}
              className="h-6 px-1.5">
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {cropModes.map(({ value, icon, label }) => (
            <button
              key={value}
              onClick={() => onCropModeChange(value)}
              className="flex rounded-full border items-center gap-2 p-1 px-2 pr-3 text-[10px] lg:text-[10px] shadow-sm">
              {icon}
              <span className="">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rotation Controls */}
      <div className="space-y-4 p-2 pb-4 rounded border bg-background rounded-md shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium flex items-center gap-2">
          <RotateCw className="w-4 h-4 text-muted-foreground" />
            Rotate
          </h3>
          {rotationMode !== "none" && (
            <Button
              variant="outline"
              onClick={onResetRotation}
              className=" gap-2 px-2 py-[0em] shadow-sm pr-3 rounded-full text-[10px] lg:text-[10px]">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {rotationModes.map(({ value, angle, label }) => (
            <button
              key={value}
              onClick={() => onRotationModeChange(value, angle)}
              className="flex rounded-full border items-center gap-2 p-1 px-2 pr-3 text-[10px] lg:text-[10px] shadow-sm">
              <RotateCw className="w-3 h-3"
              style={{
                transform: `rotate(${angle}deg)`,
              }} />
              <span className="">{label}</span>
            </button>
          ))}
        </div>

        {rotationMode === "free" && (
          <div className="space-y-2">
            <SliderLabel
              label="Angle"
              value={rotationAngle}
              onChange={onRotationAngleChange}
              unit="°"
            />
            <Slider
              value={[rotationAngle]}
              onValueChange={([value]) => onRotationAngleChange(value)}
              min={-180}
              max={180}
              step={1}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransformControls;
