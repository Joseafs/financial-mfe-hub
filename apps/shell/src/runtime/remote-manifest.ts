export type RemoteName = 'dashboard' | 'accounts' | 'payments' | 'insurance';
export type ReleaseChannel = 'active' | 'stable';

export type ReleaseDefinition = {
  version: string;
  remoteEntry: string;
};

export type RemoteDefinition = {
  scope: string;
  active: ReleaseDefinition;
  stable: ReleaseDefinition | null;
};

export type RemoteManifest = {
  schemaVersion: 2;
  environment: string;
  remotes: Record<RemoteName, RemoteDefinition>;
};

export type SelectedRemoteDefinition = ReleaseDefinition & {
  scope: string;
  channel: ReleaseChannel;
};

const REMOTE_NAMES: RemoteName[] = ['dashboard', 'accounts', 'payments', 'insurance'];
const RELEASE_OVERRIDE_PREFIX = 'fmh:release-channel:';

let manifest: RemoteManifest | null = null;

function isReleaseDefinition(value: unknown): value is ReleaseDefinition {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ReleaseDefinition>;

  return (
    typeof candidate.version === 'string' &&
    candidate.version.length > 0 &&
    typeof candidate.remoteEntry === 'string' &&
    /^https?:\/\//.test(candidate.remoteEntry)
  );
}

function isRemoteDefinition(value: unknown): value is RemoteDefinition {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<RemoteDefinition>;

  return (
    typeof candidate.scope === 'string' &&
    candidate.scope.length > 0 &&
    isReleaseDefinition(candidate.active) &&
    (candidate.stable === null || isReleaseDefinition(candidate.stable))
  );
}

function parseRemoteManifest(value: unknown): RemoteManifest {
  if (!value || typeof value !== 'object') {
    throw new Error('[shell] remote manifest must be an object');
  }

  const candidate = value as Partial<RemoteManifest>;

  if (candidate.schemaVersion !== 2) {
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

function getReleaseOverride(remoteName: RemoteName): ReleaseChannel | null {
  const value = window.sessionStorage.getItem(`${RELEASE_OVERRIDE_PREFIX}${remoteName}`);

  return value === 'stable' ? 'stable' : null;
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

export function getRemoteDefinition(remoteName: RemoteName): SelectedRemoteDefinition {
  const remote = getRemoteManifest().remotes[remoteName];
  const override = getReleaseOverride(remoteName);

  if (override === 'stable' && remote.stable) {
    return {
      scope: remote.scope,
      channel: 'stable',
      ...remote.stable,
    };
  }

  return {
    scope: remote.scope,
    channel: 'active',
    ...remote.active,
  };
}

export function selectStableRelease(remoteName: RemoteName) {
  const remote = getRemoteManifest().remotes[remoteName];

  if (!remote.stable) {
    throw new Error(`[shell] ${remoteName} has no stable release configured`);
  }

  window.sessionStorage.setItem(`${RELEASE_OVERRIDE_PREFIX}${remoteName}`, 'stable');
}

export function clearReleaseOverride(remoteName: RemoteName) {
  window.sessionStorage.removeItem(`${RELEASE_OVERRIDE_PREFIX}${remoteName}`);
}
