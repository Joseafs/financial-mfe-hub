import {
  clearReleaseOverride,
  getRemoteDefinition,
  getRemoteManifest,
  selectStableRelease,
  type RemoteName,
} from './remote-manifest';

export type RemoteLifecycleModule = {
  bootstrap: () => Promise<void>;
  mount: () => Promise<void>;
  unmount: () => Promise<void>;
};

export function createRemoteFallback(remoteName: RemoteName, error: unknown): RemoteLifecycleModule {
  const selectedRelease = getRemoteDefinition(remoteName);
  const remote = getRemoteManifest().remotes[remoteName];

  return {
    bootstrap: async () => undefined,
    mount: async () => {
      const root = document.getElementById('mfe-root');

      if (!root) {
        throw new Error('[shell] #mfe-root not found while mounting remote fallback');
      }

      // POC demonstrativa: se a active não carregar e existir uma única last stable conhecida,
      // o Shell seleciona essa stable automaticamente e recarrega a mesma rota.
      // Em produção, essa decisão será responsabilidade do health/release-control no Render;
      // o browser não será a autoridade operacional do rollback.
      if (selectedRelease.channel === 'active' && remote.stable) {
        console.warn(
          `[shell] POC auto rollback ${remoteName}: active v${selectedRelease.version} -> stable v${remote.stable.version}`,
          error,
        );
        selectStableRelease(remoteName);
        window.location.reload();
        return;
      }

      const section = document.createElement('section');
      section.className = 'shell-runtime-error';
      section.setAttribute('role', 'alert');
      section.dataset.mfe = remoteName;
      section.dataset.releaseStatus = 'unavailable';
      section.dataset.releaseVersion = selectedRelease.version;
      section.dataset.releaseChannel = selectedRelease.channel;
      section.style.position = 'relative';

      const releaseBadge = document.createElement('div');
      releaseBadge.dataset.releaseStatus = 'unavailable';
      releaseBadge.dataset.releaseVersion = selectedRelease.version;
      releaseBadge.style.position = 'absolute';
      releaseBadge.style.top = '18px';
      releaseBadge.style.right = '18px';
      releaseBadge.style.padding = '8px 11px';
      releaseBadge.style.borderRadius = '999px';
      releaseBadge.style.border = '1px solid rgba(252,165,165,.5)';
      releaseBadge.style.background = 'rgba(127,29,29,.55)';
      releaseBadge.style.color = '#fee2e2';
      releaseBadge.style.fontSize = '11px';
      releaseBadge.style.fontWeight = '800';
      releaseBadge.textContent = `UNAVAILABLE · ${selectedRelease.channel} v${selectedRelease.version}`;

      const title = document.createElement('strong');
      title.textContent = `${remoteName} remote unavailable`;

      const description = document.createElement('span');
      description.textContent =
        selectedRelease.channel === 'stable'
          ? 'A active falhou e a last stable também está indisponível. O Shell e os demais MFEs continuam operacionais.'
          : 'Não existe uma last stable configurada para este MFE. O Shell e os demais MFEs continuam operacionais.';

      const metadata = document.createElement('code');
      metadata.textContent = `${selectedRelease.channel} v${selectedRelease.version} · ${selectedRelease.remoteEntry}`;

      const actions = document.createElement('div');
      actions.className = 'shell-runtime-error__actions';

      const retryButton = document.createElement('button');
      retryButton.type = 'button';
      retryButton.textContent = 'Tentar novamente';
      retryButton.addEventListener('click', () => window.location.reload());
      actions.append(retryButton);

      if (selectedRelease.channel === 'stable') {
        const activeButton = document.createElement('button');
        activeButton.type = 'button';
        activeButton.textContent = `Testar active v${remote.active.version} novamente`;
        activeButton.addEventListener('click', () => {
          clearReleaseOverride(remoteName);
          window.location.reload();
        });
        actions.append(activeButton);
      }

      const remoteLink = document.createElement('a');
      remoteLink.href = selectedRelease.remoteEntry;
      remoteLink.target = '_blank';
      remoteLink.rel = 'noreferrer';
      remoteLink.textContent = 'Abrir remoteEntry';
      actions.append(remoteLink);

      section.append(releaseBadge, title, description, metadata, actions);
      root.replaceChildren(section);

      console.error(`[shell] mounted fallback for ${remoteName}`, error);
    },
    unmount: async () => {
      document.getElementById('mfe-root')?.replaceChildren();
    },
  };
}
