import process from 'node:process';

const args = process.argv.slice(2);
const isProduction = args.includes('--production');
const environment = isProduction ? 'production' : 'local';

const defaults = {
  local: {
    shell: 'http://localhost:4200',
    dashboard: 'http://localhost:4201',
    accounts: 'http://localhost:4202',
    payments: 'http://localhost:4203',
    insurance: 'http://localhost:4204',
    bff: 'http://localhost:4300',
  },
  production: {
    shell: 'https://financial-mfe-hub-production-shell.onrender.com',
    dashboard: 'https://financial-mfe-hub-production-dashboard.onrender.com',
    accounts: 'https://financial-mfe-hub-production-accounts.onrender.com',
    payments: 'https://financial-mfe-hub-production-payments.onrender.com',
    insurance: 'https://financial-mfe-hub-production-insurance.onrender.com',
    bff: 'https://financial-mfe-hub-production-bff.onrender.com',
  },
};

function readOption(name) {
  const index = args.indexOf(`--${name}`);

  if (index === -1) {
    return undefined;
  }

  const value = args[index + 1];

  if (!value || value.startsWith('--')) {
    throw new Error(`Opcao --${name} exige uma URL.`);
  }

  return value;
}

function normalizeUrl(value) {
  return value.replace(/\/+$/, '');
}

const urls = {
  shell: normalizeUrl(readOption('shell') ?? defaults[environment].shell),
  dashboard: normalizeUrl(readOption('dashboard') ?? defaults[environment].dashboard),
  accounts: normalizeUrl(readOption('accounts') ?? defaults[environment].accounts),
  payments: normalizeUrl(readOption('payments') ?? defaults[environment].payments),
  insurance: normalizeUrl(readOption('insurance') ?? defaults[environment].insurance),
  bff: normalizeUrl(readOption('bff') ?? defaults[environment].bff),
};

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function request(label, url, options = {}) {
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      Accept: options.accept ?? '*/*',
    },
    signal: AbortSignal.timeout(options.timeoutMs ?? 15_000),
  });

  if (!response.ok) {
    throw new Error(`${label} respondeu HTTP ${response.status}: ${url}`);
  }

  return response;
}

async function checkShellRoute(pathname) {
  const response = await request(`Shell ${pathname}`, `${urls.shell}${pathname}`, {
    accept: 'text/html',
  });
  const body = await response.text();

  if (!body.includes('Financial MFE Hub')) {
    throw new Error(`Shell ${pathname} respondeu, mas o HTML esperado nao foi encontrado.`);
  }

  console.log(`✓ Shell ${pathname}`);
}

async function checkRemoteEntry(name) {
  const response = await request(`${name} remoteEntry`, `${urls[name]}/remoteEntry.js`, {
    accept: 'text/javascript, application/javascript, */*',
  });
  const body = await response.text();

  if (body.length < 100) {
    throw new Error(`${name} remoteEntry parece vazio ou incompleto.`);
  }

  console.log(`✓ ${name} /remoteEntry.js`);
}

async function checkManifest() {
  const response = await request('Shell runtime manifest', `${urls.shell}/remote-manifest.json`, {
    accept: 'application/json',
  });
  const manifest = await response.json();

  if (manifest?.schemaVersion !== 2 || !manifest?.remotes) {
    throw new Error('remote-manifest.json nao possui o schema esperado.');
  }

  if (isProduction && manifest.environment !== 'production') {
    throw new Error(`remote-manifest.json esta em ${manifest.environment}, esperado production.`);
  }

  for (const name of ['dashboard', 'accounts', 'payments', 'insurance']) {
    const remoteEntry = manifest.remotes?.[name]?.active?.remoteEntry;

    if (typeof remoteEntry !== 'string' || !remoteEntry.startsWith(urls[name])) {
      throw new Error(`Manifest aponta ${name} para uma URL inesperada: ${remoteEntry}`);
    }
  }

  console.log('✓ Shell /remote-manifest.json');
}

async function checkBffHealth() {
  const deadline = Date.now() + (isProduction ? 90_000 : 15_000);
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await request('BFF /health', `${urls.bff}/health`, {
        accept: 'application/json',
        timeoutMs: 20_000,
      });
      const health = await response.json();

      if (health?.status !== 'ok' || health?.service !== 'financial-mfe-bff') {
        throw new Error('BFF /health respondeu com payload inesperado.');
      }

      console.log(`✓ BFF /health (${health.environment})`);
      return;
    } catch (error) {
      lastError = error;

      if (!isProduction) {
        break;
      }

      process.stdout.write('· aguardando BFF free acordar...\n');
      await sleep(5_000);
    }
  }

  throw lastError ?? new Error('BFF /health nao ficou disponivel dentro do timeout.');
}

async function run() {
  console.log(`Financial MFE Hub smoke · ${environment}`);
  console.log(`Shell: ${urls.shell}`);
  console.log(`BFF:   ${urls.bff}\n`);

  await checkShellRoute('/architecture-health');
  await checkManifest();

  for (const pathname of ['/dashboard', '/accounts', '/payments', '/insurance']) {
    await checkShellRoute(pathname);
  }

  for (const name of ['dashboard', 'accounts', 'payments', 'insurance']) {
    await checkRemoteEntry(name);
  }

  await checkBffHealth();

  console.log('\n✓ HTTP smoke concluido sem falhas.');
  console.log('Nota: montagem real dos MFEs no navegador sera coberta pelo smoke Playwright do Architecture Gate.');
}

run().catch((error) => {
  console.error('\n✗ Smoke falhou.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
