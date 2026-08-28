import { getRemoteDefinition, type RemoteName } from './remote-manifest';

export type RemoteLifecycleModule = {
  bootstrap: () => Promise<void>;
  mount: () => Promise<void>;
  unmount: () => Promise<void>;
};

export function createRemoteFallback(remoteName: RemoteName, error: unknown): RemoteLifecycleModule {
  const remote = getRemoteDefinition(remoteName);

  return {
    bootstrap: async () => undefined,
    mount: async () => {
      const root = document.getElementById('mfe-root');

      if (!root) {
        throw new Error('[shell] #mfe-root not found while mounting remote fallback');
      }

      const section = document.createElement('section');
      section.className = 'shell-runtime-error';
      section.setAttribute('role', 'alert');

      const title = document.createElement('strong');
      title.textContent = `${remoteName} remote unavailable`;

      const description = document.createElement('span');
      description.textContent = 'O Shell continua operacional e os demais MFEs permanecem disponíveis.';

      const metadata = document.createElement('code');
      metadata.textContent = `${remote.version} · ${remote.remoteEntry}`;

      const actions = document.createElement('div');
      actions.className = 'shell-runtime-error__actions';

      const retryButton = document.createElement('button');
      retryButton.type = 'button';
      retryButton.textContent = 'Tentar novamente';
      retryButton.addEventListener('click', () => window.location.reload());

      const remoteLink = document.createElement('a');
      remoteLink.href = remote.remoteEntry;
      remoteLink.target = '_blank';
      remoteLink.rel = 'noreferrer';
      remoteLink.textContent = 'Abrir remoteEntry';

      actions.append(retryButton, remoteLink);
      section.append(title, description, metadata, actions);
      root.replaceChildren(section);

      console.error(`[shell] mounted fallback for ${remoteName}`, error);
    },
    unmount: async () => {
      document.getElementById('mfe-root')?.replaceChildren();
    },
  };
}
