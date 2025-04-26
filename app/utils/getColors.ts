export const getColors = (value: number, target: number, border: boolean = false) => {
  if (value > target) return `bg-[#DDF1E3] text-[#00833B] hover:bg-[#B4E9C4] ${border ? 'border-2 border-[#00833B]' : ''}`;
  if (value <= 0) return `bg-[#FBDED7] text-[#B8000F] hover:bg-[#FFCBC1] ${border ? 'border-2 border-[#B8000F]' : ''}`;
  return `bg-[#FEF4D8] text-[#FFBB00] hover:bg-[#FFEDBC] ${border ? 'border-2 border-[#FFBB00]' : ''}`;
}