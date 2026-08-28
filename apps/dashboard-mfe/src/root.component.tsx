import { useEffect, useState } from 'react';

const pages = {
  overview: {
    label: 'Overview',
    title: 'Dashboard MFE',
    description: 'Bloco azul que prova lifecycle, rota e composição dentro da mesma SPA.',
    cards: ['mount / unmount', 'route ownership', 'independent remote'],
  },
  runtime: {
    label: 'Runtime',
    title: 'Runtime do Dashboard',
    description: 'Esta subrota pertence ao próprio Dashboard MFE sem trocar o Shell.',
    cards: ['remote :4201', 'remoteEntry.js', 'single-spa lifecycle'],
  },
  boundary: {
    label: 'Boundary',
    title: 'Fronteira do Dashboard',
    description: 'O domínio não importa internals de Accounts, Payments ou Insurance.',
    cards: ['public contracts', 'isolated ownership', 'deploy boundary'],
  },
} as const;

type PageKey = keyof typeof pages;

function readPage(): PageKey {
  const segment = window.location.pathname.split('/')[2] as PageKey | undefined;
  return segment && segment in pages ? segment : 'overview';
}

export function RootComponent() {
  const [page, setPage] = useState<PageKey>(readPage);
  const content = pages[page];

  useEffect(() => {
    const syncRoute = () => setPage(readPage());

    window.addEventListener('single-spa:routing-event', syncRoute);
    window.addEventListener('popstate', syncRoute);

    return () => {
      window.removeEventListener('single-spa:routing-event', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  return (
    <section
      data-mfe="dashboard"
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '440px',
        borderRadius: '22px',
        padding: 'clamp(24px, 4vw, 44px)',
        background: 'linear-gradient(135deg, #1d4ed8 0%, #0f172a 72%)',
        border: '1px solid #60a5fa',
        boxShadow: '0 24px 80px rgba(29, 78, 216, 0.22)',
      }}
    >
      <div
        data-release-status="active"
        data-release-version={__FMH_VERSION__}
        style={{
          position: 'absolute',
          top: '18px',
          right: '18px',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 11px',
          borderRadius: '999px',
          border: '1px solid rgba(191,219,254,.45)',
          background: 'rgba(15,23,42,.72)',
          boxShadow: '0 10px 30px rgba(15,23,42,.28)',
          backdropFilter: 'blur(10px)',
          fontSize: '11px',
        }}
      >
        <span style={{ width: '7px', height: '7px', borderRadius: '999px', background: '#4ade80', boxShadow: '0 0 12px rgba(74,222,128,.8)' }} />
        <strong style={{ color: '#eff6ff' }}>LIVE · v{__FMH_VERSION__}</strong>
        <span style={{ color: '#93c5fd' }}>{__FMH_ENV__}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
        <div>
          <small style={{ letterSpacing: '0.16em', color: '#bfdbfe', fontWeight: 800 }}>
            DASHBOARD · ARCHITECTURE STUB
          </small>
          <h1 style={{ margin: '12px 0 8px', fontSize: 'clamp(34px, 5vw, 58px)', letterSpacing: '-0.04em' }}>
            {content.title}
          </h1>
          <p style={{ maxWidth: '720px', color: '#dbeafe', lineHeight: 1.65 }}>{content.description}</p>
        </div>

        <dl style={{ margin: '52px 0 0', minWidth: '220px', display: 'grid', gridTemplateColumns: '90px 1fr', gap: '6px 12px', fontSize: '12px' }}>
          <dt style={{ color: '#93c5fd' }}>application</dt><dd style={{ margin: 0 }}>{__FMH_APP_NAME__}</dd>
          <dt style={{ color: '#93c5fd' }}>version</dt><dd style={{ margin: 0 }}>{__FMH_VERSION__}</dd>
          <dt style={{ color: '#93c5fd' }}>environment</dt><dd style={{ margin: 0 }}>{__FMH_ENV__}</dd>
        </dl>
      </div>

      <nav aria-label="Dashboard pages" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '34px' }}>
        {(Object.keys(pages) as PageKey[]).map((key) => (
          <a
            key={key}
            data-single-spa-navigation
            href={key === 'overview' ? '/dashboard' : `/dashboard/${key}`}
            aria-current={page === key ? 'page' : undefined}
            style={{
              padding: '9px 13px',
              borderRadius: '999px',
              textDecoration: 'none',
              border: page === key ? '1px solid #bfdbfe' : '1px solid rgba(191,219,254,.25)',
              background: page === key ? 'rgba(219,234,254,.16)' : 'rgba(15,23,42,.22)',
              color: '#eff6ff',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            {pages[key].label}
          </a>
        ))}
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '22px' }}>
        {content.cards.map((card) => (
          <article key={card} style={{ padding: '18px', borderRadius: '16px', border: '1px solid rgba(191,219,254,.18)', background: 'rgba(15,23,42,.28)' }}>
            <span style={{ color: '#eff6ff', fontSize: '13px', fontWeight: 700 }}>{card}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
