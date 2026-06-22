"use client";

import { cva, VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import { StaticImageData } from "next/image";
import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import BaseImage from "./image/BaseImage";

const navButtonVariants = cva(
  "flex items-center w-full text-left px-3 py-2 text-[12px] xl:text-[16px] lg:text-[16px] md:text-[14px] sm:text-[12px] rounded-lg cursor-pointer font-medium overflow-hidden relative",
  {
    variants: {
      variant: {
        main: "text-text-title sm:pl-4 justify-center sm:justify-start",
        sub: "text-text-sub pl-9",
      },
      active: {
        true: "text-blue-500",
        false: "",
      },
    },
    defaultVariants: {
      variant: "main",
      active: false,
    },
  }
);

const MotionLink = motion(Link);

interface NavButtonProps extends VariantProps<typeof navButtonVariants>, LinkProps {
  children: ReactNode;
  className?: string;
  icon_img?: StaticImageData;
}

export const NavButton = ({ variant, active, children, className, icon_img, ...props }: NavButtonProps) => {
  const isMain = variant === "main";

  return (
    <MotionLink
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={twMerge(navButtonVariants({ variant, active }), className)}
      {...props}
    >
      {isMain && (
        <motion.div
          className="absolute top-0 left-0 z-0 h-full w-full origin-left bg-gray-200 dark:bg-gray-800"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />
      )}

      {isMain && (
        <BaseImage
          src={icon_img?.src || ""}
          alt="nav_icon"
          className="relative z-10 mr-3 hidden h-4 w-4 sm:block md:h-4.5 md:w-4.5 lg:h-5.5 lg:w-5.5 xl:h-5.5 xl:w-5.5"
        />
      )}
      <span className="relative z-10">{children}</span>
    </MotionLink>
  );
};
