import { useState } from 'react';

export function useCopyText(text: string) {
  const [result, setResult] = useState({ text: '', message: '' });
  const message = result.text === text ? result.message : '';
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setResult({ text, message: 'Copied' });
    } catch {
      setResult({ text, message: 'Copy unavailable. Select and copy the code instead.' });
    }
  }
  return { message, copy };
}
