// src/components/ImageArea/ImageArea.tsx
import React from 'react';
import { Upload } from 'lucide-react';
import { useEditor } from '../../contexts/EditorContext';

const ImageArea: React.FC = () => {
  const { state, dispatch } = useEditor();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch({ type: 'SET_IMAGE', payload: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full w-full p-4">
      <div className="h-full w-full flex items-center justify-center border-2 border-dashed border-border rounded-lg">
        {!state.image ? (
          <div className="text-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-6 rounded-lg hover:bg-accent"
            >
              <Upload className="w-8 h-8" />
              <span className="text-sm">Click to upload an image</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={state.image}
              alt="Uploaded image"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageArea;