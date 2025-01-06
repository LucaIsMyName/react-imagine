import React from "react";
import { Slider } from "@/components/ui/slider";
import { useEditor } from "../../contexts/EditorContext";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import ExportDialog from "../ExportDialog/ExportDialog";
import SliderLabel from "./SliderLabel";
import MetadataSection from "./MetadataSection";
import RasterStyles from "./RasterStyles";
import ArtStyles from "./ArtStyles";

const EditArea: React.FC = () => {
  const { state, dispatch } = useEditor();

  const handleFilterChange = (name: keyof Omit<FilterSettings, "artStyle" | "rasterStyle">, value: number) => {
    dispatch({
      type: "UPDATE_FILTER",
      payload: { [name]: value },
    });
  };

  const handleRasterStyleChange = (style: string) => {
    dispatch({
      type: "UPDATE_FILTER",
      payload: { rasterStyle: style },
    });
  };

  const handleArtStyleChange = (style: string) => {
    dispatch({
      type: "UPDATE_FILTER",
      payload: { artStyle: style },
    });
  };

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
        <h2 className="text-lg font-semibold">Settings</h2>
        <div className="flex gap-2">
          <Button
            variant="link"
            onClick={() => dispatch({ type: "RESET_FILTERS" })}
            className="flex items-center px-3 py-4">
            <span className="block backdrop-blur-sm lg:block mr-2 text-[11px] lg:text-xs text-foreground/70 underline-none">Reset</span>
            <RotateCcw className="h-4 w-4 mr-0" />
          </Button>
          <ExportDialog />
        </div>
      </div>

      {/* Basic Adjustments */}
      <div className="space-y-6">
        {/* Base Filters */}
        <div className="space-y-4 p-2 pb-4 rounded border bg-background-muted rounded-md shadow-sm">
          <h3 className="text-base font-medium">Base Filters</h3>
          {/* Brightness Slider */}
          <div className="space-y-2 ">
            <SliderLabel
              label="Brightness"
              value={state.filterSettings.brightness}
              onChange={(value) => handleFilterChange("brightness", value)}
            />
            <Slider
              value={[state.filterSettings.brightness]}
              onValueChange={([value]) => handleFilterChange("brightness", value)}
              min={-100}
              max={100}
              step={1}
            />
          </div>

          {/* Contrast Slider */}
          <div className="space-y-2">
            <SliderLabel
              label="Contrast"
              value={state.filterSettings.contrast}
              onChange={(value) => handleFilterChange("contrast", value)}
            />
            <Slider
              value={[state.filterSettings.contrast]}
              onValueChange={([value]) => handleFilterChange("contrast", value)}
              min={-100}
              max={100}
              step={1}
            />
          </div>

          {/* Saturation Slider */}
          <div className="space-y-2">
            <SliderLabel
              label="Saturation"
              value={state.filterSettings.saturation}
              onChange={(value) => handleFilterChange("saturation", value)}
            />
            <Slider
              value={[state.filterSettings.saturation]}
              onValueChange={([value]) => handleFilterChange("saturation", value)}
              min={-100}
              max={100}
              step={1}
            />
          </div>

          {/* Highlights Slider */}
          <div className="space-y-2">
            <SliderLabel
              label="Highlights"
              value={state.filterSettings.highlights}
              onChange={(value) => handleFilterChange("highlights", value)}
            />
            <Slider
              value={[state.filterSettings.highlights]}
              onValueChange={([value]) => handleFilterChange("highlights", value)}
              min={-100}
              max={100}
              step={1}
            />
          </div>

          {/* Shadows Slider */}
          <div className="space-y-2">
            <SliderLabel
              label="Shadows"
              value={state.filterSettings.shadows}
              onChange={(value) => handleFilterChange("shadows", value)}
            />
            <Slider
              value={[state.filterSettings.shadows]}
              onValueChange={([value]) => handleFilterChange("shadows", value)}
              min={-100}
              max={100}
              step={1}
            />
          </div>
        </div>

        {/* Art Styles with Controls */}
        <ArtStyles
          style={state.filterSettings.artStyle}
          granularity={state.filterSettings.artGranularity}
          randomness={state.filterSettings.artRandomness}
          onStyleChange={handleArtStyleChange}
          onGranularityChange={(value) => handleFilterChange("artGranularity", value)}
          onRandomnessChange={(value) => handleFilterChange("artRandomness", value)}
        />

        {/* Raster Styles with Controls */}
        <RasterStyles
          style={state.filterSettings.rasterStyle}
          granularity={state.filterSettings.rasterGranularity}
          randomness={state.filterSettings.rasterRandomness}
          onStyleChange={handleRasterStyleChange}
          onGranularityChange={(value) => handleFilterChange("rasterGranularity", value)}
          onRandomnessChange={(value) => handleFilterChange("rasterRandomness", value)}
        />

        {/* Metadata Section */}
        <MetadataSection
          metadata={state.metadata}
          onChange={handleMetadataChange}
        />
      </div>
    </div>
  );
};

export default EditArea;
