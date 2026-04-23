import { useEffect, useState } from 'react';

type WindowDimensions = Pick<Window, 'innerHeight' | 'innerWidth' | 'outerHeight' | 'outerWidth'>;
type ScreensSizes = {
  lessThenSm: boolean;
  lessThenMd: boolean;
  lessThenLg: boolean;
  lessThenXl: boolean;
  moreThenMd: boolean;
};

export enum ScreenSize {
  'sm' = 640,
  'md' = 768,
  'lg' = 1024,
  'xl' = 1280,
  '2xl' = 1536,
}

const getScreenSizes = (width: number): ScreensSizes => ({
  lessThenSm: width < ScreenSize.sm,
  lessThenMd: width < ScreenSize.md,
  lessThenLg: width < ScreenSize.lg,
  lessThenXl: width < ScreenSize.xl,
  moreThenMd: width >= ScreenSize.md,
});

const getDimensions = (): WindowDimensions & ScreensSizes => {
  if (typeof window === "undefined") {
    return {
      innerHeight: 0,
      innerWidth: 0,
      outerHeight: 0,
      outerWidth: 0,
      ...getScreenSizes(0),
    };
  }

  const { innerWidth, innerHeight, outerWidth, outerHeight } = window;

  return {
    innerHeight,
    innerWidth,
    outerHeight,
    outerWidth,
    ...getScreenSizes(innerWidth),
  };
};

export function useScreenSize(): WindowDimensions & ScreensSizes {
  const [windowSize, setWindowSize] = useState<WindowDimensions & ScreensSizes>(getDimensions());

  useEffect(() => {
    const onResize = () => setWindowSize(getDimensions());
    window.addEventListener("resize", onResize);

    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return windowSize;
}
