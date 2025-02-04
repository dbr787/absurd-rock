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
      <div className="relative border rounded-md p-8 border-solid shadow-md w-[320px] h-[320px] flex items-center justify-center bg-white">
        <div className="relative group">
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
            className={`z-10 w-2 h-2 bg-purple-500 rounded-full cursor-pointer absolute transition-opacity ${
              isDragging ? "opacity-100" : "opacity-100 group-hover:opacity-100"
            }`}
            style={{
              top: `${borderRadius}px`,
              left: `${borderRadius}px`,
              transform: "translate(-50%, -50%)",
            }}
            onMouseDown={startDrag}
          ></div>
          {showLines && (
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-200 ease-in-out overflow-visible">
              <defs>
                <marker
                  id="markerRed"
                  markerWidth="4"
                  markerHeight="4"
                  refX="2"
                  refY="2"
                >
                  {/* <circle cx="0.5" cy="0.5" r="0.5" className="fill-red-500" /> */}
                  <rect
                    x="1"
                    y="1"
                    width="2"
                    height="2"
                    className="fill-red-500"
                  />
                </marker>
                <marker
                  id="markerGreen"
                  markerWidth="4"
                  markerHeight="4"
                  refX="2"
                  refY="2"
                >
                  {/* <circle cx="2" cy="2" r="1.5" className="fill-green-500" /> */}
                  <rect
                    x="0.5"
                    y="0.5"
                    width="3"
                    height="3"
                    className="fill-green-500"
                  />
                </marker>
                <marker
                  id="markerBlue"
                  markerWidth="4"
                  markerHeight="4"
                  refX="2"
                  refY="2"
                >
                  {/* <circle cx="2" cy="2" r="1.5" className="fill-blue-500" /> */}
                  <rect
                    x="0.5"
                    y="0.5"
                    width="3"
                    height="3"
                    className="fill-blue-500"
                  />
                </marker>
              </defs>
              <line
                x1={borderRadius}
                y1={borderRadius}
                x2={0}
                y2={0}
                className="stroke-red-500 transition-colors duration-200"
                strokeWidth="2"
                strokeDasharray="0,4"
                strokeLinecap="round"
                strokeDashoffset={0}
                // marker-start="url(#markerRed)"
                marker-end="url(#markerRed)"
              />
              <line
                x1={borderRadius}
                y1={borderRadius}
                x2={dimensions.width / 2}
                y2={dimensions.height / 2}
                className="stroke-green-500 transition-colors duration-200"
                strokeWidth="2"
                strokeDasharray="0,4"
                strokeLinecap="round"
                strokeDashoffset={0}
                // marker-start="url(#markerGreen)"
                marker-end="url(#markerGreen)"
              />
              <line
                x1={borderRadius}
                y1={borderRadius}
                x2={borderRadius}
                y2={0}
                className="stroke-blue-500 transition-colors duration-200"
                strokeWidth="2"
                strokeDasharray="0,4"
                strokeLinecap="round"
                strokeDashoffset={0}
                // marker-start="url(#markerBlue)"
                marker-end="url(#markerBlue)"
              />
            </svg>
          )}
        </div>
      </div>
      <div className="border rounded-md p-6 border-solid bg-white shadow-md w-[320px] flex flex-col items-center justify-center text-center text-xs font-mono space-y-1 text-black">
        <div className="flex justify-between w-full">
          <span>Width:</span>
          <span className="w-20 text-right">
            {formatNumber(dimensions.width)}px
          </span>
        </div>
        <div className="flex justify-between w-full">
          <span>Height:</span>
          <span className="w-20 text-right">
            {formatNumber(dimensions.height)}px
          </span>
        </div>
        <div className="flex justify-between w-full">
          <span>Border Radius:</span>
          <span className="w-20 text-right">
            {formatNumber(borderRadius)}px
          </span>
        </div>
        <div
          className={`flex justify-between w-full transition-colors duration-200 ${
            isDragging ? "text-red-500" : ""
          }`}
        >
          <span>Corner Distance:</span>
          <span className="w-20 text-right">
            {formatNumber(distances.toCornerBox)}px
          </span>
        </div>
        <div
          className={`flex justify-between w-full transition-colors duration-200 ${
            isDragging ? "text-green-500" : ""
          }`}
        >
          <span>Center Distance:</span>
          <span className="w-20 text-right">
            {formatNumber(distances.toCenterBox)}px
          </span>
        </div>
        <div
          className={`flex justify-between w-full transition-colors duration-200 ${
            isDragging ? "text-blue-500" : ""
          }`}
        >
          <span>Edge Distance:</span>
          <span className="w-20 text-right">
            {formatNumber(distances.toEdgeBox)}px
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResizableRectangle;
