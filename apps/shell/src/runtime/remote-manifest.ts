export type RemoteName = 'dashboard' | 'accounts' | 'payments' | 'insurance';

export type RemoteDefinition = {
  scope: string;
  version: string;
  remoteEntry: string;
};

export type RemoteManifest = {
  schemaVersion: 1;
  environment: string;
  remotes: Record<RemoteName, RemoteDefinition>;
};

const REMOTE_NAMES: RemoteName[] = ['dashboard', 'accounts', 'payments', 'insurance'];

let manifest: RemoteManifest | null = null;

function isRemoteDefinition(value: unknown): value is RemoteDefinition {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<RemoteDefinition>;

  return (
    typeof candidate.scope === 'string' &&
    candidate.scope.length > 0 &&
    typeof candidate.version === 'string' &&
    candidate.version.length > 0 &&
    typeof candidate.remoteEntry === 'string' &&
    /^https?:\/\//.test(candidate.remoteEntry)
  );
}

function parseRemoteManifest(value: unknown): RemoteManifest {
  if (!value || typeof value !== 'object') {
    throw new Error('[shell] remote manifest must be an object');
  }

  const candidate = value as Partial<RemoteManifest>;

  if (candidate.schemaVersion !== 1) {
    throw new Error('[shell] unsupported remote manifest schema');
  }

  if (typeof candidate.environment !== 'string' || !candidate.environment) {
    throw new Error('[shell] remote manifest environment is required');
  }

  if (!candidate.remotes || typeof candidate.remotes !== 'object') {
    throw new Error('[shell] remote manifest remotes are required');
  }

  for (const remoteName of REMOTE_NAMES) {
    if (!isRemoteDefinition(candidate.remotes[remoteName])) {
      throw new Error(`[shell] invalid remote definition: ${remoteName}`);
    }
  }

  return candidate as RemoteManifest;
}

export async function loadRemoteManifest() {
  const response = await fetch('/remote-manifest.json', {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`[shell] remote manifest request failed with ${response.status}`);
  }

  manifest = parseRemoteManifest(await response.json());

  return manifest;
}

export function getRemoteManifest() {
  if (!manifest) {
    throw new Error('[shell] remote manifest was not loaded');
  }

  return manifest;
}

export function getRemoteDefinition(remoteName: RemoteName) {
  return getRemoteManifest().remotes[remoteName];
}
