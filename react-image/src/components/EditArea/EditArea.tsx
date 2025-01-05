// src/components/EditArea/EditArea.tsx
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Select } from "@/components/ui/select";
import { useEditor } from "../../contexts/EditorContext";
import { Button } from "@/components/ui/button";
import { RotateCcw, CircleX as NoneIcon, Boxes as CubismIcon, Grip as PointillismIcon, BrickWall as ModernIcon, Eclipse as AbstractIcon, Paintbrush as RenaissanceIcon } from "lucide-react";
import ExportDialog from "../ExportDialog/ExportDialog";
import MetadataSection from "./MetadataSection";


const EditArea: React.FC = () => {
  const { state, dispatch } = useEditor();

  const handleFilterChange = (name: keyof Omit<FilterSettings, "artStyle">, value: number) => {
    dispatch({
      type: "UPDATE_FILTER",
      payload: { [name]: value },
    });
  };

  const artIconClasses = `size-3 opacity-70 lg:size-4 ml-0.5`;

  const artStyles = [
    {
      value: "none",
      icon: (
        <NoneIcon
          className={`${artIconClasses}`}
          strokeWidth={1.5}
        />
      ),
      label: "None",
    },
    {
      value: "cubism",
      icon: (
        <CubismIcon
          className={`${artIconClasses}`}
          strokeWidth={1.5}
        />
      ),
      label: "Cubism",
    },
    {
      value: "modern",
      icon: (
        <ModernIcon
          className={`${artIconClasses}`}
          strokeWidth={1.5}
        />
      ),
      label: "Modern",
    },
    {
      value: "abstract",
      icon: (
        <AbstractIcon
          className={`${artIconClasses}`}
          strokeWidth={1.5}
        />
      ),
      label: "Abstract",
    },
    {
      value: "pointillism",
      icon: (
        <PointillismIcon
          className={`${artIconClasses}`}
          strokeWidth={1.5}
        />
      ),
      label: "Pointillism",
    },
    {
      value: "renaissance",
      icon: (
        <RenaissanceIcon
          className={`${artIconClasses}`}
          strokeWidth={1.5}
        />
      ),
      label: "Renaissance",
    },
  ];

  const handleArtStyleChange = (style: (typeof artStyles)[number]["value"]) => {
    dispatch({
      type: "UPDATE_FILTER",
      payload: { artStyle: style },
    });
  };

  if (!state.image) {
    return (
      <div className="p-4 space-y-2">
        <p className="text-muted-foreground text-sm">Upload an image to start editing</p>
      </div>
    );
  }


  const handleMetadataChange = (update: Partial<ImageMetadata>) => {
    dispatch({
      type: "UPDATE_METADATA",
      payload: update,
    });
  };

  if (!state.image) {
    return (
      <div className="p-4 space-y-2">
        <p className="text-muted-foreground text-sm">Upload an image to start editing</p>
      </div>
    );
  }


  return (
    <div className="p-4 space-y-6 md:shadow-inner">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch({ type: "RESET_FILTERS" })}
            className="h-8 px-2">
            <RotateCcw className="h-4 w-4 mr-0" />
            <span className="sr-only">Reset</span>
          </Button>
          <ExportDialog />
        </div>
      </div>

      {/* Basic Adjustments */}
      <div className="space-y-6">
        {/* Art Styles */}
        <div className="space-y-2 px-2 pt-1 pb-2 shadow-sm bg-background-muted rounded-lg border">
          <label className="text-sm font-medium">Art Style</label>
          <div className="flex gap-2 flex-wrap">
            {artStyles.map((style) => (
              <Button
                key={style.value}
                variant={state.filterSettings.artStyle === style.value ? "outline" : "outline"}
                onClick={() => handleArtStyleChange(style.value)}
                className={`w-auto text-[10px] lg:text-[12px] rounded-full p-0 h-auto py-1 ${state.filterSettings.artStyle === style.value ? "bg-foreground hover:bg-foreground-muted hover:text-background-muted text-background" : ""}`}>
                {style.icon ? (
                  <div className="px-1">{style.icon}</div>
                ) : (
                  <div className="px-1">
                    <NoneIcon className={artIconClasses} />
                  </div>
                )}
                <span className="mr-2">{style.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex justify-between items-center">
              <p className="text-xs lg:text-sm">Brightness</p>
              <p className="text-xs font-[400] px-1.5 py-0.5 border rounded">{state.filterSettings.brightness}</p>
            </label>
            <Slider
              value={[state.filterSettings.brightness]}
              onValueChange={([value]) => handleFilterChange("brightness", value)}
              min={-100}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex justify-between items-center">
              <p className="text-xs lg:text-sm">Contrast</p>
              <p className="text-xs font-[400] px-1.5 py-0.5 border rounded">{state.filterSettings.contrast}</p>
            </label>
            <Slider
              value={[state.filterSettings.contrast]}
              onValueChange={([value]) => handleFilterChange("contrast", value)}
              min={-100}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex justify-between items-center">
              <p className="text-xs lg:text-sm">Saturation</p>
              <p className="text-xs font-[400] px-1.5 py-0.5 border rounded">{state.filterSettings.saturation}</p>
            </label>
            <Slider
              value={[state.filterSettings.saturation]}
              onValueChange={([value]) => handleFilterChange("saturation", value)}
              min={-100}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex justify-between items-center">
              <p className="text-xs lg:text-sm">Highlights</p>
              <p className="text-xs font-[400] px-1.5 py-0.5 border rounded">{state.filterSettings.highlights}</p>
            </label>
            <Slider
              value={[state.filterSettings.highlights]}
              onValueChange={([value]) => handleFilterChange("highlights", value)}
              min={-100}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex justify-between items-center">
              <p className="text-xs lg:text-sm">Shadows</p>
              <p className="text-xs font-[400] px-1.5 py-0.5 border rounded">{state.filterSettings.shadows}</p>
            </label>
            <Slider
              value={[state.filterSettings.shadows]}
              onValueChange={([value]) => handleFilterChange("shadows", value)}
              min={-100}
              max={100}
              step={1}
            />
          </div>
        </div>
        <MetadataSection
          metadata={state.metadata}
          onChange={handleMetadataChange}
        />
      </div>
    </div>
  );
};

export default EditArea;
