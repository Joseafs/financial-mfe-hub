import { getRemoteDefinition, type RemoteName } from './remote-manifest';

type Container = {
  init: (shareScope: unknown) => Promise<void> | void;
  get: (module: string) => Promise<() => unknown>;
};

declare const __webpack_init_sharing__: (scope: string) => Promise<void>;
declare const __webpack_share_scopes__: { default: unknown };

const containerCache = new Map<string, Promise<Container>>();
const initializedContainers = new WeakSet<Container>();

function getContainer(scope: string) {
  return (window as unknown as Record<string, unknown>)[scope] as Container | undefined;
}

function loadRemoteContainer(remoteName: RemoteName) {
  const remote = getRemoteDefinition(remoteName);
  const cacheKey = `${remote.scope}@${remote.remoteEntry}`;
  const cachedContainer = containerCache.get(cacheKey);

  if (cachedContainer) {
    return cachedContainer;
  }

  const containerPromise = new Promise<Container>((resolve, reject) => {
    const existingContainer = getContainer(remote.scope);

    if (existingContainer) {
      resolve(existingContainer);
      return;
    }

    const script = document.createElement('script');
    const timeout = window.setTimeout(() => {
      script.remove();
      containerCache.delete(cacheKey);
      reject(new Error(`[shell] timeout loading ${remoteName} from ${remote.remoteEntry}`));
    }, 10000);

    script.src = remote.remoteEntry;
    script.async = true;
    script.dataset.fmhRemote = remoteName;
    script.dataset.fmhVersion = remote.version;

    script.onload = () => {
      window.clearTimeout(timeout);

      const container = getContainer(remote.scope);

      if (!container) {
        containerCache.delete(cacheKey);
        reject(new Error(`[shell] ${remoteName} loaded without exposing scope ${remote.scope}`));
        return;
      }

      resolve(container);
    };

    script.onerror = () => {
      window.clearTimeout(timeout);
      script.remove();
      containerCache.delete(cacheKey);
      reject(new Error(`[shell] failed to load ${remoteName} from ${remote.remoteEntry}`));
    };

    document.head.appendChild(script);
  });

  containerCache.set(cacheKey, containerPromise);

  return containerPromise;
}

async function initializeContainer(container: Container) {
  if (initializedContainers.has(container)) {
    return;
  }

  await __webpack_init_sharing__('default');
  await container.init(__webpack_share_scopes__.default);
  initializedContainers.add(container);
}

export async function loadFederatedModule<T>(remoteName: RemoteName, exposedModule: string) {
  const container = await loadRemoteContainer(remoteName);

  await initializeContainer(container);

  const factory = await container.get(exposedModule);

  return factory() as T;
}
