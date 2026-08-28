import { useEffect, useState } from 'react';

const pages = {
  overview: {
    label: 'Overview',
    title: 'Insurance MFE',
    description: 'Bloco laranja que valida o quarto domínio antes de qualquer simulação de seguro real.',
    cards: ['insurance surface', 'route ownership', 'independent remote'],
  },
  runtime: {
    label: 'Runtime',
    title: 'Runtime de Insurance',
    description: 'A subrota permanece sob /insurance e o Shell continua intacto durante a navegação.',
    cards: ['remote :4204', 'remoteEntry.js', 'single-spa lifecycle'],
  },
  boundary: {
    label: 'Boundary',
    title: 'Fronteira de Insurance',
    description: 'O domínio mantém ownership próprio e evita acoplamento interno com os outros MFEs.',
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
      data-mfe="insurance"
      style={{
        minHeight: '440px',
        borderRadius: '22px',
        padding: 'clamp(24px, 4vw, 44px)',
        background: 'linear-gradient(135deg, #c2410c 0%, #431407 72%)',
        border: '1px solid #fb923c',
        boxShadow: '0 24px 80px rgba(194, 65, 12, 0.22)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
        <div>
          <small style={{ letterSpacing: '0.16em', color: '#fed7aa', fontWeight: 800 }}>
            INSURANCE · ARCHITECTURE STUB
          </small>
          <h1 style={{ margin: '12px 0 8px', fontSize: 'clamp(34px, 5vw, 58px)', letterSpacing: '-0.04em' }}>
            {content.title}
          </h1>
          <p style={{ maxWidth: '720px', color: '#ffedd5', lineHeight: 1.65 }}>{content.description}</p>
        </div>

        <dl style={{ margin: 0, minWidth: '220px', display: 'grid', gridTemplateColumns: '90px 1fr', gap: '6px 12px', fontSize: '12px' }}>
          <dt style={{ color: '#fdba74' }}>application</dt><dd style={{ margin: 0 }}>{__FMH_APP_NAME__}</dd>
          <dt style={{ color: '#fdba74' }}>version</dt><dd style={{ margin: 0 }}>{__FMH_VERSION__}</dd>
          <dt style={{ color: '#fdba74' }}>environment</dt><dd style={{ margin: 0 }}>{__FMH_ENV__}</dd>
        </dl>
      </div>

      <nav aria-label="Insurance pages" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '34px' }}>
        {(Object.keys(pages) as PageKey[]).map((key) => (
          <a
            key={key}
            data-single-spa-navigation
            href={key === 'overview' ? '/insurance' : `/insurance/${key}`}
            aria-current={page === key ? 'page' : undefined}
            style={{
              padding: '9px 13px',
              borderRadius: '999px',
              textDecoration: 'none',
              border: page === key ? '1px solid #fed7aa' : '1px solid rgba(254,215,170,.25)',
              background: page === key ? 'rgba(255,237,213,.14)' : 'rgba(67,20,7,.26)',
              color: '#fff7ed',
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
          <article key={card} style={{ padding: '18px', borderRadius: '16px', border: '1px solid rgba(254,215,170,.18)', background: 'rgba(67,20,7,.28)' }}>
            <span style={{ color: '#fff7ed', fontSize: '13px', fontWeight: 700 }}>{card}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
