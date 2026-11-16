import assert from 'node:assert/strict';
import { test } from 'node:test';
import { matchesCommand, isCommandShortcut, developerShortcut } from './command-search.ts';

test('search matches all words across group and label, ignoring case and whitespace', () => {
  const command = { label: 'React Render Detective', group: 'Demos' };
  assert.equal(matchesCommand(command, '  REACT demos '), true);
  assert.equal(matchesCommand(command, 'react missing'), false);
  assert.equal(matchesCommand(command, '   '), false);
  assert.equal(matchesCommand({ label: 'All demos', group: 'Navigation' }, ''), true);
});

test('palette shortcut accepts Cmd or Ctrl K, but ignores repeats, composition and extra modifiers', () => {
  const event = {
    key: 'k',
    metaKey: true,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    repeat: false,
    isComposing: false,
  };
  assert.equal(isCommandShortcut(event), true);
  assert.equal(isCommandShortcut({ ...event, metaKey: false, ctrlKey: true }), true);
  for (const key of ['altKey', 'shiftKey', 'repeat', 'isComposing'] as const)
    assert.equal(isCommandShortcut({ ...event, [key]: true }), false);
  assert.equal(isCommandShortcut({ ...event, metaKey: false }), false);
});

test('developer shortcuts use physical keys and ignore repeats or other modifiers', () => {
  const event = {
    code: 'KeyD',
    altKey: true,
    shiftKey: true,
    ctrlKey: false,
    metaKey: false,
    repeat: false,
    isComposing: false,
  };
  assert.equal(developerShortcut(event), 'debug');
  assert.equal(developerShortcut({ ...event, code: 'KeyG' }), 'gallery');
  assert.equal(developerShortcut({ ...event, code: 'KeyR' }), undefined);
  assert.equal(developerShortcut({ ...event, altKey: false }), undefined);
  assert.equal(developerShortcut({ ...event, repeat: true }), undefined);
  assert.equal(developerShortcut({ ...event, isComposing: true }), undefined);
});
