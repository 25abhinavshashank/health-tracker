const EmptyState = ({ title, description }) => (
  <div className="rounded-[2rem] border border-dashed p-8 text-center" style={{ borderColor: 'var(--border)', background: 'var(--surface-soft)' }}>
    <h3 className="text-lg font-semibold text-main">{title}</h3>
    <p className="mt-2 text-sm text-muted">{description}</p>
  </div>
);

export default EmptyState;
