import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptsDir, '..');
const distDir = resolve(appRoot, 'dist');
const localManifestPath = resolve(appRoot, 'public/remote-manifest.json');
const localServicesPath = resolve(appRoot, 'public/runtime-services.json');
const outputManifestPath = resolve(distDir, 'remote-manifest.json');
const outputServicesPath = resolve(distDir, 'runtime-services.json');

const remoteEnvironmentVariables = {
  dashboard: 'FMH_DASHBOARD_URL',
  accounts: 'FMH_ACCOUNTS_URL',
  payments: 'FMH_PAYMENTS_URL',
  insurance: 'FMH_INSURANCE_URL',
};

function normalizeUrl(value) {
  return value.replace(/\/$/, '');
}

async function buildProductionManifest() {
  const localManifest = JSON.parse(await readFile(localManifestPath, 'utf8'));
  const remotes = {};

  for (const [remoteName, environmentVariable] of Object.entries(
    remoteEnvironmentVariables,
  )) {
    const remoteUrl = process.env[environmentVariable];

    if (!remoteUrl) {
      throw new Error(
        `[shell] ${environmentVariable} is required to build the production remote manifest`,
      );
    }

    remotes[remoteName] = {
      scope: localManifest.remotes[remoteName].scope,
      active: {
        version: localManifest.remotes[remoteName].active.version,
        remoteEntry: `${normalizeUrl(remoteUrl)}/remoteEntry.js`,
      },
      stable: null,
    };
  }

  return {
    schemaVersion: localManifest.schemaVersion,
    environment: 'production',
    remotes,
  };
}

function buildProductionServices() {
  const bffUrl = process.env.FMH_BFF_URL;

  if (!bffUrl) {
    throw new Error('[shell] FMH_BFF_URL is required to build production runtime services');
  }

  return {
    schemaVersion: 1,
    environment: 'production',
    services: {
      bff: {
        baseUrl: normalizeUrl(bffUrl),
      },
    },
  };
}

await mkdir(distDir, { recursive: true });

if (process.env.FMH_ENV === 'production') {
  const [productionManifest, productionServices] = await Promise.all([
    buildProductionManifest(),
    Promise.resolve(buildProductionServices()),
  ]);

  await Promise.all([
    writeFile(outputManifestPath, `${JSON.stringify(productionManifest, null, 2)}\n`),
    writeFile(outputServicesPath, `${JSON.stringify(productionServices, null, 2)}\n`),
  ]);
} else {
  await Promise.all([
    copyFile(localManifestPath, outputManifestPath),
    copyFile(localServicesPath, outputServicesPath),
  ]);
}
