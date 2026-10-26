import { GoalStatus } from "@/core/utils/goalStyle";

export type MonthAvailability = "registered" | "disabled" | "creatable";

export type MonthlyStatistics = {
  idMonth: string;
  status: GoalStatus;
  availability: MonthAvailability;
  balance?: number;
};

export {
  getStatusProps,
  statusProps,
  getStatuses,
  statuses,
  type StatusKey,
  type StatusProps,
  type StatusItem,
} from "@/core/constants/statusProps";
