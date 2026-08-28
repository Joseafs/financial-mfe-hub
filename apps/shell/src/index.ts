import { loadRemoteManifest } from './runtime/remote-manifest';

async function bootstrapShell() {
  await loadRemoteManifest();
  await import('./root-config');
}

void bootstrapShell().catch((error: unknown) => {
  console.error('[shell] bootstrap failed', error);

  const root = document.getElementById('mfe-root');

  if (root) {
    root.innerHTML = `
      <section class="shell-runtime-error" role="alert">
        <strong>Shell bootstrap failed</strong>
        <span>O runtime manifest ou o bootstrap do Shell falhou. Abra o console para o diagnóstico técnico.</span>
      </section>
    `;
  }
});
