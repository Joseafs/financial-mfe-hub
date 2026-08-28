import { loadRemoteManifest } from './runtime/remote-manifest';
import { loadRuntimeServices } from './runtime/runtime-services';

async function bootstrapShell() {
  await Promise.all([loadRemoteManifest(), loadRuntimeServices()]);
  await import('./root-config');
}

void bootstrapShell().catch((error: unknown) => {
  console.error('[shell] bootstrap failed', error);

  const root = document.getElementById('mfe-root');

  if (root) {
    root.innerHTML = `
      <section class="shell-runtime-error" role="alert">
        <strong>Shell bootstrap failed</strong>
        <span>A configuracao de runtime ou o bootstrap do Shell falhou. Abra o console para o diagnostico tecnico.</span>
      </section>
    `;
  }
});
