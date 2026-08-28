void import('./lifecycles').catch((error: unknown) => {
  console.error('[insurance-mfe] bootstrap module failed', error);
});
