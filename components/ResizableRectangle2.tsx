"use client";

import React, { useState, useEffect } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";
import "react-resizable/css/styles.css";
import "tailwindcss/tailwind.css";

const ResizableRectangle: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 256, height: 256 });
  const [borderRadius, setBorderRadius] = useState(0);
  const [distances, setDistances] = useState({
    toCenterBox: 0,
    toCornerBox: 0,
    toEdgeBox: 0,
  });
  const [showLines, setShowLines] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const maxRadius = Math.min(dimensions.width, dimensions.height) / 2;

  const formatNumber = (num: number) => (num % 1 === 0 ? num : num.toFixed(2));

  const calculateDistances = (radius: number) => {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    return {
      toCenterBox: Math.sqrt(
        Math.pow(centerX - radius, 2) + Math.pow(centerY - radius, 2)
      ),
      toCornerBox: Math.sqrt(2 * Math.pow(radius, 2)),
      toEdgeBox: radius,
    };
  };

  useEffect(() => {
    setDistances(calculateDistances(borderRadius));
  }, [borderRadius, dimensions]);

  const onResize: ResizableBoxProps["onResize"] = (event, { size }) => {
    const width = Math.round(size.width);
    const height = Math.round(size.height);
    setDimensions({ width, height });

    const newMaxRadius = Math.min(width, height) / 2;
    const adjustedRadius = Math.min(borderRadius, newMaxRadius);
    setBorderRadius(adjustedRadius);
    setDistances(calculateDistances(adjustedRadius));
  };

  const startDrag = (e: React.MouseEvent) => {
    setShowLines(true);
    setIsDragging(true);
    const startX = e.clientX;
    const startRadius = borderRadius;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newRadius = Math.max(0, Math.min(maxRadius, startRadius + deltaX));
      setBorderRadius(newRadius);
      setDistances(calculateDistances(newRadius));
    };

    const onMouseUp = () => {
      setShowLines(false);
      setIsDragging(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="p-8 flex flex-col items-center space-y-4">
      <div className="relative border rounded-md p-8 border-solid bg-white shadow-md w-[320px] h-[320px] flex items-center justify-center">
        <div className="relative group custom-resizable-box">
          <ResizableBox
            width={dimensions.width}
            height={dimensions.height}
            minConstraints={[4, 4]}
            maxConstraints={[256, 256]}
            onResize={onResize}
            resizeHandles={["s", "e", "w", "n"]}
            className="bg-purple-300"
            style={{ borderRadius: `${borderRadius}px`, position: "relative" }}
          >
            <div className="w-full h-full relative"></div>
          </ResizableBox>
          <div
            className={`w-2 h-2 bg-purple-500 rounded-full cursor-pointer absolute transition-opacity ${
              isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            style={{
              top: `${borderRadius}px`,
              left: `${borderRadius}px`,
              transform: "translate(-50%, -50%)",
            }}
            onMouseDown={startDrag}
          ></div>
          {showLines && (
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-200 ease-in-out">
              <line
                x1={borderRadius}
                y1={borderRadius}
                x2={0}
                y2={0}
                className="stroke-red-500"
                strokeWidth="1"
                strokeDasharray="1,2"
              />
              <line
                x1={borderRadius}
                y1={borderRadius}
                x2={dimensions.width / 2}
                y2={dimensions.height / 2}
                className="stroke-green-500"
                strokeWidth="1"
                strokeDasharray="1,2"
              />
              <line
                x1={borderRadius}
                y1={borderRadius}
                x2={borderRadius}
                y2={0}
                className="stroke-blue-500"
                strokeWidth="1"
                strokeDasharray="1,2"
              />
            </svg>
          )}
        </div>
      </div>
      <div className="border rounded-md p-6 border-solid bg-white shadow-md w-[320px] flex flex-col items-center justify-center text-center text-xs font-mono space-y-2">
        <div className="flex justify-between w-full">
          <span>Width:</span>
          <span style={{ width: "80px", textAlign: "right" }}>
            {formatNumber(dimensions.width)}px
          </span>
        </div>
        <div className="flex justify-between w-full">
          <span>Height:</span>
          <span style={{ width: "80px", textAlign: "right" }}>
            {formatNumber(dimensions.height)}px
          </span>
        </div>
        <div className="flex justify-between w-full">
          <span>Border Radius:</span>
          <span style={{ width: "80px", textAlign: "right" }}>
            {formatNumber(borderRadius)}px
          </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-red-500">Corner Distance:</span>
          <span
            className="text-red-500"
            style={{ width: "80px", textAlign: "right" }}
          >
            {formatNumber(distances.toCornerBox)}px
          </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-green-500">Center Distance:</span>
          <span
            className="text-green-500"
            style={{ width: "80px", textAlign: "right" }}
          >
            {formatNumber(distances.toCenterBox)}px
          </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-blue-500">Edge Distance:</span>
          <span
            className="text-blue-500"
            style={{ width: "80px", textAlign: "right" }}
          >
            {formatNumber(distances.toEdgeBox)}px
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResizableRectangle;
