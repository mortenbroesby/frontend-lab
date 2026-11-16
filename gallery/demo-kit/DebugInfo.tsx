import { version } from 'react';

export function DebugInfo() {
  const details = {
    Page: document.title,
    Path: location.pathname,
    Origin: location.origin,
    Build: import.meta.env.MODE,
    App: import.meta.env.LAB_STANDALONE ? 'Standalone build' : 'Gallery build',
    React: version,
    'Secure context': window.isSecureContext ? 'Yes' : 'No — some device APIs need HTTPS',
    Network: navigator.onLine ? 'Online (browser report)' : 'Offline (browser report)',
    Viewport: `${window.innerWidth} × ${window.innerHeight}`,
    Theme: document.documentElement.dataset.theme,
  };
  return (
    <div>
      <p className="command-hint">Snapshot when opened. Nothing is sent or stored.</p>
      <dl className="command-debug">
        {Object.entries(details).map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
