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

const formSchema = z.object({
  outerRadius: z.number().min(0).max(1024),
  distance: z.number().min(0).max(1024),
});

type FormSchema = z.infer<typeof formSchema>;

const defaultOuterRadius = 10;
const defaultDistance = 4;

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
      max={1024}
      value={[value]}
      onValueChange={(value) => onChange(value[0])}
      className="w-full"
    />
  );
});
ShadcnSlider.displayName = "ShadcnSlider";

export function RectangleRadiusForm() {
  const [innerRadius, setInnerRadius] = useState<string | null>(null);
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
        const updatedInnerRadius = calculateInnerRadius(outerRadius, distance);
        setInnerRadius(updatedInnerRadius);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

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

  const handleReset = () => {
    form.reset({
      outerRadius: defaultOuterRadius,
      distance: defaultDistance,
    });
    const resetInnerRadius = calculateInnerRadius(
      defaultOuterRadius,
      defaultDistance
    );
    setInnerRadius(resetInnerRadius);
  };

  if (!initialized) return null; // Prevent rendering until initialized

  const sanitizeInput = (value: string) => {
    let sanitizedValue = value.replace(/[^0-9]/g, ""); // Remove non-digit characters
    sanitizedValue = sanitizedValue.replace(/^0+(?!$)/, ""); // Remove leading zeros but keep a single "0" if it's the only character
    const numericValue = parseInt(sanitizedValue, 10);
    return numericValue > 1024 ? "1024" : sanitizedValue;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    field.onChange(Number(sanitizedValue)); // Update field with sanitized numeric value
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const invalidChars = ["-", "+", ".", "e"];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
        <FormField
          control={form.control}
          name="outerRadius"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Outer Radius</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <Input
                    placeholder="Outer Radius"
                    type="number"
                    min={0}
                    max={1024}
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
        <FormField
          control={form.control}
          name="distance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distance from Outer Rectangle</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <Input
                    placeholder="Distance"
                    type="number"
                    min={0}
                    max={1024}
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
        <div className="flex space-x-4">
          <Button type="button" onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
