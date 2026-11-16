import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  matchesCommand,
  isCommandShortcut,
  developerShortcut,
  commandLabel,
} from './command-search.ts';

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

test('palette actions use Enter modifiers without stealing layout-switch shortcuts', () => {
  const event = {
    key: 'Enter',
    altKey: false,
    shiftKey: false,
    ctrlKey: true,
    metaKey: false,
    repeat: false,
    isComposing: false,
  };
  assert.equal(developerShortcut(event), 'debug');
  assert.equal(developerShortcut({ ...event, ctrlKey: false, shiftKey: true }), 'gallery');
  for (const patch of [
    { key: 'd', altKey: true, shiftKey: true },
    { key: 'k' },
    { ctrlKey: false },
    { shiftKey: true },
    { repeat: true },
    { isComposing: true },
    { altKey: true },
    { metaKey: true },
  ])
    assert.equal(developerShortcut({ ...event, ...patch }), undefined);
});

test('command label matches the platform keyboard', () => {
  for (const platform of ['Win32', 'Linux x86_64', ''])
    assert.equal(commandLabel(platform), 'Ctrl K');
  for (const platform of ['MacIntel', 'iPhone', 'iPad']) assert.equal(commandLabel(platform), '⌘K');
});
