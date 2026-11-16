import assert from 'node:assert/strict';
import { test } from 'node:test';
import { describeProject } from './inspect.mjs';

test('identifies a project without assuming it has a name', () => {
  assert.equal(describeProject({ name: 'my-project' }), 'Project: my-project');
  assert.equal(describeProject({}), 'Project: unnamed');
});
test('rejects a non-object manifest', () => {
  for (const value of [null, [], 'hello']) assert.throws(() => describeProject(value), /object/);
});
