import ProgressCard from './ProgressCard.jsx';
import TaskPlanner from './TaskPlanner.jsx';

const sections = [
  { id: 'trainer', title: 'Тренажёр', description: 'Карточки с вопросами и ответами по категориям.' },
  {
    id: 'review',
    title: 'Повторение',
    description: 'Карточки «Не знаю» и «Не уверен» для точечной проработки.',
  },
  { id: 'theory', title: 'Теория', description: 'Подробные материалы и шпаргалки из занятий.' },
  { id: 'schedule', title: 'Олимпиады', description: 'Расписание олимпиад и статусы регистрации.' },
];

export default function Dashboard({
  user,
  progress,
  totals,
  reviewSummary,
  tasks,
  onTaskCreate,
  onTaskStatusChange,
  onTaskDelete,
  onNavigate,
  onLogout,
}) {
  const totalCards = Object.values(totals).reduce((sum, count) => sum + count, 0);
  const masteredCards = Object.values(progress).reduce((sum, count) => sum + count, 0);
  const completion = totalCards === 0 ? 0 : Math.round((masteredCards / totalCards) * 100);
  const reviewTotal = reviewSummary?.total ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-900">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-16">
        <div className="absolute -top-32 right-12 hidden h-64 w-64 rounded-full bg-brand/40 blur-3xl lg:block" />
        <div className="absolute -bottom-32 left-6 h-72 w-72 rounded-full bg-indigo-500/30 blur-[120px]" />

        <header className="relative grid gap-10 rounded-[2.75rem] border border-white/10 bg-white/10 p-10 text-white backdrop-blur-xl shadow-[0_30px_90px_rgba(15,23,42,0.55)] lg:grid-cols-[1.2fr_0.85fr]">
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em]">
                Личный кабинет
              </span>
              <h1 className="text-4xl font-display font-semibold leading-tight sm:text-5xl">
                Добро пожаловать, {user.name}!
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-slate-200">
                Выберите модуль, отслеживайте прогресс и обновляйте личный план обучения по финансовой грамотности. Все ключевые материалы, олимпиадные активности и задачи находятся под рукой.
              </p>
            </div>

            <dl className="grid gap-4 text-sm text-slate-100 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 shadow-inner">
                <dt className="text-xs uppercase tracking-widest text-slate-300">Персональный код</dt>
                <dd className="mt-2 font-semibold">{user.code}</dd>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 shadow-inner">
                <dt className="text-xs uppercase tracking-widest text-slate-300">Общий прогресс</dt>
                <dd className="mt-2 font-semibold">{completion}% пройдено</dd>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 shadow-inner">
                <dt className="text-xs uppercase tracking-widest text-slate-300">На повторение</dt>
                <dd className="mt-2 font-semibold">{reviewTotal} карточек</dd>
              </div>
            </dl>

            <button
              onClick={onLogout}
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/20 px-5 py-2 text-sm font-medium text-slate-200 transition hover:border-white hover:text-white"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a2 2 0 012-2h5a2 2 0 012 2v1a1 1 0 102 0V4a4 4 0 00-4-4H5a4 4 0 00-4 4v12a4 4 0 004 4h5a4 4 0 004-4v-1a1 1 0 10-2 0v1a2 2 0 01-2 2H5a2 2 0 01-2-2V4z" />
                <path d="M12.293 7.293a1 1 0 011.414 0L16 9.586l2.293-2.293a1 1 0 111.414 1.414l-2.293 2.293 2.293 2.293a1 1 0 01-1.414 1.414L16 12.414l-2.293 2.293a1 1 0 01-1.414-1.414L14.586 11l-2.293-2.293a1 1 0 010-1.414z" />
              </svg>
              Выйти из кабинета
            </button>
          </div>

          <div className="flex flex-col justify-between gap-8 rounded-[2rem] bg-white/95 p-8 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Обзор прогресса</span>
              <div className="flex flex-col gap-2">
                <span className="text-5xl font-semibold text-slate-900">{completion}%</span>
                <p className="text-sm text-slate-600">
                  Освоено карточек: {masteredCards} из {totalCards}
                </p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => onNavigate(section.id)}
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white px-5 py-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-brand/70 hover:shadow-lg"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{section.title}</h3>
                    <p className="text-xs text-slate-500">{section.description}</p>
                  </div>
                  <svg className="h-4 w-4 text-brand transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </header>

        <section className="space-y-6">
          <div className="flex flex-col gap-2 text-white">
            <h2 className="text-2xl font-semibold">Категории обучения</h2>
            <p className="text-sm text-slate-200">Следите за прогрессом по направлениям и возвращайтесь к темам, которые требуют повторения.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(totals).map(([category, total]) => (
              <ProgressCard
                key={category}
                title={category}
                total={total}
                value={progress[category] ?? 0}
                reviewCount={reviewSummary?.byCategory?.[category] ?? 0}
              />
            ))}
          </div>
        </section>

        <section className="rounded-[2.5rem] border border-white/10 bg-white/10 p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.45)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Повторение карточек</h2>
              <p className="text-sm text-slate-200">
                Используйте отдельный трек, чтобы проработать карточки с отметками «Не знаю» и «Не уверен». После повторения обновите статусы.
              </p>
            </div>
            <button
              onClick={() => onNavigate('review')}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Перейти к повторению
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Всего карточек на повторение</p>
              <p className="mt-3 text-3xl font-semibold">{reviewTotal}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Не уверен</p>
              <p className="mt-3 text-2xl font-semibold">{reviewSummary?.byStatus?.unsure ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Не знаю</p>
              <p className="mt-3 text-2xl font-semibold">{reviewSummary?.byStatus?.dontknow ?? 0}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-xs">
            {Object.entries(reviewSummary?.byCategory ?? {}).length === 0 ? (
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-slate-200">
                Все категории закрыты без повторения — отличная работа!
              </span>
            ) : (
              Object.entries(reviewSummary.byCategory).map(([category, count]) => (
                <span
                  key={category}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-slate-100"
                >
                  <span className="h-2 w-2 rounded-full bg-brand-light" />
                  {category}: {count}
                </span>
              ))
            )}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className="group flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/10 px-6 py-8 text-left text-white shadow-[0_18px_40px_rgba(15,23,42,0.35)] transition hover:-translate-y-1 hover:border-white/40"
            >
              <div className="space-y-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">{section.description}</p>
                </div>
              </div>
              <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-light">
                Перейти
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                </svg>
              </span>
            </button>
          ))}
        </section>

        <TaskPlanner tasks={tasks} onCreate={onTaskCreate} onStatusChange={onTaskStatusChange} onDelete={onTaskDelete} />
      </div>
    </div>
  );
}
