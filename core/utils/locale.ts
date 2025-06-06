export const getLocale = () => {
  if (typeof window !== undefined)
    return window.location.pathname.split("/")[1] || "pt";
  
  return "pt";
}