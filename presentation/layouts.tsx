import type { ReactNode } from 'react';
import { LabMark } from '@lab/demo-kit/mark';

type LayoutProps = { eyebrow: string; title: string; children?: ReactNode };

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
