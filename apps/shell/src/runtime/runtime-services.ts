export type RuntimeServices = {
  schemaVersion: 1;
  environment: string;
  services: {
    bff: {
      baseUrl: string;
    };
  };
};

let runtimeServices: RuntimeServices | null = null;

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string' || !value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function parseRuntimeServices(value: unknown): RuntimeServices {
  if (!value || typeof value !== 'object') {
    throw new Error('[shell] runtime services config must be an object');
  }

  const candidate = value as Partial<RuntimeServices>;

  if (candidate.schemaVersion !== 1) {
    throw new Error('[shell] unsupported runtime services schema');
  }

  if (typeof candidate.environment !== 'string' || !candidate.environment) {
    throw new Error('[shell] runtime services environment is required');
  }

  if (!candidate.services || typeof candidate.services !== 'object') {
    throw new Error('[shell] runtime services are required');
  }

  if (!candidate.services.bff || !isHttpUrl(candidate.services.bff.baseUrl)) {
    throw new Error('[shell] BFF runtime URL is invalid');
  }

  return candidate as RuntimeServices;
}

export async function loadRuntimeServices() {
  const response = await fetch('/runtime-services.json', {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`[shell] runtime services request failed with ${response.status}`);
  }

  runtimeServices = parseRuntimeServices(await response.json());

  return runtimeServices;
}

export function getRuntimeServices() {
  if (!runtimeServices) {
    throw new Error('[shell] runtime services were not loaded');
  }

  return runtimeServices;
}
