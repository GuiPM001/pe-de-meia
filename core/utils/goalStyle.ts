export type GoalStatus = "above" | "below" | "negative" | "creatable" | "disabled";

const goalStyles: Record<
  GoalStatus,
  { base: string; today: string; text: string }
> = {
  creatable: {
    base: "",
    today: "",
    text: "",
  },
  disabled: {
    base: "",
    today: "",
    text: "",
  },
  above: {
    base: "bg-success/20 hover:bg-success/30",
    today: "ring-2 ring-primary bg-success/25",
    text: "text-success font-semibold",
  },
  below: {
    base: "bg-warning/15 hover:bg-warning/25",
    today: "ring-2 ring-warning bg-warning/30",
    text: "text-warning-text font-semibold",
  },
  negative: {
    base: "bg-expense/15 hover:bg-expense/25",
    today: "ring-2 ring-expense bg-expense/20",
    text: "text-expense font-semibold",
  },
};

export const getGoalStatusStyles = (
  balance: number | null,
  savingTarget: number,
  isSelected: boolean,
) => {
  if (balance == null) return "opacity-40";

  let goalStatus: GoalStatus = "below";
  if (balance > savingTarget) goalStatus = "above";
  if (balance < 0) goalStatus = "negative";

  return isSelected
    ? goalStyles[goalStatus].today
    : goalStyles[goalStatus].base;
};

export const getMonthStatusStyles = (
  goalStatus: GoalStatus,
  isSelected: boolean,
) => {
  if (isSelected)
    return `${goalStyles[goalStatus].today} ${goalStyles[goalStatus].text} font-bold border`;

  return `${goalStyles[goalStatus].base} ${goalStyles[goalStatus].text} ring-[0.5px] border border-transparent`;
};

export const getGoalTextStyles = (
  balance: number | null,
  savingTarget: number,
  isSelected: boolean,
) => {
  if (balance == null) return "text-muted-foreground";

  let goalStatus: GoalStatus = "below";
  if (balance > savingTarget) goalStatus = "above";
  if (balance < 0) goalStatus = "negative";

  return `${isSelected ? "font-bold" : ""} ${goalStyles[goalStatus].text}`;
};
