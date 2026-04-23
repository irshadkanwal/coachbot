// app/(public)/studio/StudioHero.tsx
"use client";
import { useTheme, Theme } from "@/contexts/ThemeContext";
import Image from "next/image";
import React, { useMemo } from "react";

const HERO_IMAGE = {
  [Theme.LIGHT]: require('public/images/coaches-hero-light.png'),
  [Theme.DARK]: require('public/images/coaches-hero-dark.png'),
} as const;

const DASHBOARD_IMAGE = {
  [Theme.LIGHT]: require('public/images/studio-dashboard-light.png'),
  [Theme.DARK]: require('public/images/studio-dashboard-dark.png'),
} as const;

export function StudioHeroImage() {
  const { theme } = useTheme();
  return (
    <Image
      alt="Studio Hero"
      src={HERO_IMAGE[theme]}
      className="flex w-full h-full lg:flex rounded-xl"
    />
  );
}

export function StudioDashboardImage() {
  const { theme } = useTheme();
  return (
    <Image
      alt="Studio Dashboard"
      src={DASHBOARD_IMAGE[theme]}
      className="w-full h-full max-h-[650px] object-contain rounded-xl"
      // object-contain = image is fully visible, might have whitespace
      // max-h = keeps from stretching too much on very tall screens
      priority
    />
  );
}
