import { useState } from 'react';

export default function LoginForm({ onSubmit, loading }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!code.trim()) {
      setError('Введите персональный код');
      return;
    }
    try {
      await onSubmit(code);
      setCode('');
    } catch (err) {
      setError(err.message || 'Не удалось авторизоваться');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-brand/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-[28rem] w-[28rem] rounded-full bg-brand-dark/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),transparent_55%),radial-gradient(circle_at_bottom,_rgba(148,163,184,0.18),transparent_60%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-4 py-16">
        <div className="grid gap-10 rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-xl shadow-[0_30px_80px_rgba(15,23,42,0.45)] lg:grid-cols-[1.2fr_1fr]">
          <section className="flex flex-col justify-between gap-10">
            <div className="space-y-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-100">
                Тимур Шафеев
              </span>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  Финансовая грамотность
                </h1>
                <p className="text-base leading-relaxed text-slate-200">
                  Личный кабинет с тренажёрами, теориями и расписанием занятий. Вход осуществляется по персональному коду, который можно использовать повторно.
                </p>
              </div>
              <dl className="grid gap-5 text-sm text-slate-200 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4 shadow-inner">
                  <dt className="text-xs uppercase tracking-widest text-slate-300">Модули</dt>
                  <dd className="mt-2 font-semibold text-white">Тренажёр · Теория · Расписание</dd>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4 shadow-inner">
                  <dt className="text-xs uppercase tracking-widest text-slate-300">Поддержка</dt>
                  <dd className="mt-2 font-semibold text-white">Помощь наставника в чате</dd>
                </div>
              </dl>
            </div>

            <p className="text-xs text-slate-400">
              Нужна помощь? Напишите в Telegram: <span className="font-medium text-white">@timur_fincoach</span>
            </p>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-2xl">
            <header className="space-y-3 text-center text-slate-900">
              <h2 className="text-2xl font-semibold">Вход по персональному коду</h2>
              <p className="text-sm text-slate-600">После авторизации вы сможете продолжить обучение с того места, где остановились.</p>
            </header>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="code" className="block text-sm font-medium text-slate-700">
                  Персональный код
                </label>
                <input
                  id="code"
                  type="text"
                  autoComplete="one-time-code"
                  placeholder="FG-XXXX-0000"
                  value={code}
                  onChange={(event) => setCode(event.target.value.toUpperCase())}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg tracking-[0.35em] text-center font-semibold text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-brand px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Проверяем код…' : 'Войти в кабинет'}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              Если кода нет, обратитесь к Тимуру Шафееву. Один код подходит для нескольких входов.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
