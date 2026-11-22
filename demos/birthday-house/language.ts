export type Language = 'da' | 'en';
const storageKey = 'birthday-house.language';
const listeners = new Set<() => void>();

function savedLanguage(): Language {
  try {
    return globalThis.localStorage?.getItem(storageKey) === 'en' ? 'en' : 'da';
  } catch {
    return 'da';
  }
}
let language = savedLanguage();

export function currentLanguage() {
  return language;
}
export function tr(danish: string, english: string) {
  return language === 'da' ? danish : english;
}
export function subscribeLanguage(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function selectLanguage(next: Language) {
  language = next;
  try {
    globalThis.localStorage?.setItem(storageKey, next);
  } catch {
    // The selection still applies when browser storage is unavailable.
  }
  listeners.forEach((listener) => listener());
}
