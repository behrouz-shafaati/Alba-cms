// use client

export function toggleTheme(theme: 'light' | 'dark') {
  document.cookie = `theme=${theme}; path=/; max-age=31536000` // یک سال
}
