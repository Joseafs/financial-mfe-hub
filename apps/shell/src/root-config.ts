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

addErrorHandler((error) => {
  console.error('[shell] single-spa error', error);
});

if (window.location.pathname === '/') {
  window.history.replaceState(null, '', '/dashboard');
  navigateToUrl('/dashboard');
}

start({ urlRerouteOnly: true });
