import { useEffect, useMemo, useState } from 'react';

const STATUS_CONFIG = {
  unsure: {
    label: 'Не уверен',
    accent: 'bg-amber-500',
    description: 'Вернитесь к карточке и уточните детали ответа.',
  },
  dontknow: {
    label: 'Не знаю',
    accent: 'bg-rose-500',
    description: 'Изучите теорию и попробуйте снова ответить на вопрос.',
  },
};

const statusOrder = ['unsure', 'dontknow'];

export default function ReviewDeck({ cards, statuses, onUpdateStatus, onBack }) {
  const reviewStatuses = useMemo(() => statuses ?? {}, [statuses]);

  const counts = useMemo(() => {
    return cards.reduce(
      (acc, card) => {
        const status = reviewStatuses[String(card.id)];
        if (status && STATUS_CONFIG[status]) {
          acc[status] = (acc[status] ?? 0) + 1;
          acc.total += 1;
        }
        return acc;
      },
      { total: 0, unsure: 0, dontknow: 0 },
    );
  }, [cards, reviewStatuses]);

  const initialStatus = useMemo(() => {
    for (const status of statusOrder) {
      if ((counts[status] ?? 0) > 0) {
        return status;
      }
    }
    return statusOrder[0];
  }, [counts]);

  const [activeStatus, setActiveStatus] = useState(initialStatus);
  const [activeIndex, setActiveIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setActiveStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    setActiveIndex(0);
    setFlipped(false);
  }, [activeStatus]);

  const filteredCards = useMemo(() => {
    return cards.filter((card) => reviewStatuses[String(card.id)] === activeStatus);
  }, [cards, reviewStatuses, activeStatus]);

  useEffect(() => {
    if (activeIndex >= filteredCards.length) {
      setActiveIndex(filteredCards.length ? filteredCards.length - 1 : 0);
      setFlipped(false);
    }
  }, [filteredCards, activeIndex]);

  const handleStatusChange = (cardId, nextStatus) => {
    onUpdateStatus(cardId, nextStatus);
    if (nextStatus === 'know') {
      const remaining = filteredCards.filter((card) => String(card.id) !== String(cardId));
      if (remaining.length === 0) {
        const nextStatusInOrder = statusOrder.find((status) => status !== activeStatus && (counts[status] ?? 0) > 0);
        if (nextStatusInOrder) {
          setActiveStatus(nextStatusInOrder);
        }
      }
    }
  };

  const currentCard = filteredCards[activeIndex];

  const summaryBadges = statusOrder.map((status) => (
    <button
      key={status}
      onClick={() => setActiveStatus(status)}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
        activeStatus === status
          ? 'border-transparent bg-slate-900 text-white shadow-lg shadow-slate-900/30'
          : 'border-slate-300 bg-white/70 text-slate-600 hover:border-slate-400'
      }`}
    >
      <span className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${STATUS_CONFIG[status].accent}`} />
        {STATUS_CONFIG[status].label}
        <span className="rounded-full bg-slate-100 px-2 text-xs font-semibold text-slate-500">{counts[status] ?? 0}</span>
      </span>
    </button>
  ));

  return (
    <div className="min-h-screen bg-slate-900/5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
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
              <h2 className="text-3xl font-display font-semibold text-slate-900">Карточки на повторение</h2>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
                Работайте с карточками, помеченными как «Не знаю» или «Не уверен». Отмечайте новые статусы, когда почувствуете уверенность.
              </p>
            </div>
            <div className="rounded-3xl border border-white/60 bg-white/80 px-5 py-3 text-sm text-slate-600 shadow-inner">
              Всего: {counts.total} карточек
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">{summaryBadges}</div>
        </header>

        {counts.total === 0 ? (
          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-12 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <h3 className="text-2xl font-semibold text-slate-900">Отлично! Повторение не требуется.</h3>
            <p className="mt-3 text-sm text-slate-600">
              Отметьте новые карточки как «Не уверен» или «Не знаю» в тренажёре, чтобы они появились здесь.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2 text-sm font-medium text-brand">
              <span className="h-2 w-2 rounded-full bg-brand" />
              Тренируйтесь дальше!
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="relative">
              <div
                className="flex h-[380px] cursor-pointer select-none flex-col justify-between gap-6 rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-2xl sm:h-[440px]"
                onClick={() => setFlipped((prev) => !prev)}
              >
                {currentCard ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        <span className={`inline-flex h-2.5 w-2.5 rounded-full ${STATUS_CONFIG[activeStatus].accent}`} />
                        {STATUS_CONFIG[activeStatus].label}
                      </div>
                      <span className="text-xs text-slate-400">Нажмите, чтобы перевернуть</span>
                    </div>
                    <p className={`text-xl sm:text-2xl font-semibold leading-snug text-slate-900 ${flipped ? 'hidden' : 'block'}`}>
                      {currentCard.question}
                    </p>
                    <p className={`text-lg sm:text-xl leading-relaxed text-slate-800 whitespace-pre-wrap ${flipped ? 'block' : 'hidden'}`}>
                      {currentCard.answer}
                    </p>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>Категория: {currentCard.category}</span>
                      <span>
                        Карточка {activeIndex + 1} из {filteredCards.length}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="m-auto text-center text-slate-500">
                    В выбранной группе пока нет карточек. Попробуйте другую вкладку.
                  </div>
                )}
              </div>
            </div>

            <aside className="flex flex-col gap-4 rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <h3 className="text-lg font-semibold text-slate-900">Обновите статус</h3>
              <p className="text-sm text-slate-600">После повторения отметьте результат, чтобы карточка исчезла из этого списка.</p>
              <button
                onClick={() => currentCard && handleStatusChange(currentCard.id, 'know')}
                className="w-full rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500/90 disabled:opacity-60"
                disabled={!currentCard}
              >
                Освоил тему
              </button>
              <button
                onClick={() => currentCard && handleStatusChange(currentCard.id, 'unsure')}
                className="w-full rounded-2xl bg-amber-400 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-amber-400/90 disabled:opacity-60"
                disabled={!currentCard}
              >
                Ещё не уверен
              </button>
              <button
                onClick={() => currentCard && handleStatusChange(currentCard.id, 'dontknow')}
                className="w-full rounded-2xl bg-rose-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500/90 disabled:opacity-60"
                disabled={!currentCard}
              >
                Пока не знаю
              </button>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                {currentCard ? STATUS_CONFIG[activeStatus].description : 'Выберите группу карточек, чтобы начать повторение.'}
              </div>
              <div className="mt-auto space-y-2 text-xs text-slate-500">
                <p>В группе: {filteredCards.length} карточек.</p>
                <div className="flex flex-wrap gap-2">
                  {filteredCards.map((card, index) => (
                    <button
                      key={card.id}
                      onClick={() => {
                        setActiveIndex(index);
                        setFlipped(false);
                      }}
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                        index === activeIndex
                          ? 'bg-brand text-white shadow'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
