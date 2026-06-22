import { cva, VariantProps } from "class-variance-authority";
import { CSSProperties } from "react";
import { twMerge } from "tailwind-merge";

const BadgeVariants = cva("w-max h-max rounded-sm break-keep", {
  variants: {
    size: {
      xs: "text-xs px-1.5 py-[3.5px]",
      sm: "text-xs px-1.5 py-[3.5px] ",
      md: "text-sm px-2 py-[4.5px] ",
      lg: "text-base px-[14.5px] py-[9px] ",
      xl: "text-base px-[17px] py-[9px] ",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface BadgeProps extends VariantProps<typeof BadgeVariants> {
  text: string;
  className?: string;
  style?: CSSProperties;
}

export default function Badge({ size, text, className, style }: BadgeProps) {
  return (
    <>
      <div className={twMerge(BadgeVariants({ size }), className)} style={style}>
        {text}
      </div>
    </>
  );
}
