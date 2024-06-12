"use client";

import React, { useState, useEffect } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";
import Draggable from "react-draggable";
import "react-resizable/css/styles.css";
import "tailwindcss/tailwind.css";

const ResizableRectangle: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 256, height: 256 });
  const [borderRadius, setBorderRadius] = useState(0);
  const [maxRadius, setMaxRadius] = useState(0);

  useEffect(() => {
    const maxRadius = Math.min(dimensions.width, dimensions.height) / 2;
    setMaxRadius(maxRadius);
  }, [dimensions]);

  const onResize: ResizableBoxProps["onResize"] = (event, { size }) => {
    const width = Math.round(size.width);
    const height = Math.round(size.height);
    setDimensions({ width, height });
  };

  const handleDrag = (e: any, data: any) => {
    const newBorderRadius = Math.max(0, Math.min(maxRadius, data.x));
    setBorderRadius(newBorderRadius);
  };

  return (
    <div className="p-8 flex flex-col items-center space-y-4">
      <div className="relative border rounded-md p-6 border-solid bg-white shadow-md w-[320px] h-[320px] flex items-center justify-center">
        <ResizableBox
          width={dimensions.width}
          height={dimensions.height}
          minConstraints={[4, 4]}
          maxConstraints={[256, 256]}
          onResize={onResize}
          resizeHandles={["s", "e", "w", "n", "se", "sw", "ne", "nw"]}
          className="bg-blue-200"
          style={{ borderRadius: `${borderRadius}px` }}
        ></ResizableBox>
        <Draggable
          axis="both"
          bounds={{ left: 0, top: 0, right: maxRadius, bottom: maxRadius }}
          onDrag={handleDrag}
          position={{ x: borderRadius, y: borderRadius }}
        >
          <div
            className="w-2 h-2 bg-blue-500 rounded-full cursor-pointer"
            style={{
              position: "absolute",
              top: `${borderRadius - 8}px`,
              left: `${borderRadius - 8}px`,
            }}
          ></div>
        </Draggable>
      </div>
      <div className="border rounded-md p-6 border-solid bg-white shadow-md w-[320px] flex items-center justify-center text-center text-xs font-mono">
        Width: {dimensions.width}px, Height: {dimensions.height}px, Border
        Radius: {borderRadius}px
      </div>
    </div>
  );
};

export default ResizableRectangle;
