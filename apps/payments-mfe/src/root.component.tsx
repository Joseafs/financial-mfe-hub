import { useEffect, useState } from 'react';

const pages = {
  overview: {
    label: 'Overview',
    title: 'Payments MFE',
    description: 'Bloco roxo que prova independência de deploy sem antecipar o fluxo financeiro real.',
    cards: ['payments surface', 'route ownership', 'independent remote'],
  },
  runtime: {
    label: 'Runtime',
    title: 'Runtime de Payments',
    description: 'A subrota continua sob /payments e demonstra navegação interna no mesmo Micro Frontend.',
    cards: ['remote :4203', 'remoteEntry.js', 'single-spa lifecycle'],
  },
  boundary: {
    label: 'Boundary',
    title: 'Fronteira de Payments',
    description: 'O MFE expõe apenas contratos públicos e não depende de internals de outros domínios.',
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
      data-mfe="payments"
      style={{
        minHeight: '440px',
        borderRadius: '22px',
        padding: 'clamp(24px, 4vw, 44px)',
        background: 'linear-gradient(135deg, #7c3aed 0%, #2e1065 72%)',
        border: '1px solid #a78bfa',
        boxShadow: '0 24px 80px rgba(124, 58, 237, 0.22)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
        <div>
          <small style={{ letterSpacing: '0.16em', color: '#ddd6fe', fontWeight: 800 }}>
            PAYMENTS · ARCHITECTURE STUB
          </small>
          <h1 style={{ margin: '12px 0 8px', fontSize: 'clamp(34px, 5vw, 58px)', letterSpacing: '-0.04em' }}>
            {content.title}
          </h1>
          <p style={{ maxWidth: '720px', color: '#ede9fe', lineHeight: 1.65 }}>{content.description}</p>
        </div>

        <dl style={{ margin: 0, minWidth: '220px', display: 'grid', gridTemplateColumns: '90px 1fr', gap: '6px 12px', fontSize: '12px' }}>
          <dt style={{ color: '#c4b5fd' }}>application</dt><dd style={{ margin: 0 }}>{__FMH_APP_NAME__}</dd>
          <dt style={{ color: '#c4b5fd' }}>version</dt><dd style={{ margin: 0 }}>{__FMH_VERSION__}</dd>
          <dt style={{ color: '#c4b5fd' }}>environment</dt><dd style={{ margin: 0 }}>{__FMH_ENV__}</dd>
        </dl>
      </div>

      <nav aria-label="Payments pages" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '34px' }}>
        {(Object.keys(pages) as PageKey[]).map((key) => (
          <a
            key={key}
            data-single-spa-navigation
            href={key === 'overview' ? '/payments' : `/payments/${key}`}
            aria-current={page === key ? 'page' : undefined}
            style={{
              padding: '9px 13px',
              borderRadius: '999px',
              textDecoration: 'none',
              border: page === key ? '1px solid #ddd6fe' : '1px solid rgba(221,214,254,.25)',
              background: page === key ? 'rgba(237,233,254,.14)' : 'rgba(46,16,101,.26)',
              color: '#faf5ff',
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
          <article key={card} style={{ padding: '18px', borderRadius: '16px', border: '1px solid rgba(221,214,254,.18)', background: 'rgba(46,16,101,.28)' }}>
            <span style={{ color: '#faf5ff', fontSize: '13px', fontWeight: 700 }}>{card}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
