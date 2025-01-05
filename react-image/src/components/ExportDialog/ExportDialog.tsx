// // src/components/ExportDialog/ExportDialog.tsx
// import React, { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Download } from 'lucide-react';
// import { useEditor } from '../../contexts/EditorContext';

// interface ImageSize {
//   name: string;
//   width: number;
//   scale: number;
// }

// const imageSizes: Record<string, ImageSize> = {
//   original: { name: 'Original', width: 0, scale: 1 },
//   large: { name: 'Large', width: 1920, scale: 0.75 },
//   medium: { name: 'Medium', width: 1280, scale: 0.5 },
//   small: { name: 'Small', width: 800, scale: 0.25 },
// };

// const imageFormats = [
//   { value: 'png', label: 'PNG' },
//   { value: 'jpeg', label: 'JPEG' },
//   { value: 'webp', label: 'WebP' },
// ];

// const ExportDialog: React.FC = () => {
//   const { state } = useEditor();
//   const [format, setFormat] = useState('png');
//   const [size, setSize] = useState('original');
//   const [filename, setFilename] = useState('edited-image');

//   const handleExport = async (exportAll: boolean = false) => {
//     if (!state.image) return;

//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     const img = new Image();
//     img.src = state.image;

//     await new Promise<void>((resolve) => {
//       img.onload = () => {
//         const sizesToExport = exportAll ? Object.entries(imageSizes) : [[size, imageSizes[size]]];

//         sizesToExport.forEach(([sizeKey, sizeConfig]) => {
//           // Calculate dimensions
//           const scale = sizeConfig.scale;
//           const targetWidth = sizeConfig.width || img.width;
//           const targetHeight = sizeConfig.width ? (img.height * targetWidth / img.width) : img.height;

//           // Set canvas size
//           canvas.width = targetWidth;
//           canvas.height = targetHeight;

//           // Apply current filters
//           ctx.filter = `
//             brightness(${100 + state.filterSettings.brightness}%)
//             contrast(${100 + state.filterSettings.contrast}%)
//             saturate(${100 + state.filterSettings.saturation}%)
//           `;

//           // Draw image
//           ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

//           // Create download link
//           const link = document.createElement('a');
//           link.download = `${filename}-${sizeKey}.${format}`;
//           link.href = canvas.toDataURL(`image/${format}`, 0.9);
//           link.click();
//         });

//         resolve();
//       };
//     });
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button className="flex items-center gap-2 px-3">
//           <Download className="w-4 h-4" />
//           <span className='sr-only'>Export</span>
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Export Image</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Format</label>
//             <Select value={format} onValueChange={setFormat}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {imageFormats.map((format) => (
//                   <SelectItem key={format.value} value={format.value}>
//                     {format.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Size</label>
//             <Select value={size} onValueChange={setSize}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {Object.entries(imageSizes).map(([key, size]) => (
//                   <SelectItem key={key} value={key}>
//                     {size.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Filename</label>
//             <Input
//               value={filename}
//               onChange={(e) => setFilename(e.target.value)}
//               placeholder="Enter filename"
//             />
//           </div>

//           <div className="flex flex-col md:flex-row gap-2 pt-4">
//             <Button onClick={() => handleExport(false)} className="block w-full md:w-auto flex-1">
//               Download
//             </Button>
//             <Button onClick={() => handleExport(true)} variant="outline" className="block w-full md:w-auto flex-1">
//               Export All Sizes
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ExportDialog;

// src/components/ExportDialog/ExportDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import { useEditor } from '../../contexts/EditorContext';
import { createProcessedCanvas } from '@/lib/utils/canvas';
import { imageSizes, imageFormats } from '@/types/image-types';

const ExportDialog: React.FC = () => {
  const { state } = useEditor();
  const [format, setFormat] = useState('png');
  const [size, setSize] = useState('original');
  const [filename, setFilename] = useState('edited-image');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = async (exportAll: boolean = false) => {
    if (!state.image || isProcessing) return;
    setIsProcessing(true);

    try {
      const sizesToExport = exportAll ? Object.entries(imageSizes) : [[size, imageSizes[size]]];

      for (const [sizeKey, sizeConfig] of sizesToExport) {
        const targetWidth = sizeConfig.width || undefined;
        
        // Get processed canvas with all effects applied
        const canvas = await createProcessedCanvas(
          state.image,
          state.filterSettings,
          targetWidth
        );

        // Create download link
        const link = document.createElement('a');
        link.download = `${filename}-${sizeKey}.${format}`;
        link.href = canvas.toDataURL(`image/${format}`, 0.9);
        link.click();
      }
    } catch (error) {
      console.error('Error exporting image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Format</label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {imageFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Size</label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(imageSizes).map(([key, size]) => (
                  <SelectItem key={key} value={key}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Filename</label>
            <Input
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={() => handleExport(false)} 
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? 'Processing...' : 'Download'}
            </Button>
            <Button 
              onClick={() => handleExport(true)} 
              variant="outline" 
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? 'Processing...' : 'Export All Sizes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;