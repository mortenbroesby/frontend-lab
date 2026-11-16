export type Strategy = 'full' | 'targeted' | 'watch';
export type Scenario = 'tooling' | 'shared' | 'other' | 'unchanged';

export const scenarios: { id: Scenario; label: string; file: string; lesson: string }[] = [
  {
    id: 'tooling',
    label: 'Edit the comparator',
    file: 'demos/tooling/examples/commands.mjs',
    lesson:
      'A local edit invalidates this package and the gallery that bundles it. Watch mode sees the imported comparator, but only checks the selected test.',
  },
  {
    id: 'shared',
    label: 'Edit the shared kit',
    file: 'gallery/demo-kit/mount.tsx',
    lesson:
      'Shared changes reach every demo. A tooling-only pass leaves other consumers unchecked; the comparator watcher does not import the kit.',
  },
  {
    id: 'other',
    label: 'Edit another demo',
    file: 'demos/workers/index.tsx',
    lesson:
      'Tooling can reuse its build, but the changed demo and combined gallery need work. A fixed tooling filter is not automatic affected-project selection.',
  },
  {
    id: 'unchanged',
    label: 'Run again unchanged',
    file: 'No changed inputs',
    lesson:
      'A matching Turbo cache can reuse results. Direct Node tests still run; an already-running watcher stays idle until a watched file changes.',
  },
];

export const strategies: Record<Strategy, { title: string; note: string }> = {
  full: {
    title: 'Full validation',
    note: 'Repository scope. Tests finish before the type/build phase, as in npm run check.',
  },
  targeted: {
    title: 'Targeted checks',
    note: 'Tooling only. Run its test file and filtered Turbo build in separate terminals so they overlap.',
  },
  watch: {
    title: 'Watch mode',
    note: 'An already-running Node watcher selects one comparator test. No type check or build is implied.',
  },
};

const definitions = [
  {
    id: 'shared',
    label: 'Shared types',
    duration: 2,
    reason: 'UI and demo-kit type checks precede consumer type checks.',
  },
  {
    id: 'tests',
    label: 'Tooling tests',
    duration: 2,
    reason: 'The full run uses Turbo; targeted checks run this test file directly with Node.',
  },
  {
    id: 'types',
    label: 'Tooling types',
    duration: 2,
    reason: 'Turbo waits for shared types. Direct tests can run alongside this task.',
  },
  {
    id: 'build',
    label: 'Tooling build',
    duration: 3,
    reason: 'Turbo build depends on this package’s typecheck task.',
  },
  {
    id: 'others',
    label: 'Other workspaces',
    duration: 6,
    reason: 'A collapsed lane for the remaining validation work; independent packages can overlap.',
  },
  {
    id: 'gallery',
    label: 'Gallery build',
    duration: 4,
    reason:
      'The gallery reads demo source, not their compiled output. It does not wait for the tooling build.',
  },
] as const;

type TaskId = (typeof definitions)[number]['id'];
export type Task = {
  id: TaskId;
  label: string;
  reason: string;
  dependencies: TaskId[];
  selected: boolean;
  cached: boolean;
  start: number;
  end: number;
};

function dependencies(id: TaskId, strategy: Strategy): TaskId[] {
  if (strategy === 'watch') return [];
  const graph: Record<TaskId, TaskId[]> = {
    shared: [],
    tests: [],
    types: ['shared'],
    build: ['types'],
    others: ['tests'],
    gallery: ['types'],
  };
  if (strategy === 'full') {
    graph.tests = ['shared'];
    graph.types = ['tests'];
  }
  return graph[id];
}

function isCached(id: TaskId, scenario: Scenario, strategy: Strategy, warm: boolean) {
  if (!warm || scenario === 'shared') return false;
  if (id === 'tests' && strategy !== 'full') return false;
  const affected: Record<Scenario, readonly TaskId[]> = {
    tooling: ['tests', 'types', 'build', 'gallery'],
    shared: definitions.map((task) => task.id),
    other: ['others', 'gallery'],
    unchanged: [],
  };
  return !affected[scenario].includes(id);
}

export function planWorkflow(strategy: Strategy, scenario: Scenario, warm: boolean): Task[] {
  const tasks: Task[] = [];
  for (const definition of definitions) {
    const selected =
      strategy === 'full' ||
      (strategy === 'targeted' && !['others', 'gallery'].includes(definition.id)) ||
      (strategy === 'watch' && scenario === 'tooling' && definition.id === 'tests');
    const deps = dependencies(definition.id, strategy);
    const cached = selected && isCached(definition.id, scenario, strategy, warm);
    const start = Math.max(
      0,
      ...tasks.filter((task) => deps.includes(task.id)).map((task) => task.end),
    );
    const duration = strategy === 'watch' ? 1 : definition.duration;
    tasks.push({
      ...definition,
      dependencies: deps,
      selected,
      cached,
      start,
      end: start + (selected && !cached ? duration : 0),
    });
  }
  return tasks;
}

export function taskState(task: Task, step: number) {
  if (!task.selected) return 'Skipped';
  if (step < task.start) return 'Waiting';
  if (task.cached) return 'Cached';
  return step < task.end ? 'Running' : 'Done';
}
