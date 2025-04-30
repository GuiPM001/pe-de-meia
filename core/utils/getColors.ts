export const getColors = (value: number, target: number, border: boolean = false) => {
  if (value >= target) return `bg-green-default text-green-text hover:bg-green-hover ${border ? 'border-2 border-green-text' : ''}`;
  if (value <= 0) return `bg-red-default text-red-text hover:bg-red-hover ${border ? 'border-2 border-red-text' : ''}`;
  return `bg-yellow-default text-yellow-text hover:bg-yellow-hover ${border ? 'border-2 border-yellow-text' : ''}`;
}