import type { ReactNode } from 'react';
import { LabMark } from '@lab/demo-kit/mark';

type LayoutProps = { eyebrow: ReactNode; title: string; children?: ReactNode };

export function TitleSlide({ eyebrow, title, children }: LayoutProps) {
  return (
    <div className="slide-layout title-layout">
      <p className="slide-eyebrow">
        <LabMark />
        {eyebrow}
      </p>
      <h1>{title}</h1>
      <div className="slide-description">{children}</div>
      <div className="title-orbits" aria-hidden="true">
        <i />
        <i />
        <i />
        <span />
      </div>
    </div>
  );
}

export function DiagramSlide({ eyebrow, title, children }: LayoutProps) {
  return (
    <div className="slide-layout diagram-layout">
      <p className="slide-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <div className="slide-visual">{children}</div>
    </div>
  );
}

export function StatementSlide({ eyebrow, title, children }: LayoutProps) {
  return (
    <div className="slide-layout statement-layout">
      <p className="slide-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <div className="slide-description">{children}</div>
    </div>
  );
}

export function ExperimentOptions({
  options,
}: {
  options: readonly { label: string; title: string; description: string; icon?: ReactNode }[];
}) {
  return (
    <ul className="experiment-options">
      {options.map(({ label, title, description, icon }) => (
        <li key={label}>
          <span className="experiment-label">
            {icon}
            {label}
          </span>
          <h2>{title}</h2>
          <p>{description}</p>
        </li>
      ))}
    </ul>
  );
}
