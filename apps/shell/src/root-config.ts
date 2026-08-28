import {
  addErrorHandler,
  navigateToUrl,
  registerApplication,
  start,
} from 'single-spa';
import {
  ARCHITECTURE_HEALTH_ROUTE,
  syncArchitectureHealthView,
} from './architecture-health';
import { loadFederatedModule } from './runtime/federation-loader';
import {
  createRemoteFallback,
  type RemoteLifecycleModule,
} from './runtime/remote-fallback';
import {
  clearReleaseOverride,
  getRemoteDefinition,
  getRemoteManifest,
  type RemoteName,
} from './runtime/remote-manifest';

const applications: Array<{ name: RemoteName; activeWhen: string }> = [
  { name: 'dashboard', activeWhen: '/dashboard' },
  { name: 'accounts', activeWhen: '/accounts' },
  { name: 'payments', activeWhen: '/payments' },
  { name: 'insurance', activeWhen: '/insurance' },
];

for (const application of applications) {
  registerApplication({
    name: application.name,
    activeWhen: [application.activeWhen],
    app: async () => {
      try {
        return await loadFederatedModule<RemoteLifecycleModule>(
          application.name,
          './lifecycles',
        );
      } catch (error) {
        return createRemoteFallback(application.name, error);
      }
    },
  });
}

function handleShellNavigation(event: MouseEvent) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const anchor = target.closest<HTMLAnchorElement>('a[data-single-spa-navigation]');

  if (!anchor || anchor.target || anchor.hasAttribute('download')) {
    return;
  }

  const destination = new URL(anchor.href, window.location.href);

  if (destination.origin !== window.location.origin) {
    return;
  }

  event.preventDefault();
  navigateToUrl(destination.href);
}

function syncShellNavigation() {
  const currentMfe = window.location.pathname.split('/')[1] || 'architecture-health';

  for (const currentRoute of document.querySelectorAll<HTMLElement>('[data-current-route]')) {
    currentRoute.textContent = window.location.pathname;
  }

  for (const anchor of document.querySelectorAll<HTMLAnchorElement>('[data-mfe-nav]')) {
    const isActive = anchor.dataset.mfeNav === currentMfe;

    if (isActive) {
      anchor.setAttribute('aria-current', 'page');
    } else {
      anchor.removeAttribute('aria-current');
    }
  }

  syncArchitectureHealthView();
}

function syncRollbackControl() {
  document.querySelector('[data-rollback-control]')?.remove();

  const rolledBack = applications
    .map((application) => ({
      name: application.name,
      selected: getRemoteDefinition(application.name),
      remote: getRemoteManifest().remotes[application.name],
    }))
    .find(({ selected }) => selected.channel === 'stable');

  if (!rolledBack) {
    return;
  }

  const stage = document.querySelector<HTMLElement>('.shell-stage');
  const header = stage?.querySelector<HTMLElement>('.shell-stage__header');

  if (!stage || !header) {
    return;
  }

  const control = document.createElement('div');
  control.dataset.rollbackControl = rolledBack.name;
  control.style.display = 'flex';
  control.style.alignItems = 'center';
  control.style.justifyContent = 'space-between';
  control.style.gap = '12px';
  control.style.flexWrap = 'wrap';
  control.style.marginBottom = '14px';
  control.style.padding = '12px 14px';
  control.style.borderRadius = '14px';
  control.style.border = '1px solid rgba(74,222,128,.28)';
  control.style.background = 'rgba(20,83,45,.18)';

  const text = document.createElement('span');
  text.style.color = '#bbf7d0';
  text.style.fontSize = '12px';
  text.textContent = `${rolledBack.name} está em rollback: stable v${rolledBack.selected.version} · active v${rolledBack.remote.active.version}`;

  const button = document.createElement('button');
  button.type = 'button';
  button.style.border = '1px solid rgba(187,247,208,.3)';
  button.style.borderRadius = '10px';
  button.style.padding = '8px 11px';
  button.style.background = 'rgba(15,23,42,.56)';
  button.style.color = '#dcfce7';
  button.style.cursor = 'pointer';
  button.textContent = `Restaurar active v${rolledBack.remote.active.version}`;
  button.addEventListener('click', () => {
    clearReleaseOverride(rolledBack.name);
    window.location.reload();
  });

  control.append(text, button);
  header.insertAdjacentElement('afterend', control);
}

function syncManifestMetadata() {
  const manifest = getRemoteManifest();
  const runtimeStatus = document.querySelector<HTMLElement>('.shell-live');

  if (runtimeStatus) {
    runtimeStatus.textContent = `${manifest.environment} runtime · manifest v${manifest.schemaVersion}`;
  }

  for (const application of applications) {
    const anchor = document.querySelector<HTMLAnchorElement>(
      `[data-mfe-nav="${application.name}"]`,
    );
    const role = anchor?.querySelector<HTMLElement>('.shell-node__role');
    const remote = manifest.remotes[application.name];
    const selected = getRemoteDefinition(application.name);
    const stableLabel = remote.stable ? ` · stable v${remote.stable.version}` : '';
    const selectedLabel = selected.channel === 'stable' ? 'rollback → ' : 'active ';

    if (anchor) {
      anchor.dataset.releaseChannel = selected.channel;
      anchor.dataset.releaseVersion = selected.version;
      anchor.title = `${application.name} · ${selected.channel} v${selected.version} · ${selected.remoteEntry}`;
    }

    if (role) {
      role.textContent = `${selectedLabel}v${selected.version}${stableLabel} · ${new URL(selected.remoteEntry).host}`;
    }
  }

  syncRollbackControl();
}

document.addEventListener('click', handleShellNavigation);
window.addEventListener('single-spa:routing-event', syncShellNavigation);

addErrorHandler((error) => {
  console.error('[shell] unhandled single-spa runtime error', error);
});

if (window.location.pathname === '/') {
  window.history.replaceState(null, '', ARCHITECTURE_HEALTH_ROUTE);
}

syncManifestMetadata();
syncShellNavigation();
start({ urlRerouteOnly: true });
