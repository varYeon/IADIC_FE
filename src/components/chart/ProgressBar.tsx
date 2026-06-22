"use client";

import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface ProgressBarProps {
  percent: number;
  count: number;
  color: string;
  className?: string;
}

export default function ProgressBar({ percent, count, color, className }: ProgressBarProps) {
  const [percentages, setPercentages] = useState(0);

  useEffect(() => {
    setPercentages(percent);
  }, [percent]);

  return (
    <div
      className={twMerge(
        "bg-border-sub flex h-5 w-full overflow-hidden rounded-full md:w-10/12",
        className,
        !count && "bg-border-main"
      )}
      role="progressbar"
      aria-valuenow={percentages}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {!!count ? (
        <div
          className="flex flex-col justify-center overflow-hidden rounded-full text-center text-xs whitespace-nowrap text-white transition-all duration-900 ease-linear"
          style={{ width: `${percentages}%`, backgroundColor: color }}
        >
          {count}개
        </div>
      ) : (
        <div
          className="flex flex-col justify-center overflow-hidden rounded-full text-center text-xs whitespace-nowrap text-white transition-all duration-900 ease-linear"
          style={{ width: "100%" }}
        >
          지표가 부족합니다
        </div>
      )}
    </div>
  );
}
