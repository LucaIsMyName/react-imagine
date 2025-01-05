// src/components/EditArea/MetadataSection.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { ImageMetadata } from "@/types/editor-types";

interface MetadataSectionProps {
  metadata: ImageMetadata;
  onChange: (update: Partial<ImageMetadata>) => void;
}

const MetadataSection: React.FC<MetadataSectionProps> = ({ metadata, onChange }) => {
  const handleKeywordsChange = (value: string) => {
    onChange({
      keywords: value
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k),
    });
  };

  return (
    <div className="space-y-2 px-2 pt-1 pb-2 shadow-sm bg-background-muted rounded-lg border">
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-4 h-4 text-muted-foreground" />
        <label className="text-sm font-medium">Image Metadata</label>
      </div>

      <div className="space-y-3">
        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs lg:text-sm text-muted-foreground">Title</label>
          <Input
            value={metadata.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="h-8 text-sm"
            placeholder="Image title"
          />
        </div>

        {/* Description/Caption */}
        <div className="space-y-1">
          <label className="text-xs lg:text-sm text-muted-foreground">Description</label>
          <Input
            value={metadata.description}
            onChange={(e) => onChange({ description: e.target.value })}
            className="h-8 text-sm"
            placeholder="Image description or caption"
          />
        </div>

        {/* Alt Text */}
        <div className="space-y-1">
          <label className="text-xs lg:text-sm text-muted-foreground">Alt Text</label>
          <Input
            value={metadata.altText}
            onChange={(e) => onChange({ altText: e.target.value })}
            className="h-8 text-sm"
            placeholder="Alternative text for accessibility"
          />
        </div>

        {/* Copyright */}
        <div className="space-y-1">
          <label className="text-xs lg:text-sm text-muted-foreground">Copyright</label>
          <Input
            value={metadata.copyright}
            onChange={(e) => onChange({ copyright: e.target.value })}
            className="h-8 text-sm"
            placeholder="© 2024 Your Name"
          />
        </div>

        {/* Author */}
        <div className="space-y-1">
          <label className="text-xs lg:text-sm text-muted-foreground">Author</label>
          <Input
            value={metadata.author}
            onChange={(e) => onChange({ author: e.target.value })}
            className="h-8 text-sm"
            placeholder="Image author or creator"
          />
        </div>

        {/* Keywords */}
        <div className="space-y-1">
          <label className="text-xs lg:text-sm text-muted-foreground">Keywords</label>
          <Input
            value={metadata.keywords.join(", ")}
            onChange={(e) => handleKeywordsChange(e.target.value)}
            className="h-8 text-sm"
            placeholder="Comma-separated keywords"
          />
        </div>

        {/* Date Created */}
        <div className="space-y-1">
          <label className="text-xs lg:text-sm text-muted-foreground">Date Created</label>
          <Input
            type="date"
            value={metadata.dateCreated}
            onChange={(e) => onChange({ dateCreated: e.target.value })}
            className="h-8 text-sm"
          />
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label className="text-xs lg:text-sm text-muted-foreground">Location</label>
          <Input
            value={metadata.location}
            onChange={(e) => onChange({ location: e.target.value })}
            className="h-8 text-sm"
            placeholder="Where the image was taken"
          />
        </div>
      </div>
    </div>
  );
};

export default MetadataSection;
