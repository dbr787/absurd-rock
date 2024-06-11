"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ClipboardCopyIcon, CheckIcon } from "@radix-ui/react-icons";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css"; // Import the necessary CSS for react-resizable

// Define form validation schema
const formSchema = z.object({
  outerRadius: z.number().min(0),
  distance: z.number().min(0).max(256),
  outerWidth: z.number().min(256).max(512),
  outerHeight: z.number().min(256).max(512),
});

type FormSchema = z.infer<typeof formSchema>;

const defaultOuterRadius = 64;
const defaultDistance = 32;
const defaultOuterWidth = 512;
const defaultOuterHeight = 512;

// Calculate inner radius based on outer radius and distance
const calculateInnerRadius = (
  outerRadius: number,
  distance: number
): string => {
  const minRadius = outerRadius / Math.PI;
  const calculatedInnerRadius = Math.max(minRadius, outerRadius - distance);
  return Number.isInteger(calculatedInnerRadius)
    ? String(calculatedInnerRadius)
    : calculatedInnerRadius.toFixed(2);
};

// Slider component with memoization to avoid unnecessary re-renders
const ShadcnSlider = React.memo(function ShadcnSlider({
  value,
  onChange,
  min,
  max,
  step,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <Slider
      min={min}
      max={max}
      step={step}
      value={[value]}
      onValueChange={(value) => onChange(value[0])}
      className="pt-4"
    />
  );
});
ShadcnSlider.displayName = "ShadcnSlider";

