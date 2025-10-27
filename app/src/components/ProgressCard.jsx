export default function ProgressCard({ title, value, total, reviewCount = 0 }) {
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-brand/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand-dark">
            {percentage}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-gradient-to-r from-brand to-brand-light transition-all duration-500" style={{ width: `${percentage}%` }} />
        </div>
        <p className="text-sm text-slate-600">
          {value} из {total} карточек освоено
        </p>
        {reviewCount > 0 && (
          <p className="text-xs font-medium text-amber-600">
            На повторение: {reviewCount}
          </p>
        )}
      </div>
    </div>
  );
}
