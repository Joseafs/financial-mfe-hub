import {
  addErrorHandler,
  navigateToUrl,
  registerApplication,
  start,
} from 'single-spa';
import { loadFederatedModule } from './runtime/federation-loader';
import {
  createRemoteFallback,
  type RemoteLifecycleModule,
} from './runtime/remote-fallback';
import {
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
  const currentMfe = window.location.pathname.split('/')[1] || 'dashboard';
  const currentRoute = document.querySelector<HTMLElement>('[data-current-route]');

  if (currentRoute) {
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

    if (anchor) {
      anchor.title = `${application.name} ${remote.version} · ${remote.remoteEntry}`;
    }

    if (role) {
      role.textContent = `v${remote.version} · ${new URL(remote.remoteEntry).host}`;
    }
  }
}

document.addEventListener('click', handleShellNavigation);
window.addEventListener('single-spa:routing-event', syncShellNavigation);

addErrorHandler((error) => {
  console.error('[shell] unhandled single-spa runtime error', error);
});

if (window.location.pathname === '/') {
  window.history.replaceState(null, '', '/dashboard');
}

syncManifestMetadata();
syncShellNavigation();
start({ urlRerouteOnly: true });
