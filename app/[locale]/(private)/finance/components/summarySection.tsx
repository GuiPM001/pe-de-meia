import React from "react";
import { cn } from "@/lib/utils";

interface SummarySectionProps {
  title: string;
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode;
}

export function SummarySection({
  title,
  ariaLabel = title,
  className,
  children,
}: SummarySectionProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={cn("space-y-3 border-t pt-4", className)}
    >
      <h2 className="font-display text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}