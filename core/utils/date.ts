import { getLocale } from "./locale";

export const getMonthNameByMonth = (year: number, month: number) => {
  return new Date(year, month, 1).toLocaleString(getLocale(), {
    month: "long",
  });
};

export const getMonthNameByDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return new Date(date).toLocaleString(getLocale(), {
    month: "long",
  });
};

export const getDateName = (day: number, dateString: string) => {
  const [year, month] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return new Date(date).toLocaleString(getLocale(), {
    day: "2-digit",
    month: "long",
  });
};

export const getWeekDays = (format: "short" | "narrow") => {
  const locale = getLocale();

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(Date.UTC(2001, 0, 1 + index));

    return new Intl.DateTimeFormat(locale, { weekday: format }).format(day);
  });
};

export function getFirstDayOfMonth(date: Date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), 1);
}

export function getFirstCalendarDate(date: Date) {
  const firstDayOfMonth = getFirstDayOfMonth(date);
  firstDayOfMonth.setDate(1 - firstDayOfMonth.getUTCDay());
  return firstDayOfMonth;
}

export const getDaysInMonth = () => {
  const today = new Date();
  const year = today.getFullYear();
  const indexMonth = today.getMonth();
  
  return new Date(year, indexMonth + 1, 0 + 1, 0).getDate();
}

export const getDaysFromMonthId = (monthId: string) => {
  const [year, month] = monthId.split("-").map(Number);
  return new Date(year, month, 0).getDate();
};

export const getPastMonths = (amount: number): string[] =>
  Array.from({ length: amount }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (i + 1));
    return date.toISOString().slice(0, 7) + "-01";
});