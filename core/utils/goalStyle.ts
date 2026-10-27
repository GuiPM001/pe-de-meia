export type MonthAvailability = "registered" | "disabled" | "creatable";

export type GoalStatus =
  | "above"
  | "below"
  | "negative"
  | "creatable"
  | "disabled";

const goalStyles: Record<
  GoalStatus,
  { base: string; today: string; text: string }
> = {
  creatable: {
    base: "border border-dashed border-primary/40 bg-primary/5",
    today: "",
    text: "text-primary",
  },
  disabled: {
    base: "bg-muted border border-muted-foreground/25",
    today: "",
    text: "text-muted-foreground/70",
  },
  above: {
    base: "bg-success/20 hover:bg-success/30",
    today: "border-1 border-primary bg-success/25",
    text: "text-success font-semibold",
  },
  below: {
    base: "bg-warning/15 hover:bg-warning/25",
    today: "border-1 border-warning bg-warning/20",
    text: "text-warning-text font-semibold",
  },
  negative: {
    base: "bg-expense/15 hover:bg-expense/25",
    today: "border-1 border-expense bg-expense/20",
    text: "text-expense font-semibold",
  },
};

export const getGoalStatus = (
  idMonth: string,
  balance: number | null | undefined,
  savingTarget: number,
  invested: number = 0,
  availability: MonthAvailability = "registered",
  desconsiderLaterMonth: boolean = false,
): GoalStatus => {
  if (availability !== "registered")
    return availability;

  if (!balance || balance < 0)
    return "negative";

  if (desconsiderLaterMonth)
    return balance > savingTarget ? "above" : "below";

  const isLaterMonth = new Date(`${idMonth}T12:00:00`).getMonth() > new Date().getMonth();

  if (isLaterMonth && balance > savingTarget)
    return "above";

  return invested < savingTarget ? "below" : "above";
};

export const getStatusStyles = (goalStatus: GoalStatus, isSelected: boolean) => {
  if (isSelected)
    return `${goalStyles[goalStatus].today} ${goalStyles[goalStatus].text} font-bold`;

  return `${goalStyles[goalStatus].base} ${goalStyles[goalStatus].text}`;
};