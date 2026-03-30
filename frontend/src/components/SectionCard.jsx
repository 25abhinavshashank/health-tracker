const SectionCard = ({ title, subtitle, action, children, className = '' }) => (
  <section
    className={`surface-card rounded-[2rem] p-6 ${className}`}
  >
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-main">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
    {children}
  </section>
);

export default SectionCard;
