void import('./lifecycles').catch((error: unknown) => {
  console.error('[dashboard-mfe] bootstrap module failed', error);
});
