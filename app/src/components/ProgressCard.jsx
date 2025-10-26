export default function ProgressCard({ title, value, total }) {
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-lg transition">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <span className="text-sm font-medium text-brand-dark bg-brand/10 rounded-full px-3 py-1">
          {percentage}%
        </span>
      </div>
      <div className="mt-4 h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-brand transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-slate-500">
        {value} из {total} карточек освоено
      </p>
    </div>
  );
}
