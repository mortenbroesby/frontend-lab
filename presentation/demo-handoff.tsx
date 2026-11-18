import { createContext, useContext, useState, type ReactNode } from 'react';

const Handoff = createContext({ active: false, setActive: (_active: boolean) => {} });
export function DemoHandoff({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  return <Handoff value={{ active, setActive }}>{children}</Handoff>;
}
export function useDemoHandoff() {
  return useContext(Handoff);
}
