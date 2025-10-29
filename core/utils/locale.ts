import { SupportedLocale } from "@/lib/errorHandler";

export const getLocale = () => {
  if (typeof window !== "undefined")
    return window?.location?.pathname?.split("/")[1] || "pt";
  
  return "pt";
}

export const getRequestLocale = (request: Request): SupportedLocale => {
  return request.headers.get("accept-language") as SupportedLocale || "pt";
}