const StatCard = ({ label, value, hint }) => (
  <div className="surface-card rounded-[2rem] p-5">
    <p className="text-sm uppercase tracking-[0.2em] text-subtle">{label}</p>
    <p className="mt-3 text-3xl font-semibold text-main">{value}</p>
    <p className="mt-2 text-sm text-muted">{hint}</p>
  </div>
);

export default StatCard;
