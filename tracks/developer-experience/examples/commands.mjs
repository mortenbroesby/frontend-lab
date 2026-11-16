import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export function commandReport(manifest) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    throw new Error('Expected a package.json object.');
  }
  const scripts = manifest.scripts ?? {};
  if (typeof scripts !== 'object' || Array.isArray(scripts))
    throw new Error('Expected a scripts object.');
  const entries = Object.entries(scripts).sort(([a], [b]) => a.localeCompare(b));
  if (entries.some(([, command]) => typeof command !== 'string'))
    throw new Error('Script commands must be strings.');
  return entries.length
    ? entries.map(([name, command]) => `${name}: ${command}`).join('\n')
    : 'No npm scripts defined.';
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (!process.argv[2]) throw new Error('Usage: node commands.mjs <path-to-package.json>');
    console.log(commandReport(JSON.parse(await readFile(process.argv[2], 'utf8'))));
  } catch (error) {
    console.error(`Cannot read command inventory: ${error.message}`);
    process.exitCode = 1;
  }
}
