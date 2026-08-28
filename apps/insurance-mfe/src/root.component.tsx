export function RootComponent() {
  return (
    <section
      data-mfe="insurance"
      style={{
        minHeight: '420px',
        borderRadius: '24px',
        padding: '32px',
        background: 'linear-gradient(135deg, #c2410c 0%, #431407 100%)',
        border: '1px solid #fb923c',
        boxShadow: '0 24px 80px rgba(194, 65, 12, 0.22)',
      }}
    >
      <small style={{ letterSpacing: '0.16em', color: '#fed7aa' }}>ARCHITECTURE STUB</small>
      <h1 style={{ margin: '12px 0 8px', fontSize: '42px' }}>Insurance MFE</h1>
      <p style={{ maxWidth: '680px', color: '#ffedd5' }}>
        Bloco laranja usado para validar o quarto remote antes de qualquer simulação de seguro.
      </p>
      <dl style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', marginTop: '28px' }}>
        <dt>application</dt><dd>{__FMH_APP_NAME__}</dd>
        <dt>version</dt><dd>{__FMH_VERSION__}</dd>
        <dt>environment</dt><dd>{__FMH_ENV__}</dd>
      </dl>
    </section>
  );
}
