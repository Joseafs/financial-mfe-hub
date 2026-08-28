import { loadFederatedModule } from './runtime/federation-loader';
import type { RemoteLifecycleModule } from './runtime/remote-fallback';
import {
  getRemoteDefinition,
  getRemoteManifest,
  type RemoteName,
} from './runtime/remote-manifest';

export const ARCHITECTURE_HEALTH_ROUTE = '/architecture-health';

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

function setRemoteHealth(remoteName: RemoteName, state: 'checking' | 'online' | 'offline') {
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

  if (state === 'online') {
    badge.style.color = '#bbf7d0';
    badge.style.background = 'rgba(20,83,45,.42)';
  } else if (state === 'offline') {
    badge.style.color = '#fecaca';
    badge.style.background = 'rgba(127,29,29,.42)';
  } else {
    badge.style.color = '#bae6fd';
    badge.style.background = 'rgba(14,116,144,.28)';
  }
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

function startArchitectureHealthProbe() {
  if (healthProbe) {
    return;
  }

  healthProbe = Promise.all(remotes.map(({ name }) => probeRemote(name)))
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
