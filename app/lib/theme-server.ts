import { cookies } from "next/headers";
import { Theme, THEME_COOKIE_NAME } from "./theme";

export async function getThemeFromCookies(): Promise<Theme> {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(THEME_COOKIE_NAME);

  if (themeCookie?.value === "dark" || themeCookie?.value === "light") {
    return themeCookie.value;
  }

  return "light";
}
