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

export function DemonstrationSlide({ eyebrow, title, children }: LayoutProps) {
  return (
    <div className="slide-layout demonstration-layout">
      <div>
        <p className="slide-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="slide-description">
          Your keyboard is the remote.
          <br />
          Follow the focus.
        </p>
      </div>
      <div className="slide-experiment">{children}</div>
    </div>
  );
}
