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
import { Input } from "@/components/ui/input";

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
  const [innerRadius, setInnerRadius] = useState<number | null>(null);

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
      setInnerRadius(calculatedInnerRadius);
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
        {innerRadius !== null && (
          <div>
            <h2>Calculated Inner Radius: {innerRadius.toFixed(2)}</h2>
          </div>
        )}
        <Button type="submit">Calculate</Button>
      </form>
    </Form>
  );
}
