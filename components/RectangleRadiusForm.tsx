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

// Define form validation schema
const formSchema = z.object({
  outerRadius: z.number().min(0).max(256),
  distance: z.number().min(0).max(256),
});

type FormSchema = z.infer<typeof formSchema>;

const defaultOuterRadius = 10;
const defaultDistance = 4;

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
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <Slider
      min={0}
      max={256}
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
  const [initialized, setInitialized] = useState<boolean>(false);
  const [tooltipText, setTooltipText] = useState<string>("Copy to clipboard");
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      outerRadius: defaultOuterRadius,
      distance: defaultDistance,
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
    setInitialized(true);
  }, [form]);

  useEffect(() => {
    const subscription = form.watch(({ outerRadius, distance }) => {
      if (outerRadius !== undefined && distance !== undefined) {
        setOuterRadius(outerRadius);
        setDistance(distance);
        const updatedInnerRadius = calculateInnerRadius(outerRadius, distance);
        setInnerRadius(updatedInnerRadius);
      }
    });

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
    });
    setOuterRadius(defaultOuterRadius);
    setDistance(defaultDistance);
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
    return numericValue > 256 ? "256" : sanitizedValue;
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

  const outerRectangleWidth = 512;
  const outerRectangleHeight = 256;
  const innerRectangleWidth = Math.max(0, 512 - 2 * distance);
  const innerRectangleHeight = Math.max(0, 256 - 2 * distance);
  const adjustedOuterWidth = Math.max(
    outerRectangleWidth,
    outerRectangleWidth + 2 * distance - 512
  );
  const adjustedOuterHeight = Math.max(
    outerRectangleHeight,
    outerRectangleHeight + 2 * distance - 256
  );

  return (
    <Form {...form}>
      <div className="flex">
        <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
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
                      max={256}
                      {...field}
                      autoComplete="off" // Disable autosuggest/autocomplete
                      value={field.value.toString()} // Ensure the value is a string for the input
                      onChange={(e) => handleInputChange(e, field)} // Sanitize input
                      onKeyDown={handleKeyDown} // Prevent invalid characters
                    />
                    <ShadcnSlider
                      value={field.value} // Ensure the value is a number
                      onChange={(value) => field.onChange(value)}
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
                      max={256}
                      {...field}
                      autoComplete="off" // Disable autosuggest/autocomplete
                      value={field.value.toString()} // Ensure the value is a string for the input
                      onChange={(e) => handleInputChange(e, field)} // Sanitize input
                      onKeyDown={handleKeyDown} // Prevent invalid characters
                    />
                    <ShadcnSlider
                      value={field.value} // Ensure the value is a number
                      onChange={(value) => field.onChange(value)}
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

        {/* Draw Boxes */}
        <div className="ml-8 mt-8">
          <div className="text-center">
            <span className="text-xs font-mono">
              {adjustedOuterWidth}x{adjustedOuterHeight} r{outerRadius}
            </span>
          </div>
          <div
            className={`relative bg-gray-100 overflow-hidden`}
            style={{
              width: `${outerRectangleWidth}px`,
              height: `${outerRectangleHeight}px`,
              borderRadius: `${outerRadius}px`,
              padding: `${distance}px`,
            }}
          >
            <div
              className="text-center text-xs font-mono absolute left-0 right-0"
              style={{
                top: Math.max(0, distance) + "px",
              }}
            >
              {innerRectangleWidth}x{innerRectangleHeight} r{innerRadius}
            </div>
            <div
              className="w-full h-full bg-gray-300"
              style={{
                borderRadius: `${innerRadius}px`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </Form>
  );
}
