import {
  addErrorHandler,
  navigateToUrl,
  registerApplication,
  start,
} from 'single-spa';

registerApplication({
  name: 'dashboard',
  activeWhen: ['/dashboard'],
  app: () => import('dashboard/lifecycles'),
});

registerApplication({
  name: 'accounts',
  activeWhen: ['/accounts'],
  app: () => import('accounts/lifecycles'),
});

registerApplication({
  name: 'payments',
  activeWhen: ['/payments'],
  app: () => import('payments/lifecycles'),
});

registerApplication({
  name: 'insurance',
  activeWhen: ['/insurance'],
  app: () => import('insurance/lifecycles'),
});

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

function renderRemoteFailure(error: unknown) {
  const root = document.getElementById('mfe-root');
  const currentMfe = window.location.pathname.split('/')[1] || 'unknown';

  console.error('[shell] single-spa error', error);

  if (!root) {
    return;
  }

  root.innerHTML = `
    <section class="shell-runtime-error" role="alert">
      <strong>${currentMfe} remote unavailable</strong>
      <span>O Shell permaneceu online. Consulte o console e o remote correspondente para o diagnóstico.</span>
    </section>
  `;
}

document.addEventListener('click', handleShellNavigation);
window.addEventListener('single-spa:routing-event', syncShellNavigation);

addErrorHandler(renderRemoteFailure);

if (window.location.pathname === '/') {
  window.history.replaceState(null, '', '/dashboard');
}

syncShellNavigation();
start({ urlRerouteOnly: true });
