export const getMonthNameByMonth = (year: number, month: number) => {
  return new Date(year, month, 1).toLocaleString("pt-BR", {
    month: "long",
  })
}

export const getMonthNameByDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  
  return new Date(date).toLocaleString("pt-BR", {
    month: "long",
  })
}