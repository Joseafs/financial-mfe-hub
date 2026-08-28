import 'react';
import 'react-dom/client';
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

document.addEventListener('click', handleShellNavigation);

addErrorHandler((error) => {
  console.error('[shell] single-spa error', error);
});

if (window.location.pathname === '/') {
  window.history.replaceState(null, '', '/dashboard');
}

start({ urlRerouteOnly: true });
