import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

// Start here: replace this one observation with something useful to your workflow.
export function describeProject(manifest) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    throw new Error('Expected a package.json object.');
  }
  return `Project: ${typeof manifest.name === 'string' ? manifest.name : 'unnamed'}`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (!process.argv[2]) throw new Error('Usage: node inspect.mjs <path-to-package.json>');
    console.log(describeProject(JSON.parse(await readFile(process.argv[2], 'utf8'))));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
