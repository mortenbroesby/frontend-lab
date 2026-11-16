import { scan } from 'react-scan';

// Install instrumentation before React DOM loads. This opt-in teaching app also runs as a static build.
scan({
  enabled: true,
  showToolbar: true,
  showFPS: false,
  showNotificationCount: false,
  dangerouslyForceRunInProduction: true,
  animationSpeed: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'off' : 'fast',
});

void import('./start');
