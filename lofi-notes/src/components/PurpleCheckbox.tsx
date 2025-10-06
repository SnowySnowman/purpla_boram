"use client";

import * as Checkbox from "@radix-ui/react-checkbox";
import { clsx } from "clsx";

export function PurpleCheckbox({
  checked,
  onCheckedChange,
  label,
  className,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  label?: string;
  className?: string;
}) {
  return (
    <label className={clsx("flex items-center gap-2 text-sm", className)}>
      <Checkbox.Root
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className={clsx(
          "inline-flex h-5 w-5 items-center justify-center",
          "rounded-xl2 border border-grape-300 bg-white/80",
          "outline-none focus-visible:ring-2 focus-visible:ring-grape-400",
          "data-[state=checked]:bg-grape-600 data-[state=checked]:border-grape-600",
          "transition-colors"
        )}
        aria-label={label}
      >
        <Checkbox.Indicator>
          <Check className="h-4 w-4 text-white" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      {label}
    </label>
  );
}

function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M16.7 6.3a1 1 0 0 1 0 1.4l-7.2 7.2a1 1 0 0 1-1.4 0L3.3 10.2a1 1 0 1 1 1.4-1.4l3 3 6.5-6.5a1 1 0 0 1 1.4 0z"/>
    </svg>
  );
}
