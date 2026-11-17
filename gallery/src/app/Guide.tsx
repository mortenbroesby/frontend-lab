import { Idea, IdeaGrid, IdeaNote, Inspiration } from './Ideas';
import { demos } from '../demo-registry';
import { lazy, isValidElement, type ComponentType, type ComponentProps } from 'react';
import { CodePreview } from '@lab/ui/code-preview';
import type { MDXComponents, MDXProps } from 'mdx/types';

// Compile trusted repository pages at build time; load only the selected page.
const modules = import.meta.glob<{ default: ComponentType<MDXProps> }>('../content/**/*.mdx');
const pages = Object.fromEntries(Object.entries(modules).map(([path, load]) => [path, lazy(load)]));

function GuideCode({ children, ...props }: ComponentProps<'pre'>) {
  if (
    !isValidElement<ComponentProps<'code'>>(children) ||
    typeof children.props.children !== 'string'
  )
    return <pre {...props}>{children}</pre>;
  const language = children.props.className?.replace(/^language-/, '') ?? 'text';
  return (
    <CodePreview
      code={children.props.children.replace(/\n$/, '')}
      language={language}
      filename={`${language} example`}
    />
  );
}

const components: MDXComponents = {
  pre: GuideCode,
  Idea,
  IdeaGrid,
  IdeaNote,
  Inspiration,
  DemoLink: ({ id, children, ...props }: ComponentProps<'a'> & { id: string }) => {
    const demo = demos.find((entry) => entry.id === id);
    if (!demo) throw new Error(`Unknown demo: ${id}`);
    const track =
      demo.tracks.find((id) => location.hash.startsWith(`#/track/${id}`)) ?? demo.tracks[0];
    return (
      <a {...props} href={`${demo.href}?track=${track}`}>
        {children}
      </a>
    );
  },
  table: ({ children }) => (
    <div className="guide-table" role="region" aria-label="Exploration options" tabIndex={0}>
      <table>{children}</table>
    </div>
  ),
};

export default function Guide({
  document,
  layout,
}: {
  document: string;
  layout: 'ideas' | 'document';
}) {
  const Page = pages[`../content/${document}.mdx`];
  if (!Page)
    return <p role="alert">This guide is unavailable. Choose another track or reload the page.</p>;
  return (
    <article className={layout === 'ideas' ? 'ideas-page' : 'guide'}>
      <Page components={components} />
    </article>
  );
}
