// // src/components/EditArea/SliderLabel.tsx
// import React, { useState } from "react";
// import { ChevronUp, ChevronDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// interface SliderLabelProps {
//   label: string;
//   value: number;
//   onChange: (value: number) => void;
//   min?: number;
//   max?: number;
//   step?: number;
// }

// const SliderLabel: React.FC<SliderLabelProps> = ({ label, value, onChange, min = -100, max = 100, step = 1 }) => {
//   const [inputValue, setInputValue] = useState(value.toString());
//   const [isFocused, setIsFocused] = useState(false);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value);
//   };

//   const handleInputBlur = () => {
//     setIsFocused(false);
//     const newValue = Math.min(max, Math.max(min, parseInt(inputValue) || 0));
//     setInputValue(newValue.toString());
//     onChange(newValue);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       e.currentTarget.blur();
//     }
//   };

//   const incrementValue = () => {
//     const newValue = Math.min(max, value + step);
//     onChange(newValue);
//     setInputValue(newValue.toString());
//   };

//   const decrementValue = () => {
//     const newValue = Math.max(min, value - step);
//     onChange(newValue);
//     setInputValue(newValue.toString());
//   };

//   // Update local input value when external value changes
//   React.useEffect(() => {
//     if (!isFocused) {
//       setInputValue(value.toString());
//     }
//   }, [value, isFocused]);

//   return (
//     <label className="text-sm font-medium flex justify-between items-center gap-2">
//       <p className="text-xs lg:text-sm">{label}</p>
//       <div className="flex items-center gap-6 md:gap-1">
//         <div className="flex flex-col">
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             onClick={decrementValue}
//             className="h-4 w-4 p-0 hover:bg-accent">
//             <ChevronDown className="h-3 w-3" />
//           </Button>
//         </div>
//         <Input
//           type="text"
//           value={inputValue}
//           onChange={handleInputChange}
//           onBlur={handleInputBlur}
//           onKeyDown={handleKeyDown}
//           onFocus={() => setIsFocused(true)}
//           className="w-16 md:w-10 h-6 px-0 text-[12px] md:bg-background bg-muted/60 pointer-events-none md:pointer-events-auto font-mono text-center"
//         />
//         <div className="flex flex-col">
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             onClick={incrementValue}
//             className="h-4 w-4 p-0 hover:bg-accent">
//             <ChevronUp className="h-3 w-3" />
//           </Button>
//         </div>
//       </div>
//     </label>
//   );
// };

// export default SliderLabel;

// src/components/EditArea/SliderLabel.tsx
import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SliderLabelProps {
  label: string;
  value?: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const SliderLabel: React.FC<SliderLabelProps> = ({ 
  label, 
  value = 0, // Default value if undefined
  onChange, 
  min = -100, 
  max = 100, 
  step = 1 
}) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    const parsedValue = parseInt(inputValue);
    const newValue = isNaN(parsedValue) ? 0 : Math.min(max, Math.max(min, parsedValue));
    setInputValue(newValue.toString());
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const incrementValue = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const decrementValue = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  // Update local input value when external value changes
  useEffect(() => {
    if (!isFocused) {
      setInputValue(value.toString());
    }
  }, [value, isFocused]);

  return (
    <label className="text-sm font-medium flex justify-between items-center gap-2">
      <p className="text-xs lg:text-sm">{label}</p>
      <div className="flex items-center gap-6 md:gap-1">
        <div className="flex flex-col">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={decrementValue}
            className="h-4 w-4 p-0 hover:bg-accent">
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          className="w-16 md:w-10 h-6 px-0 text-[12px] md:bg-background bg-muted/60 pointer-events-none md:pointer-events-auto font-mono text-center"
        />
        <div className="flex flex-col">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={incrementValue}
            className="h-4 w-4 p-0 hover:bg-accent">
            <ChevronUp className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </label>
  );
};

export default SliderLabel;