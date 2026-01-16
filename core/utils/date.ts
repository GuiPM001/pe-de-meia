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