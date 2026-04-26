import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "success" | "danger" | "neutral";
};

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  success: "bg-emerald-500/15 text-emerald-500",
  danger: "bg-rose-500/15 text-rose-500",
  neutral: "bg-muted text-muted-foreground"
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex rounded-full px-2 py-1 text-xs font-medium", tones[tone], className)}
      {...props}
    />
  );
}
