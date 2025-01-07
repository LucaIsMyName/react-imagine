# React Imagine Editor

**this app is in active development, some or many features might not work as expected**

A modern, responsive image editor built with React, TypeScript, and Tailwind CSS. Transform your images with artistic filters, basic adjustments, and preserve metadata * all in your browser with no server uploads required.

## Features

* 🎨 Artistic filters (Cubism, Pointillism, Modern Art)
* 📊 Basic image adjustments (brightness, contrast, saturation, etc.)
* 🏷️ Metadata preservation and editing
* 📱 Responsive design for desktop and mobile
* 🌓 Dark/Light mode support
* 💾 Local storage for session persistence
* 🖼️ Multiple image input methods (upload, URL, file browser)
* 📤 Export with custom sizes and formats

## Installation

### Prerequisites
* Node.js (v16 or higher)
* npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/LucaIsMyName/react-imagine.git
cd react-image
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
react-image/
├── src/
│   ├── components/
│   │   ├── EditArea/           # Image editing controls
│   │   ├── ImageArea/          # Main image display
│   │   ├── GlobalSettings/     # App-wide settings
│   │   └── ui/                 # Reusable UI components
│   ├── contexts/
│   │   ├── EditorContext.tsx   # Image editing state
│   │   └── ThemeContext.tsx    # Theme management
│   ├── lib/
│   │   └── effects/           # Image processing effects
│   ├── types/                 # TypeScript definitions
│   └── styles/                # Global styles
└── public/
    └── fonts/                 # Local font files
```

## API Documentation

### Context APIs

#### EditorContext
Manages the global state for image editing.

```typescript
interface EditorState {
  image: string | null;
  filterSettings: FilterSettings;
  metadata: ImageMetadata;
}

interface FilterSettings {
  brightness: number;     // Range: -100 to 100
  contrast: number;       // Range: -100 to 100
  saturation: number;     // Range: -100 to 100
  highlights: number;     // Range: -100 to 100
  shadows: number;        // Range: -100 to 100
  artStyle: ArtStyle;     // 'none' | 'cubism' | 'pointillism' | 'modern' | 'abstract'
}

interface ImageMetadata {
  title: string;
  description: string;
  copyright: string;
  author: string;
  keywords: string[];
  dateCreated: string;
  location: string;
  altText: string;
}
```

Actions:
* `SET_IMAGE`: Set or clear the current image
* `UPDATE_FILTER`: Update filter settings
* `UPDATE_METADATA`: Update image metadata
* `RESET_FILTERS`: Reset all filters to default values

#### ThemeContext
Manages the application theme.

```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
```

### Art Effects API

Art effects are implemented as functions with the following signature:
```typescript
type ArtEffect = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number
) => void;
```

Available effects:
* `applyCubismEffect`: Transforms image into cubist style
* `applyPointillismEffect`: Creates pointillist effect
* `applyModernEffect`: Applies modern art style
* `applyAbstractEffect`: Creates abstract interpretation

## Upcoming Features

### Image Rotation
* [ ] Add rotation controls
  * Preset buttons for 90°, 180°, 270°
  * Custom angle input (-360° to 360°)
  * Preview during rotation
  * Maintain aspect ratio
  * Update canvas size accordingly

### Image Cropping
* [ ] Implement cropping functionality
  * Interactive crop area selection
  * Aspect ratio presets (16:9, 4:3, 1:1, etc.)
  * Custom aspect ratio input
  * Crop area resize handles
  * Maintain original image quality
  * Preview crop result

### Additional TODOs
* [ ] Add image resize functionality
* [ ] Implement undo/redo history
* [ ] Add keyboard shortcuts
* [ ] Add Drag'n'Drop for Blank `<ImageArea />`
* [ ] Optimize performance for large images
  * [ ] might be better to NOT load them into local storage as Base64
* [ ] Add more art filters and fix the current ones
  * [ ] Pointillism: Good
  * [ ] Modern: Bad
  * [ ] Cubism: Bad
* [ ] Make Granularity and Randomness Slider work in Art Filters
* [ ] Add more export options and presets
* [ ] Improve mobile touch interactions
* [ ] Remove unnecessary Re-Rendering of Components (`memo` & `useMemo()`)
* [ ] Consider implementing React-Compiler for better Perfoamnce

## License

This project is licensed under the MIT License * see the LICENSE file for details.
