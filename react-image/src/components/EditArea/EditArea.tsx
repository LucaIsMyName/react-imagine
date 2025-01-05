// src/components/EditArea/EditArea.tsx
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Select } from "@/components/ui/select";
import { useEditor } from "../../contexts/EditorContext";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import ExportDialog from "../ExportDialog/ExportDialog";

const EditArea: React.FC = () => {
  const { state, dispatch } = useEditor();

  const handleFilterChange = (name: keyof Omit<FilterSettings, "artStyle">, value: number) => {
    dispatch({
      type: "UPDATE_FILTER",
      payload: { [name]: value },
    });
  };

  const artStyles = [
    { value: "none", label: "None" },
    { value: "cubism", label: "Cubism" },
    { value: "modern", label: "Modern" },
    { value: "abstract", label: "Abstract" },
    { value: "pointillism", label: "Pointillism" },
    { value: "renaissance", label: "Renaissance" },
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

  return (
    <div className="p-4 space-y-6 md:shadow-inner">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Adjustments</h2>
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
                className={`w-auto text-[11px] p-0 h-auto py-1 ${state.filterSettings.artStyle === style.value ? "bg-foreground hover:bg-foreground-muted hover:text-background-muted text-background" : ""}`}>
                <img
                  src={`https://placehold.co/50`}
                  alt={style.label}
                  className={`w-5 h-5 rounded-sm ml-1 mr-2 shadow-inner `}
                />
                <span className="mr-2">{style.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Brightness: {state.filterSettings.brightness}</label>
            <Slider
              value={[state.filterSettings.brightness]}
              onValueChange={([value]) => handleFilterChange("brightness", value)}
              min={-100}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Contrast: {state.filterSettings.contrast}</label>
            <Slider
              value={[state.filterSettings.contrast]}
              onValueChange={([value]) => handleFilterChange("contrast", value)}
              min={-100}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Saturation: {state.filterSettings.saturation}</label>
            <Slider
              value={[state.filterSettings.saturation]}
              onValueChange={([value]) => handleFilterChange("saturation", value)}
              min={-100}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Highlights: {state.filterSettings.highlights}</label>
            <Slider
              value={[state.filterSettings.highlights]}
              onValueChange={([value]) => handleFilterChange("highlights", value)}
              min={-100}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Shadows: {state.filterSettings.shadows}</label>
            <Slider
              value={[state.filterSettings.shadows]}
              onValueChange={([value]) => handleFilterChange("shadows", value)}
              min={-100}
              max={100}
              step={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditArea;
