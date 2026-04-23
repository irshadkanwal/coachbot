import React, { useRef, useEffect, useState, useMemo } from "react";
import { twMerge } from "tailwind-merge";

import { Theme, useTheme } from "@/contexts/ThemeContext";

export interface Stripe {
  x1: number | string;
  y1: number | string;
  x2: number | string;
  y2: number | string;
}

export interface Palette {
  /**
   * Tailwind CSS or norman className for the background color
   */
  backgroundColor?: string;
  /**
   * Color code for the line stroke color
   */
  stripeColor?: string;
}

export interface StripedFieldProps {
  text: string;
  palette?: Record<Theme, Palette>;
}

const defaultPalette: Record<Theme, Palette> = {
  [Theme.LIGHT]: {
    backgroundColor: "bg-green-yellow-gradient",
    stripeColor: "#FFFFFF",
  },
  [Theme.DARK]: {
    backgroundColor: "bg-green-yellow-gradient",
    stripeColor: "#0B0033",
  },
};

/**
 * A striped field component to display text with a striped background at the left.
 */
export const StripedField = ({ text, palette = defaultPalette }: StripedFieldProps) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [stripes, setStripes] = useState<Stripe[]>([]);

  const { backgroundColor, stripeColor } = useMemo(() => palette[theme], [theme, palette]);

  const updateStripes = (width: number, height: number) => {
    const containerWidth = width - (textRef.current?.getBoundingClientRect().width || width / 2);
    const baseStripeWidth = 20;
    const minStripeWidth = 8;
    const numberOfStripes = width / 15;

    // Calculate the Y offset to obtain the desired tilt angle
    const angleOffset = height * 0.9;

    const newStripes = [];
    let currentX = containerWidth;

    for (let i = 0; i < numberOfStripes; i++) {
      const reduction = i / numberOfStripes;
      const currentStripeWidth = baseStripeWidth - (baseStripeWidth - minStripeWidth) * reduction;

      newStripes.push({
        x1: currentX,
        y1: 0,
        x2: currentX - angleOffset, // Move the bottom point to the left to create a tilt
        y2: height + 20,
      });

      currentX -= currentStripeWidth;
    }

    setStripes(newStripes);
  };

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        updateStripes(width, height);
      });

      resizeObserver.observe(containerRef.current);

      const { width, height } = containerRef.current.getBoundingClientRect();
      updateStripes(width, height);

      return () => resizeObserver.disconnect();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={twMerge(
        "relative inline-flex items-center justify-end bg-green-yellow-gradient px-6 rounded-full overflow-hidden w-full",
        backgroundColor,
      )}
    >
      <div ref={textRef} className="relative z-10 text-dark-blue font-medium text-sm">
        {text}
      </div>
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
        preserveAspectRatio="none"
      >
        {stripes.map((stripe, index) => (
          <line
            key={index}
            x1={stripe.x1}
            y1={stripe.y1}
            x2={stripe.x2}
            y2={stripe.y2}
            stroke={stripeColor}
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  );
};
