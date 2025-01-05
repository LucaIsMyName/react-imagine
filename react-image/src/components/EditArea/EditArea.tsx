// src/components/EditArea/EditArea.tsx
import React from 'react';

const EditArea: React.FC = () => {
  return (
    <div className="p-4 space-y-2">
      <h2 className="text-lg font-semibold">Adjustments</h2>
      <div className="space-y-6">
        <p className="text-muted-foreground text-sm">
          Adjustment controls will appear here when an image is selected.
        </p>
        {/* Add more content to test scrolling */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-20 rounded bg-muted" />
        ))}
      </div>
    </div>
  );
};

export default EditArea;