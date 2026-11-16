import { useSyncExternalStore } from 'react';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

const storageKey = 'front-end-lab-theme';
type Theme = 'system' | 'light' | 'dark';
const isTheme = (value: unknown): value is Theme =>
  value === 'light' || value === 'dark' || value === 'system';

function readPreference(): Theme {
  try {
    const value = localStorage.getItem(storageKey);
    return isTheme(value) ? value : 'system';
  } catch {
    return 'system';
  }
}

let preference = readPreference();

function applyTheme() {
  const dark =
    preference === 'dark' ||
    (preference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}

// Apply before the first React render, including standalone demo entry points.
if (typeof window !== 'undefined') applyTheme();

function subscribe(notify: () => void) {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const update = () => {
    applyTheme();
    notify();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) {
      preference = readPreference();
      update();
    }
  };
  media.addEventListener('change', update);
  window.addEventListener('storage', onStorage);
  window.addEventListener('lab-theme-change', update);
  return () => {
    media.removeEventListener('change', update);
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('lab-theme-change', update);
  };
}

function setTheme(value: string) {
  if (!isTheme(value)) return;
  preference = value;
  try {
    localStorage.setItem(storageKey, value);
  } catch {
    /* Keep the choice for this page. */
  }
  applyTheme();
  window.dispatchEvent(new Event('lab-theme-change'));
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    () => preference,
    () => 'system' as Theme,
  );
  return { theme, setTheme };
}

export function ThemeControl() {
  const { theme, setTheme } = useTheme();
  return (
    <ToggleGroup
      type="single"
      value={theme}
      onValueChange={setTheme}
      variant="outline"
      aria-label="Colour theme"
    >
      <ToggleGroupItem value="light">Light</ToggleGroupItem>
      <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
      <ToggleGroupItem value="system">System</ToggleGroupItem>
    </ToggleGroup>
  );
}
