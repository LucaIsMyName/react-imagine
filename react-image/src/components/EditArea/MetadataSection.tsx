// src/components/EditArea/MetadataSection.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Info } from "lucide-react";
import { ImageMetadata } from "@/types/editor-types";
import { motion, AnimatePresence } from "framer-motion";

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
    <details className="space-y-2 cursor-pointer hover:bg-muted/30 bg-background  bg-muted/10 rounded-lg shadow-sm border border-border">
      <summary className="flex items-center justify-between gap-2 p-2">
        <div className="flex items-center gap-2 ">
          <Info className="size-4 text-muted-foreground" />
          <p className="text-base font-medium">Image Metadata</p>
        </div>
        <ChevronDown className="w-4 h-4" />
      </summary>

      <AnimatePresence>
        <motion.div
          className="mb-4 p-2 pt-0 space-y-2"
          initial={{ opacity: 1, height: 0, overflowY: "hidden" }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4 }}>
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs lg:text-sm text-foreground">Title</label>
            <Input
              value={metadata.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className="font-mono h-9 md:text-xs text-base bg-white/80 dark:bg-black/80"
              placeholder="Image title"
            />
          </div>

          {/* Description/Caption */}
          <div className="space-y-1">
            <label className="text-xs lg:text-sm text-foreground">Description</label>
            <Input
              value={metadata.description}
              onChange={(e) => onChange({ description: e.target.value })}
              className="font-mono h-9 md:text-xs text-base bg-white dark:bg-black"
              placeholder="Image description or caption"
            />
          </div>

          {/* Alt Text */}
          <div className="space-y-1">
            <label className="text-xs lg:text-sm text-foreground">Alt Text</label>
            <Input
              value={metadata.altText}
              onChange={(e) => onChange({ altText: e.target.value })}
              className="font-mono h-9 md:text-xs text-base bg-white dark:bg-black"
              placeholder="Alternative text for accessibility"
            />
          </div>

          {/* Copyright */}
          <div className="space-y-1">
            <label className="text-xs lg:text-sm text-foreground">Copyright</label>
            <Input
              value={metadata.copyright}
              onChange={(e) => onChange({ copyright: e.target.value })}
              className="font-mono h-9 md:text-xs text-base bg-white dark:bg-black"
              placeholder="© 2024 Your Name"
            />
          </div>

          {/* Author */}
          <div className="space-y-1">
            <label className="text-xs lg:text-sm text-foreground">Author</label>
            <Input
              value={metadata.author}
              onChange={(e) => onChange({ author: e.target.value })}
              className="font-mono h-9 md:text-xs text-base bg-white dark:bg-black"
              placeholder="Image author or creator"
            />
          </div>

          {/* Keywords */}
          <div className="space-y-1">
            <label className="text-xs lg:text-sm text-foreground">Keywords</label>
            <Input
              value={metadata.keywords.join(", ")}
              onChange={(e) => handleKeywordsChange(e.target.value)}
              className="font-mono h-9 md:text-xs text-base bg-white dark:bg-black"
              placeholder="Comma-separated keywords"
            />
          </div>

          {/* Date Created */}
          <div className="space-y-1">
            <label className="text-xs lg:text-sm text-foreground">Date Created</label>
            <Input
              type="date"
              value={metadata.dateCreated}
              onChange={(e) => onChange({ dateCreated: e.target.value })}
              className="font-mono h-9 md:text-xs text-base bg-white dark:bg-black"
            />
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-xs lg:text-sm text-foreground">Location</label>
            <Input
              value={metadata.location}
              onChange={(e) => onChange({ location: e.target.value })}
              className="font-mono h-9 md:text-xs text-base bg-white dark:bg-black"
              placeholder="Where the image was taken"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </details>
  );
};

export default MetadataSection;
