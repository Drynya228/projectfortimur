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
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full bg-white/80 backdrop-blur rounded-3xl shadow-panel p-10 space-y-8 border border-white/40">
        <header className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-dark font-semibold">
            Тимур Шафеев
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-slate-900">
            Финансовая грамотность
          </h1>
          <p className="text-slate-600">
            Введите персональный код, чтобы открыть доступ к тренажёрам, теории и расписанию занятий.
          </p>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
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
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-lg tracking-[0.3em] font-semibold text-center text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand px-6 py-3 text-white text-lg font-semibold shadow-lg shadow-brand/30 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Проверяем код…' : 'Войти в кабинет'}
          </button>
        </form>

        <footer className="text-xs text-slate-500 text-center">
          Коды выдаёт наставник. Если возникли сложности, напишите Тимуру Шафееву.
        </footer>
      </div>
    </div>
  );
}
