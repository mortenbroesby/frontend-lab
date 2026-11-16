interface Node {
  type: string;
  name?: string | null;
  attributes?: { name?: string; value?: unknown }[];
  children?: Node[];
}

// Remark has already parsed JSX, so code samples and comments are not mistaken for links.
export function demoLinks(ids: ReadonlySet<string>) {
  return function validate(node: Node, file: { fail(message: string): never }) {
    if (node.name === 'DemoLink') {
      const id = node.attributes?.find((attribute) => attribute.name === 'id')?.value;
      if (typeof id !== 'string' || !ids.has(id)) {
        file.fail(
          `DemoLink needs a literal id matching a demo folder; received ${JSON.stringify(id)}.`,
        );
      }
    }
    for (const child of node.children ?? []) validate(child, file);
  };
}
