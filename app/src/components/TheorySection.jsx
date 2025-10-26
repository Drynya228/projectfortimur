import { useState } from 'react';

export default function TheorySection({ items, onBack }) {
  const [expandedId, setExpandedId] = useState(items[0]?.id ?? null);

  const toggle = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 py-10 sm:py-16">
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
              Теория и шпаргалки
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl">
              Разбор ключевых тем. Кликните по карточке, чтобы раскрыть подробную памятку.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => {
            const isOpen = expandedId === item.id;
            return (
              <article
                key={item.id}
                className={`rounded-3xl border transition shadow-sm hover:shadow-lg ${
                  isOpen ? 'border-brand bg-white' : 'border-slate-200 bg-white/90'
                }`}
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full text-left px-6 py-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{item.summary}</p>
                    </div>
                    <span className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border text-brand ${isOpen ? 'rotate-45 border-brand bg-brand/10' : 'border-slate-200'}`}>
                      <span className="text-lg">+</span>
                    </span>
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-slate-700 leading-relaxed border-t border-slate-100">
                    {item.content}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
