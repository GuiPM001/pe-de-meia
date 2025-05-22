export const getColors = (
  value: number,
  target: number,
  border: boolean = false,
  bg: boolean = true
) => {
  if (value >= target)
    return `text-green-text 
            ${bg ? "bg-green-default hover:bg-green-hover" : ""} 
            ${border ? "border-2 border-green-text" : ""}`;

  if (value <= 0)
    return `text-red-text 
            ${bg ? "bg-red-default hover:bg-red-hover" : ""} 
            ${border ? "border-2 border-red-text" : ""}`;

  return `text-yellow-text 
          ${bg ? "bg-yellow-default hover:bg-yellow-hover" : ""} 
          ${border ? "border-2 border-yellow-text" : ""}`;
};
