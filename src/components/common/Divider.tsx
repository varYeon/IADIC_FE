"use client";

import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const divider = cva("h-px mx-auto", {
  variants: {
    thickness: {
      subtle: "bg-gray-100",
      neutral: "bg-border-main",
      strong: "h-2.5 bg-gray-100",
    },
    width: {
      "25": "w-[25%]",
      "50": "w-[50%]",
      "75": "w-[75%]",
      "90": "w-[90%]",
      "95": "w-[95%]",
      "100": "w-full",
    },
  },

  defaultVariants: {
    thickness: "neutral",
  },
});

interface DividerProps extends VariantProps<typeof divider> {
  className?: string;
  width?: "25" | "50" | "75" | "90" | "95" | "100";
}

export function Divider({ thickness, width = "100", className }: DividerProps) {
  return (
    <>
      <div className={twMerge(divider({ thickness, width }), className)}></div>
    </>
  );
}
