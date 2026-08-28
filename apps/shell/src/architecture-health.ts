import { loadFederatedModule } from './runtime/federation-loader';
import type { RemoteLifecycleModule } from './runtime/remote-fallback';
import {
  getRemoteDefinition,
  getRemoteManifest,
  type RemoteName,
} from './runtime/remote-manifest';
import { getRuntimeServices } from './runtime/runtime-services';

export const ARCHITECTURE_HEALTH_ROUTE = '/architecture-health';

type HealthState = 'checking' | 'online' | 'offline';

const remotes: Array<{ name: RemoteName; route: string; label: string }> = [
  { name: 'dashboard', route: '/dashboard', label: 'Dashboard' },
  { name: 'accounts', route: '/accounts', label: 'Accounts' },
  { name: 'payments', route: '/payments', label: 'Payments' },
  { name: 'insurance', route: '/insurance', label: 'Insurance' },
];

let healthProbe: Promise<void> | null = null;

function isArchitectureHealthRoute() {
  return window.location.pathname === ARCHITECTURE_HEALTH_ROUTE;
}

function setSectionVisibility(selector: string, visible: boolean) {
  const element = document.querySelector<HTMLElement>(selector);

  if (element) {
    element.hidden = !visible;
  }
}

function createTopbarLink(label: string, href: string, key: string) {
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.textContent = label;
  anchor.dataset.singleSpaNavigation = '';
  anchor.dataset.shellTopnav = key;
  anchor.style.padding = '7px 9px';
  anchor.style.borderRadius = '9px';
  anchor.style.border = '1px solid rgba(148,163,184,.14)';
  anchor.style.background = 'rgba(15,23,42,.44)';
  anchor.style.color = '#94a3b8';
  anchor.style.fontSize = '11px';
  anchor.style.fontWeight = '700';
  anchor.style.textDecoration = 'none';
  anchor.style.whiteSpace = 'nowrap';

  return anchor;
}

function ensureTopbarNavigation() {
  const topbar = document.querySelector<HTMLElement>('.shell-topbar__inner');

  if (!topbar || topbar.querySelector('[data-shell-topnav-container]')) {
    return;
  }

  const navigation = document.createElement('nav');
  navigation.dataset.shellTopnavContainer = '';
  navigation.setAttribute('aria-label', 'Navegação do Shell');
  navigation.style.display = 'flex';
  navigation.style.alignItems = 'center';
  navigation.style.gap = '6px';
  navigation.style.overflowX = 'auto';
  navigation.style.padding = '6px 0';

  navigation.append(
    createTopbarLink('Architecture Health', ARCHITECTURE_HEALTH_ROUTE, 'architecture-health'),
    ...remotes.map((remote) => createTopbarLink(remote.label, remote.route, remote.name)),
  );

  const runtimeStatus = topbar.querySelector('.shell-live');
  topbar.insertBefore(navigation, runtimeStatus ?? null);
}

function syncTopbarNavigation() {
  const currentRoute = window.location.pathname.split('/')[1] || 'architecture-health';

  for (const anchor of document.querySelectorAll<HTMLAnchorElement>('[data-shell-topnav]')) {
    const active = anchor.dataset.shellTopnav === currentRoute;
    anchor.style.color = active ? '#e0f2fe' : '#94a3b8';
    anchor.style.borderColor = active
      ? 'rgba(103,232,249,.45)'
      : 'rgba(148,163,184,.14)';
    anchor.style.background = active ? 'rgba(14,116,144,.22)' : 'rgba(15,23,42,.44)';

    if (active) {
      anchor.setAttribute('aria-current', 'page');
    } else {
      anchor.removeAttribute('aria-current');
    }
  }
}

function applyHealthColors(element: HTMLElement, state: HealthState) {
  if (state === 'online') {
    element.style.color = '#bbf7d0';
    element.style.background = 'rgba(20,83,45,.42)';
    element.style.borderColor = 'rgba(74,222,128,.28)';
  } else if (state === 'offline') {
    element.style.color = '#fecaca';
    element.style.background = 'rgba(127,29,29,.42)';
    element.style.borderColor = 'rgba(248,113,113,.28)';
  } else {
    element.style.color = '#bae6fd';
    element.style.background = 'rgba(14,116,144,.28)';
    element.style.borderColor = 'rgba(56,189,248,.24)';
  }
}

