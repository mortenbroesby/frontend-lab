import { Idea, IdeaGrid, Inspiration } from './Ideas';
import { demos } from '../demo-registry';
import { lazy, type ComponentType, type ComponentProps } from 'react';
import type { MDXComponents, MDXProps } from 'mdx/types';

// Compile trusted repository pages at build time; load only the selected page.
const modules = import.meta.glob<{ default: ComponentType<MDXProps> }>('../content/**/*.mdx');
const pages = Object.fromEntries(Object.entries(modules).map(([path, load]) => [path, lazy(load)]));

const components: MDXComponents = {
  Idea,
  IdeaGrid,
  Inspiration,
  DemoLink: ({ id, children, ...props }: ComponentProps<'a'> & { id: string }) => {
    const demo = demos.find((entry) => entry.id === id);
    return demo ? (
      <a {...props} href={demo.href}>
        {children}
      </a>
    ) : (
      <span>{children}</span>
    );
  },
  h1: ({ children }) => <h2>{children}</h2>,
  h2: ({ children }) => <h3>{children}</h3>,
  h3: ({ children }) => <h4>{children}</h4>,
  table: ({ children }) => (
    <div className="guide-table" role="region" aria-label="Exploration options" tabIndex={0}>
      <table>{children}</table>
    </div>
  ),
};

export default function Guide({ document }: { document: string }) {
  const Page = pages[`../content/${document}.mdx`];
  if (!Page)
    return <p role="alert">This guide is unavailable. Choose another track or reload the page.</p>;
  return (
    <article className={document.endsWith('/ideas') ? 'ideas-page' : 'guide'}>
      <Page components={components} />
    </article>
  );
}
