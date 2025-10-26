import { useMemo, useState } from 'react';

const STATUS_LABELS = {
  open: 'Открыта запись',
  waitlist: 'Лист ожидания',
  closed: 'Закрыто',
};

const STATUS_STYLES = {
  open: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  waitlist: 'bg-amber-100 text-amber-700 border-amber-200',
  closed: 'bg-slate-100 text-slate-500 border-slate-200',
};

export default function ScheduleTable({ items, onBack }) {
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((item) => item.status === filter);
  }, [items, filter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M12.707 15.707a1 1 0 01-1.414 0L6.586 11l4.707-4.707a1 1 0 10-1.414-1.414l-5.414 5.414a1 1 0 000 1.414l5.414 5.414a1 1 0 001.414 0z" />
              </svg>
              Назад в кабинет
            </button>
            <h2 className="mt-4 text-3xl font-display font-semibold text-slate-900">
              Расписание занятий
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl">
              Фильтруйте мероприятия по статусу, чтобы быстрее находить свободные места.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { id: 'all', label: 'Все' },
            { id: 'open', label: 'Открыта запись' },
            { id: 'waitlist', label: 'Лист ожидания' },
            { id: 'closed', label: 'Закрыто' },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition border ${
                filter === option.id
                  ? 'bg-brand text-white border-brand shadow'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-brand hover:text-brand'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50 text-sm uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Название</th>
                <th className="px-6 py-4 font-semibold">Статус</th>
                <th className="px-6 py-4 font-semibold">Дата</th>
                <th className="px-6 py-4 font-semibold">Начало</th>
                <th className="px-6 py-4 font-semibold">Окончание</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.title}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[item.status]}`}>
                      {STATUS_LABELS[item.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(item.date).toLocaleDateString('ru-RU', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">{item.start}</td>
                  <td className="px-6 py-4">{item.end}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    Подходящих занятий не найдено. Попробуйте другой фильтр.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
