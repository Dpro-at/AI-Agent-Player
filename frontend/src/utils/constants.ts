// Application constants

export const APP_CONFIG = {
  name: "Dpro AI Agent",
  version: "1.0.0",
  description: "AI Agent Management Platform",
  supportEmail: "support@ agent-player.com",
  websiteUrl: "https:// agent-player.com",
} as const;

export const STORAGE_KEYS = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
  user: "user",
  theme: "theme",
  language: "language",
  settings: "user_settings",
} as const;

export const THEMES = {
  light: "light",
  dark: "dark",
  auto: "auto",
} as const;

export const LANGUAGES = {
  en: "English",
} as const;
