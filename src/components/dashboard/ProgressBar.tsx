import React, { useMemo } from "react";

export interface ProgressBarProps {
  step: number;
  total: number;
  /**
   * The percentage of the progress bar filling, in case of static filling
   */
  progressFillPercentage?: number;
}

/**
 * Progress bar component with a gradient filling
 */
export function ProgressBar({ step, total, progressFillPercentage }: ProgressBarProps) {
  const progressWidth = useMemo(() => `${progressFillPercentage || (step / total) * 100}%`, [step, total, progressFillPercentage]);
  return (
    <div className="w-full mx-auto">
      {/* The main container with rounded borders */}
      <div className="relative h-14 bg-[#3ABEB82B] rounded-full overflow-hidden">
        {/* Steps counter */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <i className="cbi-verify text-4xl" />
          <div className="text-dark-gray flex gap-1">
            <span className="text-main">{step}</span>/<span>{total}</span>
          </div>
        </div>
        {/* Filling gradient part */}
        <div className="absolute top-0 h-full bg-gradient-to-r from-[#3ABEB800] to-[#3ABEB8]" style={{ width: progressWidth }} />
      </div>
    </div>
  );
};
