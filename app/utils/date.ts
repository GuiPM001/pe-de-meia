export const getMonthNameByMonth = (year: number, month: number) => {
  return new Date(year, month, 1).toLocaleString("pt-BR", {
    month: "long",
  })
}

export const getMonthNameByDate = (date: string) => {
  return new Date(date).toLocaleString("pt-BR", {
    month: "long",
  })
}