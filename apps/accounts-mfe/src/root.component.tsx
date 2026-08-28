export function RootComponent() {
  return (
    <section
      data-mfe="accounts"
      style={{
        minHeight: '420px',
        borderRadius: '24px',
        padding: '32px',
        background: 'linear-gradient(135deg, #15803d 0%, #052e16 100%)',
        border: '1px solid #4ade80',
        boxShadow: '0 24px 80px rgba(21, 128, 61, 0.22)',
      }}
    >
      <small style={{ letterSpacing: '0.16em', color: '#bbf7d0' }}>ARCHITECTURE STUB</small>
      <h1 style={{ margin: '12px 0 8px', fontSize: '42px' }}>Accounts MFE</h1>
      <p style={{ maxWidth: '680px', color: '#dcfce7' }}>
        Bloco verde usado para provar um segundo remote independente no mesmo Shell.
      </p>
      <dl style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', marginTop: '28px' }}>
        <dt>application</dt><dd>{__FMH_APP_NAME__}</dd>
        <dt>version</dt><dd>{__FMH_VERSION__}</dd>
        <dt>environment</dt><dd>{__FMH_ENV__}</dd>
      </dl>
    </section>
  );
}
