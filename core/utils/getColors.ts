export const getColors = (
  balance: number | null,
  invested: number,
  target: number,
  border: boolean = false,
  bg: boolean = true,
) => {
  if (balance === null) 
    return `text-gray-500
            ${bg ? "bg-gray-100" : ""} 
            ${border ? "ring ring-inset ring-gray-500" : ""}`;

  const total = balance + invested;

  if (total <= 0 || Number(balance.toFixed(2)) <= 0)
    return `text-red-text 
            ${bg ? "bg-red-default hover:bg-red-hover" : ""} 
            ${border ? "ring ring-inset ring-red-text" : ""}`;

  if (total >= target)
    return `text-green-text 
            ${bg ? "bg-green-default hover:bg-green-hover" : ""} 
            ${border ? "ring ring-inset ring-green-text" : ""}`;

  return `text-yellow-text 
            ${bg ? "bg-yellow-default hover:bg-yellow-hover" : ""} 
            ${border ? "ring ring-inset ring-yellow-text" : ""}`;
};

export const getAccentBackground = (balance: number, target: number) => {
  if (balance <= 0 || Number(balance.toFixed(2)) <= 0) 
    return "bg-red-text";

  if (balance >= target) 
    return "bg-green-text";

  return "bg-yellow-text";
};

