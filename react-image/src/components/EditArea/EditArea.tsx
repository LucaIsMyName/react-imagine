import React from "react";
import { Slider } from "@/components/ui/slider";
import { useEditor } from "../../contexts/EditorContext";
import { Button } from "@/components/ui/button";
import { RotateCcw, Settings2 } from "lucide-react";
import ExportDialog from "../ExportDialog/ExportDialog";
import SliderLabel from "./SliderLabel";
import MetadataSection from "./MetadataSection";
import RasterStyles from "./RasterStyles";
import ArtStyles from "./ArtStyles";
import TransformControls from "./TransformControls";
import type { CropMode, RotationMode } from "@/types/editor-types";

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

  const handleCropModeChange = (mode: CropMode) => {
    const aspectRatios: Record<CropMode, number | undefined> = {
      none: undefined,
      square: 1,
      portrait: 3 / 4,
      landscape: 4 / 3,
      widescreen: 16 / 9,
      video: 9 / 16,
      free: undefined,
    };

    dispatch({
      type: "UPDATE_CROP",
      payload: {
        // @ts-ignore
        mode,
        aspectRatio: aspectRatios[mode],
        x: 25,
        y: 25,
        width: 50,
        height: 50,
      },
    });
  };

  const handleRotationModeChange = (mode: RotationMode, angle?: number) => {
    dispatch({
      type: "UPDATE_ROTATION",
      payload: {
        mode,
        angle: angle ?? 0,
      },
    });
  };

  const handleRotationAngleChange = (angle: number) => {
    dispatch({
      type: "UPDATE_ROTATION",
      payload: {
        angle,
      },
    });
  };
  const handleResetCrop = () => {
    dispatch({ type: "RESET_CROP" });
  };

  const handleResetRotation = () => {
    dispatch({ type: "RESET_ROTATION" });
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
    <div className=" space-y-6 md:shadow-inner bg-muted/10 h-full overflow-y-scroll">
      <div className="p-4 flex items-center bg-background/70 z-30 border-b sticky top-0 left-0 w-full backdrop-blur-lg items-center justify-between">
        <h2 className="text-base font-semibold">Settings</h2>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            onClick={() => dispatch({ type: "RESET_FILTERS" })}
            className="flex items-center px-3 bg-transparent">
            <span className="sr-only">Reset</span>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <ExportDialog />
        </div>
      </div>

      {/* Basic Adjustments */}
      <div className="space-y-6 overflow-y-auto p-4 pt-0">
        <TransformControls
          cropMode={state.cropSettings.mode}
          rotationMode={state.rotationSettings.mode}
          rotationAngle={state.rotationSettings.angle}
          onCropModeChange={handleCropModeChange}
          onRotationModeChange={handleRotationModeChange}
          onRotationAngleChange={handleRotationAngleChange}
          onResetCrop={handleResetCrop}
          onResetRotation={handleResetRotation}
        />
        {/* Base Filters */}
        <div className="space-y-4 p-2 pb-4 rounded border bg-background rounded-md shadow-sm">
          <div className="flex gap-2 items-center">
            <Settings2 className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-base font-medium">Base Filters</h3>
          </div>
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
