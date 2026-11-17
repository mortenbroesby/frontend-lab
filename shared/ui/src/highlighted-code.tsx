import { useMemo, Fragment } from 'react';
import { createHighlighterCoreSync } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import tsx from 'shiki/langs/tsx.mjs';
import jsx from 'shiki/langs/jsx.mjs';
import typescript from 'shiki/langs/typescript.mjs';
import javascript from 'shiki/langs/javascript.mjs';
import json from 'shiki/langs/json.mjs';
import css from 'shiki/langs/css.mjs';
import html from 'shiki/langs/html.mjs';
import light from 'shiki/themes/github-light.mjs';
import dark from 'shiki/themes/github-dark.mjs';

const highlighter = createHighlighterCoreSync({
  langs: [tsx, jsx, typescript, javascript, json, css, html],
  themes: [light, dark],
  engine: createJavaScriptRegexEngine(),
});

export function HighlightedCode({ code, language }: { code: string; language: string }) {
  const tokens = useMemo(() => {
    const lang = language.trim().toLowerCase();
    if (!highlighter.getLoadedLanguages().includes(lang)) return null;
    return highlighter.codeToTokens(code, {
      lang,
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: 'light-dark()',
    }).tokens;
  }, [code, language]);
  if (!tokens) return <>{code}</>;
  return tokens.map((line, index) => (
    <Fragment key={index}>
      {index > 0 && (code.includes('\r\n') ? '\r\n' : '\n')}
      {line.map((token) => (
        <span key={token.offset} style={{ color: token.htmlStyle?.color }}>
          {token.content}
        </span>
      ))}
    </Fragment>
  ));
}
