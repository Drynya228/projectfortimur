import { useMemo, useState } from 'react';

const STATUS_FLOW = ['todo', 'in_progress', 'done'];

const STATUS_CONFIG = {
  todo: {
    label: 'К началу',
    badge: 'bg-slate-100 text-slate-600',
    card: 'border-slate-200',
  },
  in_progress: {
    label: 'В работе',
    badge: 'bg-amber-100 text-amber-700',
    card: 'border-amber-200',
  },
  done: {
    label: 'Готово',
    badge: 'bg-emerald-100 text-emerald-700',
    card: 'border-emerald-200',
  },
};

const NEXT_STATUS_LABEL = {
  todo: 'В работу',
  in_progress: 'Завершить',
};

const columns = [
  { id: 'todo', title: 'Запланировано' },
  { id: 'in_progress', title: 'В процессе' },
  { id: 'done', title: 'Завершено' },
];

export default function TaskPlanner({ tasks, onCreate, onStatusChange, onDelete }) {
  const safeTasks = useMemo(() => (Array.isArray(tasks) ? tasks : []), [tasks]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Общее');
  const [status, setStatus] = useState('todo');
  const [error, setError] = useState('');

  const grouped = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      tasks: safeTasks.filter((task) => (task.status ?? 'todo') === column.id),
    }));
  }, [safeTasks]);

  const stats = useMemo(() => {
    return STATUS_FLOW.reduce(
      (acc, key) => ({
        ...acc,
        [key]: safeTasks.filter((task) => (task.status ?? 'todo') === key).length,
      }),
      {},
    );
  }, [safeTasks]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Добавьте название задачи');
      return;
    }

    try {
      await onCreate({
        title: title.trim(),
        category,
        status,
      });
      setTitle('');
      setCategory('Общее');
      setStatus('todo');
    } catch (err) {
      setError(err.message ?? 'Не удалось сохранить задачу');
    }
  };

  const renderActions = (task) => {
    const currentIndex = STATUS_FLOW.indexOf(task.status ?? 'todo');
    const nextIndex = Math.min(currentIndex + 1, STATUS_FLOW.length - 1);
    const nextStatus = STATUS_FLOW[nextIndex];
    const actionLabel = NEXT_STATUS_LABEL[task.status ?? 'todo'] ?? 'Продвинуть';

    return (
      <div className="flex flex-wrap items-center gap-2 pt-3 text-xs font-medium text-slate-500">
        {task.status !== 'done' ? (
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg bg-brand/10 px-3 py-1 text-brand transition hover:bg-brand/20"
            onClick={() => onStatusChange(task.id, nextStatus)}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 10l-3.293-3.293a1 1 0 010-1.414z" />
            </svg>
            {actionLabel}
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1 text-slate-500 transition hover:border-brand/60 hover:text-brand"
            onClick={() => onStatusChange(task.id, 'todo')}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
            </svg>
            В начало
          </button>
        )}
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg border border-transparent px-3 py-1 text-rose-500 transition hover:border-rose-200 hover:bg-rose-50"
          onClick={() => onDelete(task.id)}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.366-.446.915-.707 1.493-.707h.5c.578 0 1.127.26 1.493.707l.447.546H15a1 1 0 110 2h-.167l-.623 9.35A2 2 0 0112.218 17h-4.436a2 2 0 01-1.992-1.995L5.167 5.645H5a1 1 0 110-2h2.81l.447-.546zM7.172 5.645l.547 8.2a1 1 0 00.999.93h2.564a1 1 0 00.999-.93l.547-8.2H7.172z" clipRule="evenodd" />
          </svg>
          Удалить
        </button>
      </div>
    );
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-slate-900">Мои задачи</h2>
        <p className="text-sm text-slate-600">
          Планируйте обучение по финансовой грамотности: фиксируйте ключевые шаги, следите за статусами и отмечайте завершение модулей.
        </p>
      </div>

      <div className="grid gap-4 rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:grid-cols-4">
        {columns.map((column) => (
          <div key={column.id} className="rounded-2xl bg-slate-50/70 p-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{column.title}</span>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{stats[column.id] ?? 0}</p>
            <p className="mt-1 text-xs text-slate-500">{STATUS_CONFIG[column.id].label}</p>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-[1.75rem] border border-slate-200/80 bg-gradient-to-r from-blue-50 via-white to-purple-50 p-6 shadow-sm md:grid-cols-[2fr_1fr_1fr_auto]"
      >
        <div className="md:col-span-1">
          <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">Название</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Например, разобрать тему инвестиций"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">Категория</label>
          <input
            type="text"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">Статус</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option value="todo">Запланировано</option>
            <option value="in_progress">В процессе</option>
            <option value="done">Завершено</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark"
          >
            Добавить задачу
          </button>
        </div>
        {error && (
          <div className="md:col-span-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-600">{error}</div>
        )}
      </form>

      <div className="grid gap-6 lg:grid-cols-3">
        {grouped.map((column) => (
          <div key={column.id} className="flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{column.title}</h3>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CONFIG[column.id].badge}`}>
                {STATUS_CONFIG[column.id].label}
              </span>
            </div>
            <div className="space-y-4">
              {column.tasks.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center text-xs text-slate-500">
                  Нет задач в этом статусе — добавьте новую цель или перенесите существующую.
                </p>
              ) : (
                column.tasks.map((task) => (
                  <article
                    key={task.id}
                    className={`rounded-2xl border bg-white px-5 py-4 shadow-sm transition hover:shadow-lg ${STATUS_CONFIG[column.id].card}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-slate-900">{task.title}</h4>
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                        {task.category}
                      </span>
                    </div>
                    {task.due_date && (
                      <p className="mt-2 text-xs text-slate-500">Срок: {new Date(task.due_date).toLocaleDateString('ru-RU')}</p>
                    )}
                    {renderActions(task)}
                  </article>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
