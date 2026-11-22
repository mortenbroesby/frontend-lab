import { useEffect, useState } from 'react';
export function usePortrait() {
  const [portrait, setPortrait] = useState(() => matchMedia('(orientation: portrait)').matches);
  useEffect(() => {
    const query = matchMedia('(orientation: portrait)');
    const change = () => setPortrait(query.matches);
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);
  return portrait;
}
