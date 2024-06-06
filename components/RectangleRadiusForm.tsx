"use client";

import React, { useState, useEffect } from "react";
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
import { ClipboardCopyIcon, CheckIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
  outerRadius: z
    .string()
    .refine(
      (val) =>
        val === "" ||
        (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 1024),
      {
        message: "Must be a number between 0 and 1024",
      }
    ),
  distance: z
    .string()
    .refine(
      (val) =>
        val === "" ||
        (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 1024),
      {
        message: "Must be a number between 0 and 1024",
      }
    ),
});

type FormSchema = z.infer<typeof formSchema>;

export function RectangleRadiusForm() {
  const [innerRadius, setInnerRadius] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [tooltipText, setTooltipText] = useState<string>("Copy to clipboard");
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      outerRadius: "10",
      distance: "4",
    },
  });

  useEffect(() => {
    const calculateInnerRadius = () => {
      const { outerRadius, distance } = form.getValues();

      if (outerRadius === "" || distance === "") {
        setInnerRadius(null);
        return;
      }

      const radiusA = Number(outerRadius);
      const dist = Number(distance);
      const minRadius = radiusA / Math.PI; // Minimum radius is outer radius divided by pi

      const calculatedInnerRadius = Math.max(minRadius, radiusA - dist);
      setInnerRadius(
        Number.isInteger(calculatedInnerRadius)
          ? String(calculatedInnerRadius)
          : calculatedInnerRadius.toFixed(2)
      );
    };

    const subscription = form.watch(calculateInnerRadius);
    calculateInnerRadius(); // Initial calculation on mount
    return () => subscription.unsubscribe();
  }, [form]);

  const sanitizeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    let value = e.target.value;
    if (value === "") {
      field.onChange(value);
      return;
    }

    value = value.replace(/[^0-9]/g, ""); // Ensure only digits are entered
    if (Number(value) > 1024) {
      value = "1024";
    }

    if (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 1024) {
      field.onChange(value);
    }
  };

  const handleCopy = () => {
    if (innerRadius) {
      navigator.clipboard.writeText(innerRadius).then(() => {
        setCopySuccess(true);
        setTooltipText("Copied!");
        setTooltipOpen(true);
        setTimeout(() => {
          setCopySuccess(false);
          setTooltipText("Copy to clipboard");
          setTooltipOpen(false);
        }, 2000); // Reset after 2 seconds
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="space-y-4">
        <FormField
          control={form.control}
          name="outerRadius"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Outer Radius</FormLabel>
              <FormControl>
                <Input
                  placeholder="Outer Radius"
                  type="number"
                  min={0}
                  max={1024}
                  value={field.value || ""}
                  onInput={sanitizeInput}
                  onChange={(e) => handleChange(e, field)}
                />
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
                <Input
                  placeholder="Distance"
                  type="number"
                  min={0}
                  max={1024}
                  value={field.value || ""}
                  onInput={sanitizeInput}
                  onChange={(e) => handleChange(e, field)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Calculated Inner Radius</FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                placeholder="Calculated Inner Radius"
                type="text"
                value={innerRadius || ""}
                disabled
                className="pr-10 cursor-default" // Add padding to the right to accommodate the icon and set cursor to default
              />
            </FormControl>
            <TooltipProvider delayDuration={0}>
              <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                <TooltipTrigger asChild>
                  {copySuccess ? (
                    <div className="absolute right-1 top-1 flex items-center justify-center h-7 w-7">
                      <CheckIcon className="text-green-500" />
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-7 w-7 rounded-sm text-gray-400 cursor-pointer hover:text-gray-600"
                      onClick={handleCopy}
                      onMouseEnter={() => setTooltipOpen(true)}
                      onMouseLeave={() => setTooltipOpen(false)}
                    >
                      <ClipboardCopyIcon />
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </FormItem>
        <Button type="submit">Calculate</Button>
      </form>
    </Form>
  );
}
