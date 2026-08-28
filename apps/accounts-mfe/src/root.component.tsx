import { useEffect, useState } from 'react';

const pages = {
  overview: {
    label: 'Overview',
    title: 'Accounts MFE',
    description: 'Bloco verde que prova um domínio independente convivendo dentro do mesmo Shell.',
    cards: ['account surface', 'route ownership', 'independent remote'],
  },
  runtime: {
    label: 'Runtime',
    title: 'Runtime de Accounts',
    description: 'A subrota continua sob /accounts e mantém o mesmo Micro Frontend montado.',
    cards: ['remote :4202', 'remoteEntry.js', 'single-spa lifecycle'],
  },
  boundary: {
    label: 'Boundary',
    title: 'Fronteira de Accounts',
    description: 'Accounts possui ownership próprio e conversa com o restante apenas por contratos públicos.',
    cards: ['public contracts', 'isolated owner', 'deploy boundary'],
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
      data-mfe="accounts"
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '440px',
        borderRadius: '22px',
        padding: 'clamp(24px, 4vw, 44px)',
        background: 'linear-gradient(135deg, #15803d 0%, #052e16 72%)',
        border: '1px solid #4ade80',
        boxShadow: '0 24px 80px rgba(21, 128, 61, 0.22)',
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
          border: '1px solid rgba(187,247,208,.45)',
          background: 'rgba(5,46,22,.72)',
          boxShadow: '0 10px 30px rgba(5,46,22,.28)',
          backdropFilter: 'blur(10px)',
          fontSize: '11px',
        }}
      >
        <span style={{ width: '7px', height: '7px', borderRadius: '999px', background: '#4ade80', boxShadow: '0 0 12px rgba(74,222,128,.8)' }} />
        <strong style={{ color: '#f0fdf4' }}>LIVE · v{__FMH_VERSION__}</strong>
        <span style={{ color: '#86efac' }}>{__FMH_ENV__}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
        <div>
          <small style={{ letterSpacing: '0.16em', color: '#bbf7d0', fontWeight: 800 }}>
            ACCOUNTS · ARCHITECTURE STUB
          </small>
          <h1 style={{ margin: '12px 0 8px', fontSize: 'clamp(34px, 5vw, 58px)', letterSpacing: '-0.04em' }}>
            {content.title}
          </h1>
          <p style={{ maxWidth: '720px', color: '#dcfce7', lineHeight: 1.65 }}>{content.description}</p>
        </div>

        <dl style={{ margin: '52px 0 0', minWidth: '220px', display: 'grid', gridTemplateColumns: '90px 1fr', gap: '6px 12px', fontSize: '12px' }}>
          <dt style={{ color: '#86efac' }}>application</dt><dd style={{ margin: 0 }}>{__FMH_APP_NAME__}</dd>
          <dt style={{ color: '#86efac' }}>version</dt><dd style={{ margin: 0 }}>{__FMH_VERSION__}</dd>
          <dt style={{ color: '#86efac' }}>environment</dt><dd style={{ margin: 0 }}>{__FMH_ENV__}</dd>
        </dl>
      </div>

      <nav aria-label="Accounts pages" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '34px' }}>
        {(Object.keys(pages) as PageKey[]).map((key) => (
          <a
            key={key}
            data-single-spa-navigation
            href={key === 'overview' ? '/accounts' : `/accounts/${key}`}
            aria-current={page === key ? 'page' : undefined}
            style={{
              padding: '9px 13px',
              borderRadius: '999px',
              textDecoration: 'none',
              border: page === key ? '1px solid #bbf7d0' : '1px solid rgba(187,247,208,.25)',
              background: page === key ? 'rgba(220,252,231,.14)' : 'rgba(5,46,22,.26)',
              color: '#f0fdf4',
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
          <article key={card} style={{ padding: '18px', borderRadius: '16px', border: '1px solid rgba(187,247,208,.18)', background: 'rgba(5,46,22,.26)' }}>
            <span style={{ color: '#f0fdf4', fontSize: '13px', fontWeight: 700 }}>{card}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
