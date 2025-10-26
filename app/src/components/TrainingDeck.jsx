import { useEffect, useMemo, useState } from 'react';

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

  const knownSet = useMemo(
    () => new Set(progress.knownCardIds ?? []),
    [progress.knownCardIds],
  );
  const knownCount = useMemo(
    () => categoryCards.filter((card) => knownSet.has(card.id)).length,
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

  const handleAnswer = (know) => {
    if (!categoryCards.length) return;
    const card = categoryCards[currentIndex];
    const updatedSet = new Set(knownSet);
    if (know) {
      updatedSet.add(card.id);
    } else {
      updatedSet.delete(card.id);
    }

    const nextIndex = categoryCards.length === 0 ? 0 : (currentIndex + 1) % categoryCards.length;

    onProgressChange({
      knownCardIds: Array.from(updatedSet),
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

  return (
    <div className="min-h-screen bg-slate-900/5 py-10 sm:py-14">
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
              Тренажёр по финансовой грамотности
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl">
              Переверните карточку, чтобы увидеть ответ. Отмечайте «Знаю» и «Нужно повторить», чтобы Тимур видел ваш прогресс.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 px-5 py-3 text-sm text-slate-600 shadow-sm">
            Прогресс: {knownCount} / {total} карточек
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleSelection(category)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition border ${
                category === selectedCategory
                  ? 'bg-brand text-white border-brand shadow'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-brand hover:text-brand'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="relative">
            <div
              className="h-[360px] sm:h-[420px] bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col gap-6 justify-between p-10 cursor-pointer select-none transition hover:shadow-2xl"
              onClick={() => setIsFlipped((prev) => !prev)}
            >
              {card ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="uppercase text-xs tracking-[0.35em] text-brand font-semibold">
                      {isFlipped ? 'Ответ' : 'Вопрос'}
                    </span>
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
                <div className="text-center text-slate-500 m-auto">
                  Карточки для выбранной категории пока не добавлены.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-slate-900">Как оцените карточку?</h3>
            <button
              onClick={() => handleAnswer(true)}
              className="w-full rounded-2xl bg-emerald-500/90 text-white font-semibold py-3 shadow-sm hover:bg-emerald-500 transition disabled:opacity-60"
              disabled={!card}
            >
              Знаю хорошо
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="w-full rounded-2xl bg-amber-400/80 text-slate-900 font-semibold py-3 shadow-sm hover:bg-amber-400 transition disabled:opacity-60"
              disabled={!card}
            >
              Нужно повторить
            </button>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm text-slate-600">
              Карточек в категории: {total}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
