"use client";

import React, { useState, useEffect, useRef } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";
import "react-resizable/css/styles.css";
import "tailwindcss/tailwind.css";

const ResizableRectangle: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 256, height: 256 });
  const [borderRadius, setBorderRadius] = useState(0);
  const handleRef = useRef<HTMLDivElement | null>(null);

  const maxRadius = Math.min(dimensions.width, dimensions.height) / 2;

  const onResize: ResizableBoxProps["onResize"] = (event, { size }) => {
    const width = Math.round(size.width);
    const height = Math.round(size.height);
    setDimensions({ width, height });
  };

  const startDrag = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startRadius = borderRadius;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const newRadius = Math.max(0, Math.min(maxRadius, startRadius + deltaX));
      setBorderRadius(newRadius);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="p-8 flex flex-col items-center space-y-4">
      <div className="border rounded-md p-8 border-solid bg-white shadow-md w-[320px] h-[320px] flex items-center justify-center">
        <div className="relative">
          <ResizableBox
            width={dimensions.width}
            height={dimensions.height}
            minConstraints={[4, 4]}
            maxConstraints={[256, 256]}
            onResize={onResize}
            resizeHandles={["s", "e", "w", "n", "se", "sw", "ne", "nw"]}
            className="bg-blue-200"
            style={{ borderRadius: `${borderRadius}px`, position: "relative" }}
          />
          <div
            ref={handleRef}
            className="w-2 h-2 bg-blue-500 rounded-full cursor-pointer absolute"
            style={{
              top: `${borderRadius}px`,
              left: `${borderRadius}px`,
              transform: `translate(-50%, -50%)`,
            }}
            onMouseDown={startDrag}
          ></div>
        </div>
      </div>
      <div className="border rounded-md p-6 border-solid bg-white shadow-md w-[320px] flex items-center justify-center text-center text-xs font-mono">
        Width: {dimensions.width}px, Height: {dimensions.height}px, Border
        Radius: {borderRadius}px
      </div>
    </div>
  );
};

export default ResizableRectangle;
