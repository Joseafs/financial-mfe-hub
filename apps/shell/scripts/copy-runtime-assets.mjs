import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptsDir, '..');
const distDir = resolve(appRoot, 'dist');

await mkdir(distDir, { recursive: true });
await copyFile(resolve(appRoot, 'public/remote-manifest.json'), resolve(distDir, 'remote-manifest.json'));
