"use client";

import { IconCheckCircle } from "./icons";

export interface StepperStep {
  label: string;
}

/**
 * Full labeled steps from sm+; collapses to a thin "Step X of N" progress
 * bar below that, since horizontal labels for 5 steps don't fit a phone.
 */
export function Stepper({
  steps,
  currentIndex,
  onStepClick,
}: {
  steps: StepperStep[];
  currentIndex: number;
  /** Only completed (already-visited) steps are clickable — future steps aren't reachable yet. */
  onStepClick?: (index: number) => void;
}) {
  return (
    <div>
      <div className="hidden sm:flex sm:items-center">
        {steps.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const clickable = isDone && !!onStepClick;

          return (
            <div key={step.label} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick?.(index)}
                className="flex items-center gap-2 text-left disabled:cursor-default"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                    isDone
                      ? "bg-blue text-white"
                      : isCurrent
                        ? "border-2 border-blue text-blue"
                        : "border border-grey-300 text-grey-400"
                  }`}
                >
                  {isDone ? <IconCheckCircle className="h-4 w-4" /> : index + 1}
                </span>
                <span
                  className={`text-sm font-medium ${
                    isCurrent ? "text-dark" : isDone ? "text-dark" : "text-grey-400"
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`mx-3 h-px flex-1 ${index < currentIndex ? "bg-blue" : "bg-grey-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="sm:hidden">
        <p className="text-xs font-medium text-grey-500">
          Step {currentIndex + 1} of {steps.length} — {steps[currentIndex].label}
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-grey-200">
          <div
            className="h-full rounded-full bg-blue transition-all"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
