import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const documents = import.meta.glob('../content/**/*.md', { query: '?raw', import: 'default', eager: true });

export default function Guide({ document }: { document: string }) {
  const content = documents[`../content/${document}.md`];
  if (typeof content !== 'string') return <p role="alert">This guide is unavailable. Choose another track or reload the page.</p>;
  return <article className="guide">
    <Markdown remarkPlugins={[remarkGfm]} skipHtml components={{
      h1: ({ children }) => <h2>{children}</h2>,
      h2: ({ children }) => <h3>{children}</h3>,
      h3: ({ children }) => <h4>{children}</h4>,
      table: ({ children }) => <div className="guide-table" role="region" aria-label="Exploration options" tabIndex={0}><table>{children}</table></div>,
    }}>{content}</Markdown>
  </article>;
}
