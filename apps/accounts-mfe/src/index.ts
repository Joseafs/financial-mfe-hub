void import('./lifecycles').catch((error: unknown) => {
  console.error('[accounts-mfe] bootstrap module failed', error);
});
