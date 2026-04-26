import { cookies } from "next/headers";
import type { Lang } from "./translations";

export function getLang(): Lang {
  const cookieStore = cookies();
  const raw = cookieStore.get("lang")?.value;
  return raw === "th" ? "th" : "en";
}
