export default function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`min-h-[100px] w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 ${className}`}
      {...props}
    />
  );
}