// Main form component
export function RectangleRadiusForm() {
  const [innerRadius, setInnerRadius] = useState<string | null>(null);
  const [outerRadius, setOuterRadius] = useState<number>(defaultOuterRadius);
  const [distance, setDistance] = useState<number>(defaultDistance);
  const [outerWidth, setOuterWidth] = useState<number>(defaultOuterWidth);
  const [outerHeight, setOuterHeight] = useState<number>(defaultOuterHeight);
  const [maxRadius, setMaxRadius] = useState<number>(
    Math.min(defaultOuterWidth / 2, defaultOuterHeight / 2)
  );
  const [maxPadding, setMaxPadding] = useState<number>(
    Math.min(defaultOuterWidth / 2, defaultOuterHeight / 2)
  );
  const [initialized, setInitialized] = useState<boolean>(false);
  const [tooltipText, setTooltipText] = useState<string>("Copy to clipboard");
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      outerRadius: defaultOuterRadius,
      distance: defaultDistance,
      outerWidth: defaultOuterWidth,
      outerHeight: defaultOuterHeight,
    },
  });

  // Initialize form values and inner radius
  useLayoutEffect(() => {
    const initialInnerRadius = calculateInnerRadius(
      defaultOuterRadius,
      defaultDistance
    );
    setInnerRadius(initialInnerRadius);
    form.setValue("outerRadius", defaultOuterRadius);
    form.setValue("distance", defaultDistance);
    form.setValue("outerWidth", defaultOuterWidth);
    form.setValue("outerHeight", defaultOuterHeight);
    setInitialized(true);
  }, [form]);

  useEffect(() => {
    const subscription = form.watch(
      ({ outerRadius, distance, outerWidth, outerHeight }) => {
        if (
          outerRadius !== undefined &&
          distance !== undefined &&
          outerWidth !== undefined &&
          outerHeight !== undefined
        ) {
          setOuterRadius(outerRadius);
          setDistance(distance);
          setOuterWidth(outerWidth);
          setOuterHeight(outerHeight);
          const newMaxRadius = Math.min(outerWidth / 2, outerHeight / 2);
          const newMaxPadding = Math.min(outerWidth / 2, outerHeight / 2);
          setMaxRadius(newMaxRadius);
          setMaxPadding(newMaxPadding);
          if (outerRadius > newMaxRadius) {
            form.setValue("outerRadius", newMaxRadius);
            setOuterRadius(newMaxRadius);
          }
          if (distance > newMaxPadding) {
            form.setValue("distance", newMaxPadding);
            setDistance(newMaxPadding);
          }
          const updatedInnerRadius = calculateInnerRadius(
            outerRadius,
            distance
          );
          setInnerRadius(updatedInnerRadius);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [form]);

  // Handle copy to clipboard
  const handleCopy = () => {
    if (innerRadius) {
      navigator.clipboard.writeText(innerRadius).then(() => {
        setTooltipText("Copied!");
        setTooltipOpen(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setTooltipText("Copy to clipboard");
        }, 3000); // Reset after 3 seconds
      });
    }
  };

  // Handle form reset
  const handleReset = () => {
    form.reset({
      outerRadius: defaultOuterRadius,
      distance: defaultDistance,
      outerWidth: defaultOuterWidth,
      outerHeight: defaultOuterHeight,
    });
    setOuterRadius(defaultOuterRadius);
    setDistance(defaultDistance);
    setOuterWidth(defaultOuterWidth);
    setOuterHeight(defaultOuterHeight);
    const resetInnerRadius = calculateInnerRadius(
      defaultOuterRadius,
      defaultDistance
    );
    setInnerRadius(resetInnerRadius);
  };

  if (!initialized) return null; // Prevent rendering until initialized

  // Sanitize input to remove non-digit characters and limit range
  const sanitizeInput = (value: string) => {
    let sanitizedValue = value.replace(/[^0-9]/g, ""); // Remove non-digit characters
    sanitizedValue = sanitizedValue.replace(/^0+(?!$)/, ""); // Remove leading zeros but keep a single "0" if it's the only character
    const numericValue = parseInt(sanitizedValue, 10);
    return numericValue > 512 ? "512" : sanitizedValue;
  };

  // Handle input change and sanitize the value
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    field.onChange(Number(sanitizedValue)); // Update field with sanitized numeric value
  };

  // Prevent invalid characters in input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const invalidChars = ["-", "+", ".", "e"];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };

  const innerRectangleWidth = Math.max(0, outerWidth - 2 * distance);
  const innerRectangleHeight = Math.max(0, outerHeight - 2 * distance);

  const handleInnerResize = (e, data) => {
    const newDistance = Math.max(
      0,
      Math.round(
        (outerWidth - data.size.width) / 2 +
          (outerHeight - data.size.height) / 2
      ) / 2
    );
    setDistance(newDistance);
    form.setValue("distance", newDistance);
    setInnerRadius(calculateInnerRadius(outerRadius, newDistance));
  };

  return (
    <div className="flex space-x-8">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(() => {})}>
          {/* Outer Width Field */}
          <FormField
            control={form.control}
            name="outerWidth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Outer Width</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      placeholder="Outer Width"
                      type="number"
                      min={256}
                      max={512}
                      {...field}
                      autoComplete="off" // Disable autosuggest/autocomplete
                      value={field.value.toString()} // Ensure the value is a string for the input
                      onChange={(e) => {
                        handleInputChange(e, field);
                        setOuterWidth(Number(e.target.value));
                      }} // Sanitize input
                      onKeyDown={handleKeyDown} // Prevent invalid characters
                    />
                    <ShadcnSlider
                      value={field.value} // Ensure the value is a number
                      onChange={(value) => {
                        field.onChange(value);
                        setOuterWidth(value);
                      }}
                      min={256}
                      max={512}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Outer Height Field */}
          <FormField
            control={form.control}
            name="outerHeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Outer Height</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      placeholder="Outer Height"
                      type="number"
                      min={256}
                      max={512}
                      {...field}
                      autoComplete="off" // Disable autosuggest/autocomplete
                      value={field.value.toString()} // Ensure the value is a string for the input
                      onChange={(e) => {
                        handleInputChange(e, field);
                        setOuterHeight(Number(e.target.value));
                      }} // Sanitize input
                      onKeyDown={handleKeyDown} // Prevent invalid characters
                    />
                    <ShadcnSlider
                      value={field.value} // Ensure the value is a number
                      onChange={(value) => {
                        field.onChange(value);
                        setOuterHeight(value);
                      }}
                      min={256}
                      max={512}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Outer Radius Field */}
          <FormField
            control={form.control}
            name="outerRadius"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Outer Radius</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      placeholder="Outer Radius"
                      type="number"
                      min={0}
                      max={maxRadius}
                      {...field}
                      autoComplete="off" // Disable autosuggest/autocomplete
                      value={field.value.toString()} // Ensure the value is a string for the input
                      onChange={(e) => {
                        handleInputChange(e, field);
                        setOuterRadius(Number(e.target.value));
                      }} // Sanitize input
                      onKeyDown={handleKeyDown} // Prevent invalid characters
                    />
                    <ShadcnSlider
                      value={field.value} // Ensure the value is a number
                      onChange={(value) => {
                        field.onChange(value);
                        setOuterRadius(value);
                      }}
                      max={maxRadius}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Distance Field */}
          <FormField
            control={form.control}
            name="distance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Padding</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      placeholder="Padding"
                      type="number"
                      min={0}
                      max={maxPadding}
                      {...field}
                      autoComplete="off" // Disable autosuggest/autocomplete
                      value={field.value.toString()} // Ensure the value is a string for the input
                      onChange={(e) => {
                        handleInputChange(e, field);
                        setDistance(Number(e.target.value));
                      }} // Sanitize input
                      onKeyDown={handleKeyDown} // Prevent invalid characters
                    />
                    <ShadcnSlider
                      value={field.value} // Ensure the value is a number
                      onChange={(value) => {
                        field.onChange(value);
                        setDistance(value);
                      }}
                      max={maxPadding}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Calculated Inner Radius Field */}
          <FormItem>
            <FormLabel>Calculated Inner Radius</FormLabel>
            <FormControl className="relative group">
              <div>
                <Input
                  placeholder="Calculated Inner Radius"
                  type="text"
                  value={innerRadius || ""}
                  disabled
                  className="pr-10 cursor-default" // Add padding to the right to accommodate the icon and set cursor to default
                  style={{ cursor: "default" }} // Inline style for default cursor
                />
                <TooltipProvider delayDuration={0}>
                  <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute right-1 top-1 h-7 w-7 rounded-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 ${
                          tooltipText === "Copied!"
                            ? "text-green-500 cursor-default hover:bg-inherit hover:text-accent-inherit"
                            : "text-gray-400 cursor-pointer hover:text-gray-600"
                        }`}
                        onClick={handleCopy}
                      >
                        {tooltipText === "Copied!" ? (
                          <CheckIcon />
                        ) : (
                          <ClipboardCopyIcon />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tooltipText}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </FormControl>
          </FormItem>

          {/* Reset Button */}
          <div className="flex space-x-4">
            <Button type="button" onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
        </form>
      </Form>

      {/* Draw Boxes */}
      <div className="mt-8 w-[512px] relative">
        <div
          className="absolute flex justify-center w-full"
          style={{ top: -20 }}
        >
          <span className="text-xs font-mono">
            {outerWidth}x{outerHeight} r{outerRadius}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ResizableBox
            width={outerWidth}
            height={outerHeight}
            minConstraints={[256, 256]}
            maxConstraints={[512, 512]}
            resizeHandles={["n", "e", "s", "w"]}
            onResize={(e, data) => {
              const width = Math.round(data.size.width);
              const height = Math.round(data.size.height);
              setOuterWidth(width);
              setOuterHeight(height);
              form.setValue("outerWidth", width);
              form.setValue("outerHeight", height);
              const newMaxRadius = Math.min(width / 2, height / 2);
              setMaxRadius(newMaxRadius);
              if (outerRadius > newMaxRadius) {
                setOuterRadius(newMaxRadius);
                form.setValue("outerRadius", newMaxRadius);
              }
              const updatedInnerRadius = calculateInnerRadius(
                outerRadius,
                distance
              );
              setInnerRadius(updatedInnerRadius);
            }}
            className="bg-gray-100 relative"
            style={{
              borderRadius: `${outerRadius}px`,
              padding: `${distance}px`,
              opacity: 0.7, // Add transparency
            }}
          >
            <ResizableBox
              width={outerWidth - 2 * distance}
              height={outerHeight - 2 * distance}
              minConstraints={[0, 0]}
              maxConstraints={[outerWidth - 2, outerHeight - 2]}
              resizeHandles={["s", "w", "n", "e"]}
              onResize={handleInnerResize}
              className="bg-gray-300"
              style={{
                borderRadius: `${innerRadius}px`,
                opacity: 0.7, // Add transparency
              }}
            >
              <div className="text-center text-xs font-mono">
                {Math.max(0, outerWidth - 2 * distance)}x
                {Math.max(0, outerHeight - 2 * distance)} r{innerRadius}
              </div>
            </ResizableBox>
          </ResizableBox>
        </div>
      </div>
    </div>
  );
}
