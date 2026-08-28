export function RootComponent() {
  return (
    <section
      data-mfe="payments"
      style={{
        minHeight: '420px',
        borderRadius: '24px',
        padding: '32px',
        background: 'linear-gradient(135deg, #7c3aed 0%, #2e1065 100%)',
        border: '1px solid #a78bfa',
        boxShadow: '0 24px 80px rgba(124, 58, 237, 0.22)',
      }}
    >
      <small style={{ letterSpacing: '0.16em', color: '#ddd6fe' }}>ARCHITECTURE STUB</small>
      <h1 style={{ margin: '12px 0 8px', fontSize: '42px' }}>Payments MFE</h1>
      <p style={{ maxWidth: '680px', color: '#ede9fe' }}>
        Bloco roxo usado para validar independência de deploy sem implementar pagamentos reais.
      </p>
      <dl style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', marginTop: '28px' }}>
        <dt>application</dt><dd>{__FMH_APP_NAME__}</dd>
        <dt>version</dt><dd>{__FMH_VERSION__}</dd>
        <dt>environment</dt><dd>{__FMH_ENV__}</dd>
      </dl>
    </section>
  );
}
