void import('./root-config').catch((error: unknown) => {
  console.error('[shell] bootstrap failed', error);

  const root = document.getElementById('mfe-root');

  if (root) {
    root.innerHTML = `
      <section class="shell-runtime-error" role="alert">
        <strong>Shell bootstrap failed</strong>
        <span>Abra o console para o diagnóstico técnico.</span>
      </section>
    `;
  }
});
