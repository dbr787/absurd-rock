"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

const RadiusCalculator: React.FC = () => {
  const [outerWidth, setOuterWidth] = useState<string>("240");
  const [outerHeight, setOuterHeight] = useState<string>("180");
  const [outerRadius, setOuterRadius] = useState<string>("12");
  const [innerWidth, setInnerWidth] = useState<string>("80");
  const [innerHeight, setInnerHeight] = useState<string>("60");
  const [x, setX] = useState<string>("10");
  const [y, setY] = useState<string>("20");
  const [innerRadius, setInnerRadius] = useState<number | null>(null);

  useEffect(() => {
    const calculateInnerRadius = () => {
      const widthA = Number(outerWidth) || 0;
      const heightA = Number(outerHeight) || 0;
      const radiusA = Number(outerRadius) || 0;
      const widthB = Number(innerWidth) || 0;
      const heightB = Number(innerHeight) || 0;
      const posX = Number(x) || 0;
      const posY = Number(y) || 0;

      const distRight = widthA - (posX + widthB);
      const distBottom = heightA - (posY + heightB);
      const widthRatio = widthB / widthA;
      const heightRatio = heightB / heightA;
      const rWidth = radiusA * widthRatio;
      const rHeight = radiusA * heightRatio;
      const minDist = Math.max(0, Math.min(posX, posY, distRight, distBottom));
      const calculatedInnerRadius = Math.max(
        0,
        Math.min(rWidth, rHeight, minDist)
      );
      setInnerRadius(calculatedInnerRadius);
    };

    calculateInnerRadius();
  }, [outerWidth, outerHeight, outerRadius, innerWidth, innerHeight, x, y]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Rectangle Radius Calculator</h1>
      <form>
        <div>
          <label>Outer Width: </label>
          <Input
            type="number"
            placeholder="Outer Width"
            value={outerWidth}
            onChange={(e) => setOuterWidth(e.target.value)}
          />
        </div>
        <div>
          <label>Outer Height: </label>
          <Input
            type="number"
            placeholder="Outer Height"
            value={outerHeight}
            onChange={(e) => setOuterHeight(e.target.value)}
          />
        </div>
        <div>
          <label>Outer Radius: </label>
          <Input
            type="number"
            placeholder="Outer Radius"
            value={outerRadius}
            onChange={(e) => setOuterRadius(e.target.value)}
          />
        </div>
        <div>
          <label>Inner Width: </label>
          <Input
            type="number"
            placeholder="Inner Width"
            value={innerWidth}
            onChange={(e) => setInnerWidth(e.target.value)}
          />
        </div>
        <div>
          <label>Inner Height: </label>
          <Input
            type="number"
            placeholder="Inner Height"
            value={innerHeight}
            onChange={(e) => setInnerHeight(e.target.value)}
          />
        </div>
        <div>
          <label>X Position (from left): </label>
          <Input
            type="number"
            placeholder="X Position"
            value={x}
            onChange={(e) => setX(e.target.value)}
          />
        </div>
        <div>
          <label>Y Position (from top): </label>
          <Input
            type="number"
            placeholder="Y Position"
            value={y}
            onChange={(e) => setY(e.target.value)}
          />
        </div>
      </form>
      {innerRadius !== null && (
        <div>
          <h2>Calculated Inner Radius: {innerRadius.toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
};

export default RadiusCalculator;
