"use client";
import * as Select from "@radix-ui/react-select";
import { clsx } from "clsx";
import { Fragment } from "react";

type Opt = { label: string; value: string };
export function PurpleSelect({
  value,
  onValueChange,
  options,
  placeholder,
  className,
}: {
  value?: string;
  onValueChange: (v: string) => void;
  options: Opt[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        className={clsx(
          "inline-flex w-full items-center justify-between gap-2",
          "rounded-xl2 border border-grape-300 bg-white/80 px-3 py-2",
          "text-left text-grape-900",
          "focus:outline-none focus:ring-2 focus:ring-grape-400",
          "hover:bg-white",
          className
        )}
        aria-label="Select"
      >
        <Select.Value placeholder={placeholder || "Select…"} />
        <ChevronDown className="h-4 w-4 text-grape-700 opacity-70" />
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          sideOffset={6}
          className={clsx(
            "z-50 overflow-hidden rounded-xl2 border border-grape-200 bg-white shadow-lofiglow"
          )}
        >
          <Select.Viewport className="p-1">
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

function SelectItem({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) {
  return (
    <Select.Item
      value={value}
      className={clsx(
        "relative flex cursor-pointer select-none items-center",
        "rounded-xl2 px-3 py-2 text-sm text-grape-900",
        "outline-none data-[highlighted]:bg-grape-100 data-[highlighted]:text-grape-900",
        "data-[state=checked]:bg-grape-50"
      )}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute right-2">
        <Check className="h-4 w-4 text-grape-700" />
      </Select.ItemIndicator>
    </Select.Item>
  );
}

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z"/>
    </svg>
  );
}
function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M16.7 6.3a1 1 0 0 1 0 1.4l-7.2 7.2a1 1 0 0 1-1.4 0L3.3 10.2a1 1 0 1 1 1.4-1.4l3 3 6.5-6.5a1 1 0 0 1 1.4 0z"/>
    </svg>
  );
}
