import ProgressCard from './ProgressCard.jsx';

const sections = [
  { id: 'trainer', title: 'Тренажёр', description: 'Карточки с вопросами и ответами по категориям.' },
  { id: 'theory', title: 'Теория', description: 'Подробные материалы и шпаргалки из занятий.' },
  { id: 'schedule', title: 'Расписание', description: 'Актуальные занятия и статусы регистрации.' },
];

export default function Dashboard({ user, progress, totals, onNavigate, onLogout }) {
  const totalCards = Object.values(totals).reduce((sum, count) => sum + count, 0);
  const masteredCards = Object.values(progress).reduce((sum, count) => sum + count, 0);
  const completion = totalCards === 0 ? 0 : Math.round((masteredCards / totalCards) * 100);

  return (
    <div className="min-h-screen bg-slate-900/5">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12">
        <header className="grid gap-8 rounded-[2.5rem] border border-slate-200/60 bg-gradient-to-br from-white via-slate-50 to-blue-50 p-10 shadow-[0_24px_60px_rgba(15,23,42,0.12)] lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-brand-dark">
                Личный кабинет
              </span>
              <h1 className="text-4xl font-display font-semibold leading-tight text-slate-900">
                Привет, {user.name}!
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-slate-600">
                Управляйте своим обучением: отслеживайте прогресс по финансовым направлениям, изучайте теорию и закрепляйте знания на тренажёрах.
              </p>
            </div>

            <dl className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white/80 px-5 py-4 shadow-inner">
                <dt className="text-xs uppercase tracking-widest text-slate-400">Персональный код</dt>
                <dd className="mt-2 font-semibold text-slate-900">{user.code}</dd>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white/80 px-5 py-4 shadow-inner">
                <dt className="text-xs uppercase tracking-widest text-slate-400">Общий прогресс</dt>
                <dd className="mt-2 font-semibold text-slate-900">{completion}% пройдено</dd>
              </div>
            </dl>

            <button
              onClick={onLogout}
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-300/70 px-5 py-2 text-sm font-medium text-slate-600 transition hover:border-brand hover:text-brand"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a2 2 0 012-2h5a2 2 0 012 2v1a1 1 0 102 0V4a4 4 0 00-4-4H5a4 4 0 00-4 4v12a4 4 0 004 4h5a4 4 0 004-4v-1a1 1 0 10-2 0v1a2 2 0 01-2 2H5a2 2 0 01-2-2V4z" />
                <path d="M12.293 7.293a1 1 0 011.414 0L16 9.586l2.293-2.293a1 1 0 111.414 1.414l-2.293 2.293 2.293 2.293a1 1 0 01-1.414 1.414L16 12.414l-2.293 2.293a1 1 0 01-1.414-1.414L14.586 11l-2.293-2.293a1 1 0 010-1.414z" />
              </svg>
              Выйти из кабинета
            </button>
          </div>

          <div className="flex flex-col justify-between gap-8 rounded-[2rem] bg-white/90 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Обзор прогресса</span>
              <div className="flex flex-col gap-2">
                <span className="text-5xl font-semibold text-slate-900">{completion}%</span>
                <p className="text-sm text-slate-600">
                  Освоено карточек: {masteredCards} из {totalCards}
                </p>
              </div>
            </div>
            <div className="grid gap-3">
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
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-slate-900">Категории обучения</h2>
            <p className="text-sm text-slate-600">Отслеживайте прогресс по каждому направлению и возвращайтесь к темам, которые требуют повторения.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(totals).map(([category, total]) => (
              <ProgressCard key={category} title={category} total={total} value={progress[category] ?? 0} />
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className="group flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white px-6 py-8 text-left shadow-sm transition hover:-translate-y-1 hover:border-brand/60 hover:shadow-xl"
            >
              <div className="space-y-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{section.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{section.description}</p>
                </div>
              </div>
              <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand">
                Перейти
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                </svg>
              </span>
            </button>
          ))}
        </section>
      </div>
    </div>
  );
}
