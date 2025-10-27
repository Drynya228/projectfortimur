import { useEffect, useMemo, useState } from 'react';

const STATUS_CONFIG = {
  know: {
    label: 'Знаю хорошо',
    description: 'Карточка больше не появится в повторении.',
    accent: 'bg-emerald-500',
  },
  unsure: {
    label: 'Не уверен',
    description: 'Карточка попадёт в отдельный блок повторения.',
    accent: 'bg-amber-400',
  },
  dontknow: {
    label: 'Не знаю',
    description: 'Карточка отмечена как требующая изучения.',
    accent: 'bg-rose-500',
  },
};

export default function TrainingDeck({ cards, progress, onProgressChange, onBack }) {
  const categories = useMemo(
    () => Array.from(new Set(cards.map((card) => card.category))),
    [cards],
  );

  const [selectedCategory, setSelectedCategory] = useState(categories[0] ?? '');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const categoryCards = useMemo(
    () => cards.filter((card) => card.category === selectedCategory),
    [cards, selectedCategory],
  );

  const statuses = useMemo(() => progress.statuses ?? {}, [progress.statuses]);
  const knownSet = useMemo(
    () =>
      new Set(
        Object.entries(statuses)
          .filter(([, status]) => status === 'know')
          .map(([id]) => id),
      ),
    [statuses],
  );

  const reviewCounts = useMemo(() => {
    return categoryCards.reduce(
      (acc, card) => {
        const status = statuses[String(card.id)];
        if (status === 'unsure') acc.unsure += 1;
        if (status === 'dontknow') acc.dontknow += 1;
        return acc;
      },
      { unsure: 0, dontknow: 0 },
    );
  }, [categoryCards, statuses]);

  const knownCount = useMemo(
    () => categoryCards.filter((card) => knownSet.has(String(card.id))).length,
    [categoryCards, knownSet],
  );

  useEffect(() => {
    if (categories.length && !categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    const lastSeenIndex = progress.lastSeenIndex?.[selectedCategory] ?? 0;
    setCurrentIndex(Math.min(lastSeenIndex, Math.max(categoryCards.length - 1, 0)));
    setIsFlipped(false);
  }, [selectedCategory, categoryCards.length, progress.lastSeenIndex]);

  const handleSelection = (category) => {
    setSelectedCategory(category);
    setIsFlipped(false);
  };

  const handleAnswer = (status) => {
    if (!categoryCards.length) return;
    const card = categoryCards[currentIndex];
    const cardKey = String(card.id);
    const nextIndex = categoryCards.length === 0 ? 0 : (currentIndex + 1) % categoryCards.length;

    onProgressChange({
      statuses: {
        [cardKey]: status,
      },
      lastSeenIndex: {
        ...(progress.lastSeenIndex ?? {}),
        [selectedCategory]: nextIndex,
      },
    });

    setCurrentIndex(nextIndex);
    setIsFlipped(false);
  };

  const card = categoryCards[currentIndex];
  const total = categoryCards.length;
  const currentStatus = card ? statuses[String(card.id)] ?? null : null;

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
          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <h2 className="text-3xl font-display font-semibold text-slate-900">Тренажёр по финансовой грамотности</h2>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
                Переворачивайте карточки, чтобы увидеть ответы, и отмечайте свой уровень уверенности. Прогресс сохраняется автоматически.
              </p>
            </div>
            <div className="rounded-3xl border border-white/60 bg-white/80 px-5 py-3 text-sm text-slate-600 shadow-inner">
              Прогресс: {knownCount} / {total} карточек · На повторение: {reviewCounts.unsure + reviewCounts.dontknow}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleSelection(category)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition border ${
                  category === selectedCategory
                    ? 'border-transparent bg-brand text-white shadow-lg shadow-brand/25'
                    : 'border-slate-200 bg-white/80 text-slate-600 hover:border-brand/60 hover:text-brand'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="relative">
            <div
              className="flex h-[380px] cursor-pointer select-none flex-col justify-between gap-6 rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-2xl sm:h-[440px]"
              onClick={() => setIsFlipped((prev) => !prev)}
            >
              {card ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="uppercase text-xs tracking-[0.35em] text-brand font-semibold">
                        {isFlipped ? 'Ответ' : 'Вопрос'}
                      </span>
                      {currentStatus && STATUS_CONFIG[currentStatus] && (
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-600 bg-slate-100`}>
                          <span className={`h-2 w-2 rounded-full ${STATUS_CONFIG[currentStatus].accent}`} />
                          {STATUS_CONFIG[currentStatus].label}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">Нажмите, чтобы перевернуть</span>
                  </div>
                  <p className={`text-xl sm:text-2xl font-semibold leading-snug text-slate-900 ${isFlipped ? 'hidden' : 'block'}`}>
                    {card.question}
                  </p>
                  <p className={`text-lg sm:text-xl leading-relaxed text-slate-800 whitespace-pre-wrap ${isFlipped ? 'block' : 'hidden'}`}>
                    {card.answer}
                  </p>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Категория: {card.category}</span>
                    <span>
                      Карточка {currentIndex + 1} из {total}
                    </span>
                  </div>
                </>
              ) : (
                <div className="m-auto text-center text-slate-500">Карточки для выбранной категории пока не добавлены.</div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <h3 className="text-lg font-semibold text-slate-900">Как оцените карточку?</h3>
            <button
              onClick={() => handleAnswer('know')}
              className="w-full rounded-2xl bg-emerald-500 text-white font-semibold py-3 shadow-sm transition hover:bg-emerald-500/90 disabled:opacity-60"
              disabled={!card}
            >
              Знаю хорошо
            </button>
            <button
              onClick={() => handleAnswer('unsure')}
              className="w-full rounded-2xl bg-amber-400 text-slate-900 font-semibold py-3 shadow-sm transition hover:bg-amber-400/90 disabled:opacity-60"
              disabled={!card}
            >
              Не уверен, нужно повторить
            </button>
            <button
              onClick={() => handleAnswer('dontknow')}
              className="w-full rounded-2xl bg-rose-500 text-white font-semibold py-3 shadow-sm transition hover:bg-rose-500/90 disabled:opacity-60"
              disabled={!card}
            >
              Не знаю тему
            </button>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Карточек в категории: {total}
              <br />
              На повторение: {reviewCounts.unsure + reviewCounts.dontknow} ({reviewCounts.unsure} «не уверен» · {reviewCounts.dontknow} «не знаю»)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
