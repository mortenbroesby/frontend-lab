import assert from 'node:assert/strict';
import { test } from 'node:test';
import { planWorkflow, taskState } from './workflow.ts';

test('build waits for types; full validation includes gallery but targeted does not', () => {
  const full = planWorkflow('full', 'tooling', true);
  const targeted = planWorkflow('targeted', 'tooling', true);
  const find = (id: string) => full.find((task) => task.id === id)!;
  assert.equal(find('build').start, find('types').end);
  assert.equal(find('gallery').start, find('types').end);
  assert.equal(targeted.find((task) => task.id === 'gallery')!.selected, false);
  assert.ok(
    targeted.find((task) => task.id === 'types')!.start <
      targeted.find((task) => task.id === 'tests')!.end,
  );
});

test('cache invalidation follows source ownership and shared dependencies', () => {
  const unchanged = planWorkflow('full', 'unchanged', true);
  assert.ok(unchanged.every((task) => task.cached));
  const other = planWorkflow('full', 'other', true);
  assert.equal(other.find((task) => task.id === 'build')!.cached, true);
  assert.equal(other.find((task) => task.id === 'gallery')!.cached, false);
  assert.ok(planWorkflow('full', 'shared', true).every((task) => !task.cached));
  assert.ok(planWorkflow('full', 'unchanged', false).every((task) => !task.cached));
});

test('watch only reacts to the watched import and never validates types or builds', () => {
  const watching = planWorkflow('watch', 'tooling', true);
  assert.deepEqual(
    watching.filter((task) => task.selected).map((task) => task.id),
    ['tests'],
  );
  assert.equal(watching.find((task) => task.id === 'tests')!.cached, false);
  assert.ok(planWorkflow('watch', 'shared', true).every((task) => !task.selected));
  const task = watching.find((item) => item.id === 'tests')!;
  assert.equal(taskState(task, 0), 'Running');
  assert.equal(taskState(task, task.end), 'Done');
});
