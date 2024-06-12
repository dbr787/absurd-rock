"use client";

import React, { useState, useEffect } from "react";

interface RectangleProps {
  initialWidth?: number;
  initialHeight?: number;
}

const ResizableRectangle: React.FC<RectangleProps> = ({
  initialWidth = 512,
  initialHeight = 512,
}) => {
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeX, setResizeX] = useState(0);
  const [resizeY, setResizeY] = useState(0);

  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    setResizeX(e.clientX);
    setResizeY(e.clientY);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isResizing) {
      const newWidth = Math.round(width + (e.clientX - resizeX));
      const newHeight = Math.round(height + (e.clientY - resizeY));
      requestAnimationFrame(() => {
        setWidth(newWidth);
        setHeight(newHeight);
        setResizeX(e.clientX);
        setResizeY(e.clientY);
      });
    }
  };

  useEffect(() => {
    const updateSize = () => {
      const newWidth = Math.round(width);
      const newHeight = Math.round(height);
      setWidth(newWidth);
      setHeight(newHeight);
    };

    const resizeListener = () => {
      requestAnimationFrame(updateSize);
    };

    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, [width, height]);

  return (
    <div className="w-[512px] h-[512px]">
      <div>
        <p className="text-center text-xs font-mono">{`${width} x ${height}`}</p>
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: "cornflowerblue",
            resize: "both",
            overflow: "auto",
          }}
          onMouseDown={handleResizeStart}
          onMouseUp={handleResizeEnd}
          onMouseMove={handleResize}
        />
      </div>
    </div>
  );
};

export default ResizableRectangle;
