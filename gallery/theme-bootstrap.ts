import type { Plugin } from 'vite';

/** Set the document canvas before stylesheets or application modules arrive. */
export function themeBootstrap(): Plugin {
  return {
    name: 'lab-theme-bootstrap',
    transformIndexHtml: {
      order: 'pre',
      handler: () => [
        {
          tag: 'script',
          injectTo: 'head-prepend',
          children: `(() => {
  let preference;
  try { preference = localStorage.getItem('front-end-lab-theme'); } catch {}
  const dark = preference === 'dark' ||
    (preference !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
})();`,
        },
        {
          tag: 'style',
          injectTo: 'head-prepend',
          children: `:root { color-scheme: light; background: var(--lab-paper, #fafafa); }
:root[data-theme='dark'] { color-scheme: dark; background: var(--lab-paper, #0a0a0a); }`,
        },
      ],
    },
  };
}
