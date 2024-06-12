"use client";

import React, { useState } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import "tailwindcss/tailwind.css";

const ResizableRectangle: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 256, height: 256 });

  return (
    <div className="p-8 flex justify-center space-x-4">
      <div className="border rounded-md p-6 border-solid bg-white shadow-md w-[320px] h-[320px] flex items-center justify-center">
        <ResizableBox
          width={dimensions.width}
          height={dimensions.height}
          minConstraints={[4, 4]}
          maxConstraints={[256, 256]}
          onResizeStop={(event, { size }) =>
            setDimensions({ width: size.width, height: size.height })
          }
          resizeHandles={["s", "e", "w", "n", "se", "sw", "ne", "nw"]}
          className="bg-blue-400"
        ></ResizableBox>
      </div>
      <div className="border rounded-md p-6 border-solid bg-white shadow-md w-[320px] h-[320px] flex items-center justify-center text-center text-xs font-mono">
        Width: {dimensions.width}px, Height: {dimensions.height}px
      </div>
    </div>
  );
};

export default ResizableRectangle;
