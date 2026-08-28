void import('./lifecycles').catch((error: unknown) => {
  console.error('[payments-mfe] bootstrap module failed', error);
});
