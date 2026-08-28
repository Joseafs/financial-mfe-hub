export function RootComponent() {
  return (
    <section
      data-mfe="dashboard"
      style={{
        minHeight: '420px',
        borderRadius: '24px',
        padding: '32px',
        background: 'linear-gradient(135deg, #1d4ed8 0%, #0f172a 100%)',
        border: '1px solid #60a5fa',
        boxShadow: '0 24px 80px rgba(29, 78, 216, 0.22)',
      }}
    >
      <small style={{ letterSpacing: '0.16em', color: '#bfdbfe' }}>
        ARCHITECTURE STUB
      </small>
      <h1 style={{ margin: '12px 0 8px', fontSize: '42px' }}>Dashboard MFE</h1>
      <p style={{ maxWidth: '680px', color: '#dbeafe' }}>
        Bloco azul usado para provar lifecycle, roteamento, federation e deploy independente.
      </p>
      <dl style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', marginTop: '28px' }}>
        <dt>application</dt><dd>{__FMH_APP_NAME__}</dd>
        <dt>version</dt><dd>{__FMH_VERSION__}</dd>
        <dt>environment</dt><dd>{__FMH_ENV__}</dd>
      </dl>
    </section>
  );
}