function setRemoteHealth(remoteName: RemoteName, state: HealthState) {
  const anchor = document.querySelector<HTMLAnchorElement>(`[data-mfe-nav="${remoteName}"]`);
  const badge = anchor?.querySelector<HTMLElement>('.shell-node__port');

  if (!badge) {
    return;
  }

  badge.textContent = state;
  badge.style.padding = '4px 7px';
  badge.style.borderRadius = '999px';
  badge.style.fontWeight = '800';
  badge.style.letterSpacing = '.04em';
  badge.style.textTransform = 'uppercase';
  applyHealthColors(badge, state);
}

function getBffRuntimeItem() {
  return Array.from(document.querySelectorAll<HTMLElement>('.shell-runtime__item')).find(
    (item) => item.querySelector('strong')?.textContent === 'BFF',
  );
}

function setBffHealth(state: HealthState) {
  const item = getBffRuntimeItem();

  if (!item) {
    return;
  }

  const bffUrl = getRuntimeServices().services.bff.baseUrl;
  const strong = document.createElement('strong');
  strong.textContent = 'BFF';

  item.replaceChildren(strong, document.createTextNode(` ${state} · ${new URL(bffUrl).host}`));
  item.title = `${bffUrl}/health`;
  applyHealthColors(item, state);
}

async function probeRemote(remoteName: RemoteName) {
  setRemoteHealth(remoteName, 'checking');

  try {
    await loadFederatedModule<RemoteLifecycleModule>(remoteName, './lifecycles');
    setRemoteHealth(remoteName, 'online');
  } catch (error) {
    console.error(`[shell] architecture health failed for ${remoteName}`, error);
    setRemoteHealth(remoteName, 'offline');
  }
}

function sleep(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function probeBff() {
  const bffUrl = getRuntimeServices().services.bff.baseUrl;
  const production = getRemoteManifest().environment === 'production';
  const maxAttempts = production ? 18 : 1;

  setBffHealth('checking');

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${bffUrl}/health`, {
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const health = (await response.json()) as { status?: string; service?: string };

      if (health.status !== 'ok' || health.service !== 'financial-mfe-bff') {
        throw new Error('unexpected health payload');
      }

      setBffHealth('online');
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        console.error('[shell] architecture health failed for BFF', error);
        setBffHealth('offline');
        return;
      }

      await sleep(5_000);
    }
  }
}

function startArchitectureHealthProbe() {
  if (healthProbe) {
    return;
  }

  healthProbe = Promise.all([
    ...remotes.map(({ name }) => probeRemote(name)),
    probeBff(),
  ])
    .then(() => undefined)
    .finally(() => {
      healthProbe = null;
    });
}

function syncArchitectureMetadata() {
  const manifest = getRemoteManifest();
  const brandMetadata = document.querySelector<HTMLElement>('.shell-brand span');

  if (brandMetadata) {
    brandMetadata.textContent = `Shell · Single-SPA · ${manifest.environment} · ${window.location.host}`;
  }

  for (const remote of remotes) {
    const selected = getRemoteDefinition(remote.name);
    const anchor = document.querySelector<HTMLAnchorElement>(`[data-mfe-nav="${remote.name}"]`);

    if (anchor) {
      anchor.setAttribute(
        'aria-label',
        `${remote.label} ${selected.channel} v${selected.version} em ${new URL(selected.remoteEntry).host}`,
      );
    }
  }

  const bffItem = getBffRuntimeItem();

  if (bffItem) {
    bffItem.title = `${getRuntimeServices().services.bff.baseUrl}/health`;
  }
}

export function syncArchitectureHealthView() {
  ensureTopbarNavigation();
  syncTopbarNavigation();
  syncArchitectureMetadata();

  const architectureHealth = isArchitectureHealthRoute();

  setSectionVisibility('.shell-hero', architectureHealth);
  setSectionVisibility('.shell-map', architectureHealth);
  setSectionVisibility('.shell-runtime', architectureHealth);
  setSectionVisibility('.shell-stage', !architectureHealth);

  if (architectureHealth) {
    document.title = 'Financial MFE Hub — Architecture Health';
    startArchitectureHealthProbe();
  } else {
    document.title = 'Financial MFE Hub';
  }
}
