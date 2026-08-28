import 'react';
import 'react-dom/client';
import {
  addErrorHandler,
  navigateToUrl,
  registerApplication,
  start,
} from 'single-spa';

const applications = [
  {
    name: 'dashboard',
    activeWhen: ['/dashboard'],
    app: () => import('dashboard/lifecycles'),
  },
  {
    name: 'accounts',
    activeWhen: ['/accounts'],
    app: () => import('accounts/lifecycles'),
  },
  {
    name: 'payments',
    activeWhen: ['/payments'],
    app: () => import('payments/lifecycles'),
  },
  {
    name: 'insurance',
    activeWhen: ['/insurance'],
    app: () => import('insurance/lifecycles'),
  },
] as const;

for (const application of applications) {
  registerApplication(application);
}

addErrorHandler((error) => {
  console.error('[shell] single-spa error', error);
});

if (window.location.pathname === '/') {
  window.history.replaceState(null, '', '/dashboard');
  navigateToUrl('/dashboard');
}

start({ urlRerouteOnly: true });
