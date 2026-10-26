import {
  Check,
  LockKeyhole,
  Minus,
  Plus,
  TriangleAlert,
  LucideIcon,
} from "lucide-react";
import { GoalStatus } from "@/core/utils/goalStyle";
import i18n from "@/lib/i18n";

export type StatusKey = GoalStatus | "disabled" | "creatable";

export type StatusProps = {
  icon: LucideIcon;
  short: string;
  label?: string;
};

export const getStatusProps = (
  t: (key: string) => string = (key) => i18n.t(key),
) => {
  const withLabel = (key: string, icon: LucideIcon): StatusProps => ({
    icon,
    short: t(`statuses.${key}.short`),
    label: t(`statuses.${key}.label`),
  });
  const shortOnly = (key: string, icon: LucideIcon): StatusProps => ({
    icon,
    short: t(`statuses.${key}.short`),
  });

  return {
    above: withLabel("above", Check),
    below: withLabel("below", Minus),
    negative: withLabel("negative", TriangleAlert),
    disabled: shortOnly("disabled", LockKeyhole),
    creatable: shortOnly("creatable", Plus),
  } as Record<StatusKey, StatusProps> & Record<string, StatusProps>;
};

export const statusProps = getStatusProps();

export const getStatuses = getStatusProps;
export const statuses = statusProps;
export type StatusItem = StatusProps;