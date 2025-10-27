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
    <div className="min-h-screen bg-slate-900/5 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4">
        <header className="rounded-[2.5rem] border border-slate-200/60 bg-gradient-to-br from-white via-slate-50 to-blue-50 p-10 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-brand-dark"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M12.707 15.707a1 1 0 01-1.414 0L6.586 11l4.707-4.707a1 1 0 10-1.414-1.414l-5.414 5.414a1 1 0 000 1.414l5.414 5.414a1 1 0 001.414 0z" />
            </svg>
            Назад в кабинет
          </button>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <h2 className="text-3xl font-display font-semibold text-slate-900">Расписание олимпиад</h2>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
                Следите за ключевыми олимпиадами по финансовой грамотности: статусы регистрации, формат проведения и дедлайны подачи заявок.
              </p>
            </div>
            <div className="rounded-3xl border border-white/60 bg-white/80 px-5 py-3 text-sm text-slate-600 shadow-inner">
              {filtered.length} из {items.length} мероприятий
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
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
                    ? 'border-transparent bg-brand text-white shadow-lg shadow-brand/25'
                    : 'border-slate-200 bg-white/80 text-slate-600 hover:border-brand/60 hover:text-brand'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </header>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Название</th>
                <th className="px-6 py-4 font-semibold">Статус</th>
                <th className="px-6 py-4 font-semibold">Дата</th>
                <th className="px-6 py-4 font-semibold">Начало</th>
                <th className="px-6 py-4 font-semibold">Окончание</th>
                <th className="px-6 py-4 font-semibold">Формат</th>
                <th className="px-6 py-4 font-semibold">Направление</th>
                <th className="px-6 py-4 font-semibold">Регистрация до</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filtered.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50/80">
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
                  <td className="px-6 py-4 text-slate-600">{item.format ?? '—'}</td>
                  <td className="px-6 py-4 text-slate-600">{item.direction ?? '—'}</td>
                  <td className="px-6 py-4 text-slate-600">{item.registration ?? '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                    Подходящих олимпиад не найдено. Попробуйте другой фильтр.
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
