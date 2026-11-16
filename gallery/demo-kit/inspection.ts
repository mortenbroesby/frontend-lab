export interface DemoInspection {
  source: string;
  commands: { label: string; command: string }[];
}

export function describeDemo(id: string, scripts: Record<string, string>): DemoInspection {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error(`Invalid demo ID: ${id}`);
  return {
    source: `demos/${id}/`,
    commands: [
      ['dev', 'Run locally'],
      ['build', 'Build'],
      ['test', 'Test'],
    ].flatMap(([script, label]) =>
      scripts[script] ? [{ label, command: `npm run ${script} --workspace ./demos/${id}` }] : [],
    ),
  };
}
