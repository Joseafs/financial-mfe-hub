import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const bumpFlag = args.find((arg) => ['--major', '--minor', '--patch'].includes(arg));
const description = args
  .filter((arg) => !['--major', '--minor', '--patch'].includes(arg))
  .join(' ')
  .trim();

if (!description) {
  console.error('Uso: pnpm tag "Descrição da tag" [--patch|--minor|--major]');
  process.exit(1);
}

function git(commandArgs, options = {}) {
  const output = execFileSync('git', commandArgs, {
    encoding: 'utf8',
    stdio: options.stdio ?? ['ignore', 'pipe', 'pipe'],
  });

  return typeof output === 'string' ? output.trim() : '';
}

const workingTree = git(['status', '--porcelain']);

if (workingTree) {
  console.error(
    'A working tree precisa estar limpa antes de criar uma tag. Commit ou descarte as alterações locais.',
  );
  process.exit(1);
}

git(['fetch', '--tags', '--quiet']);

const versionPattern = /^v(\d+)\.(\d+)\.(\d+)(?:-[0-9A-Za-z.-]+)?$/;
const tags = git(['tag', '--list', 'v*', '--sort=-v:refname'])
  .split('\n')
  .map((tag) => tag.trim())
  .filter(Boolean)
  .map((tag) => ({ tag, match: tag.match(versionPattern) }))
  .filter(({ match }) => Boolean(match));

const latestTag = tags[0]?.tag;

if (latestTag) {
  const headCommit = git(['rev-parse', 'HEAD']);
  const tagCommit = git(['rev-list', '-n', '1', latestTag]);
  const remoteTag = git(['ls-remote', '--tags', 'origin', `refs/tags/${latestTag}`]);

  if (tagCommit === headCommit && !remoteTag) {
    console.log(`Tag local ${latestTag} encontrada sem push. Enviando para origin...`);
    git(['push', 'origin', latestTag], { stdio: 'inherit' });
    console.log(`Tag ${latestTag} enviada para origin.`);
    process.exit(0);
  }
}

const current = tags[0]?.match;
let major = current ? Number(current[1]) : 0;
let minor = current ? Number(current[2]) : 0;
let patch = current ? Number(current[3]) : 0;

if (!current) {
  minor = 1;
  patch = 0;
} else if (bumpFlag === '--major') {
  major += 1;
  minor = 0;
  patch = 0;
} else if (bumpFlag === '--minor') {
  minor += 1;
  patch = 0;
} else {
  patch += 1;
}

const nextTag = `v${major}.${minor}.${patch}`;

try {
  git(['rev-parse', '--verify', `refs/tags/${nextTag}`]);
  console.error(`A tag ${nextTag} já existe.`);
  process.exit(1);
} catch {
  // Expected when the next tag does not exist yet.
}

console.log(`Criando ${nextTag}: ${description}`);

git(['tag', '-a', nextTag, '-m', description], { stdio: 'inherit' });
git(['push', 'origin', nextTag], { stdio: 'inherit' });

console.log(`Tag ${nextTag} criada e enviada para origin.`);
