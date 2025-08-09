export const THEME_COOKIE_NAME = 'theme';

export type Theme = 'light' | 'dark';

export function setThemeCookie(theme: Theme) {
  // This will be called from client-side
  document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}
