import ProgressCard from './ProgressCard.jsx';

const sections = [
  { id: 'trainer', title: 'Тренажёр', description: 'Карточки с вопросами и ответами по категориям.' },
  { id: 'theory', title: 'Теория', description: 'Подробные материалы и шпаргалки из занятий.' },
  { id: 'schedule', title: 'Расписание', description: 'Актуальные занятия и статусы регистрации.' },
];

export default function Dashboard({ user, progress, totals, onNavigate, onLogout }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-16 space-y-12">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between bg-white/80 border border-white/60 backdrop-blur rounded-3xl px-8 py-6 shadow-panel">
          <div className="space-y-2">
            <p className="text-sm text-brand-dark uppercase tracking-[0.35em] font-semibold">
              Личный кабинет ученика
            </p>
            <h1 className="text-3xl font-display font-semibold text-slate-900">
              Привет, {user.name}!
            </h1>
            <p className="text-slate-600 max-w-xl">
              Следите за прогрессом по направлениям финансовой грамотности и переходите к материалам в одно касание.
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Код доступа: <span className="text-brand-dark">{user.code}</span>
            </span>
            <button
              onClick={onLogout}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-brand hover:text-brand transition"
            >
              Выйти
            </button>
          </div>
        </header>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Прогресс по направлениям</h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(totals).map(([category, total]) => (
              <ProgressCard
                key={category}
                title={category}
                total={total}
                value={progress[category] ?? 0}
              />
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className="group rounded-3xl bg-white/90 border border-slate-100 px-6 py-8 text-left shadow-sm hover:shadow-lg transition flex flex-col gap-4"
            >
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {section.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {section.description}
                </p>
              </div>
              <span className="mt-auto inline-flex items-center gap-2 text-brand font-semibold">
                Открыть
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12.293 4.293a1 1 0 011.414 1.414L10.414 9H17a1 1 0 110 2h-6.586l3.293 3.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5z" />
                </svg>
              </span>
            </button>
          ))}
        </section>
      </div>
    </div>
  );
}
