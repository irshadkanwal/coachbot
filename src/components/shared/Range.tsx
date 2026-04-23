import React, { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface RangeProps {
  currentValue?: number;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  customColor?: string;
  onValueSelected: (value: number) => void;
}

export const Range: React.FC<RangeProps> = ({
  onValueSelected,
  currentValue,
  className,
  min = 0,
  max = 10,
  step = 1,
  customColor = 'dark-aquamarine'
}) => {
  const [value, setValue] = useState(0);

  const handleLabelClick = useCallback((value: number) => {
    setValue(value);
    onValueSelected(value);
  }, []);

  useEffect(() => {
    setValue(currentValue || min);
  }, [currentValue, min]);

  return (
    <div className={twMerge('relative w-full flex flex-col justify-center items-center pt-6', className)} style={{
      '--custom-color': `rgb(var(--colors-${customColor}))`
    } as React.CSSProperties}>
      <ul id="voting_markers" className='absolute w-full h-2 flex justify-between'>
        {Array.from({ length: max + 1 }).map((_, i) => i).map((value: number) => (
          <li
            key={value}
            value={value}
            className={twMerge(
              'relative bottom-0 z-0 flex flex-col after:border-l after:border-white-opacity-3 after:h-2 cursor-pointer',
              value === 0 || value === max ? 'after:border-transparent' : ''
            )}
            onClick={() => handleLabelClick(value)}>
            <span className={twMerge(
              `absolute bottom-full flex text-medium mb-3 text-${customColor}`,
              value === 0 ? 'text-dark-gray' : '-translate-x-1/2',
              value === max && '-translate-x-2/3'
            )}>
              {value}
            </span>
          </li>
        ))}
      </ul>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        style={{ '--track-percentage': `${(value - min) / (max - min) * 100}%` } as React.CSSProperties}
        className={twMerge('range-slider block appearance-none w-full rounded-lg cursor-pointer h-3 z-10 transition-all',)}
        value={value}
        onChange={(event) => setValue(parseInt(event.target.value))}
        onMouseUp={() => onValueSelected(value)}
        onTouchEnd={() => onValueSelected(value)}
      />
    </div>
  );
};
