export const getColors = (
  balance: number,
  invested: number,
  target: number,
  border: boolean = false,
  bg: boolean = true
) => {
  const total = balance + invested;

  if (total <= 0 || balance <= 0)
    return `text-red-text 
            ${bg ? "bg-red-default hover:bg-red-hover" : ""} 
            ${border ? "border-2 border-red-text" : ""}`;

  if (total >= target)
    return `text-green-text 
            ${bg ? "bg-green-default hover:bg-green-hover" : ""} 
            ${border ? "border-2 border-green-text" : ""}`;

  return `text-yellow-text 
          ${bg ? "bg-yellow-default hover:bg-yellow-hover" : ""} 
          ${border ? "border-2 border-yellow-text" : ""}`;
};
