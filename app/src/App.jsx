import { useEffect, useMemo, useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import LoginForm from './components/LoginForm.jsx';
import ReviewDeck from './components/ReviewDeck.jsx';
import ScheduleTable from './components/ScheduleTable.jsx';
import TheorySection from './components/TheorySection.jsx';
import TrainingDeck from './components/TrainingDeck.jsx';
import {
  fetchCards,
  fetchSchedule,
  fetchTheory,
  fetchTasks,
  loadProgress,
  loadUser,
  logout,
  saveProgress,
  createTask,
  updateTaskStatus,
  deleteTask,
  signInWithCode,
} from './services/supabaseClient.js';

const INITIAL_PROGRESS = {
  statuses: {},
  lastSeenIndex: {},
};

const normalizeProgress = (raw) => {
  if (!raw || typeof raw !== 'object') {
    return { ...INITIAL_PROGRESS };
  }

  const statuses = {};
  if (raw.statuses && typeof raw.statuses === 'object') {
    for (const [key, value] of Object.entries(raw.statuses)) {
      if (typeof value === 'string') {
        statuses[String(key)] = value;
      }
    }
  }

  if (Array.isArray(raw.knownCardIds)) {
    for (const id of raw.knownCardIds) {
      statuses[String(id)] = 'know';
    }
  }

  if (Array.isArray(raw.reviewCardIds)) {
    for (const id of raw.reviewCardIds) {
      const key = String(id);
      if (statuses[key] !== 'know') {
        statuses[key] = raw.reviewStatuses?.[key] ?? 'unsure';
      }
    }
  }

  if (Array.isArray(raw.flaggedCardIds)) {
    for (const id of raw.flaggedCardIds) {
      const key = String(id);
      if (statuses[key] !== 'know') {
        statuses[key] = 'unsure';
      }
    }
  }

  return {
    statuses,
    lastSeenIndex: raw.lastSeenIndex && typeof raw.lastSeenIndex === 'object' ? raw.lastSeenIndex : {},
  };
};

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [authLoading, setAuthLoading] = useState(false);
  const [initialising, setInitialising] = useState(true);
  const [progress, setProgress] = useState(INITIAL_PROGRESS);
  const [cards, setCards] = useState([]);
  const [theoryItems, setTheoryItems] = useState([]);
  const [scheduleItems, setScheduleItems] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [globalError, setGlobalError] = useState('');

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [existingUser, cardsData, theoryData, scheduleData] = await Promise.all([
          loadUser(),
          fetchCards(),
          fetchTheory(),
          fetchSchedule(),
        ]);

        setCards(cardsData);
        setTheoryItems(theoryData);
        setScheduleItems(scheduleData);

        if (existingUser) {
          setUser(existingUser);
          const storedProgress = await loadProgress(existingUser.id);
          setProgress(normalizeProgress(storedProgress));
          const storedTasks = await fetchTasks(existingUser.id);
          setTasks(storedTasks ?? []);
        }
      } catch (error) {
        console.error(error);
        setGlobalError('Не удалось загрузить данные. Обновите страницу и попробуйте снова.');
      } finally {
        setInitialising(false);
      }
    };

    bootstrap();
  }, []);

  const handleLogin = async (code) => {
    setAuthLoading(true);
    try {
      const signedUser = await signInWithCode(code);
      setUser(signedUser);
      const storedProgress = await loadProgress(signedUser.id);
      setProgress(normalizeProgress(storedProgress));
      const storedTasks = await fetchTasks(signedUser.id);
      setTasks(storedTasks ?? []);
      setView('dashboard');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setProgress({ ...INITIAL_PROGRESS });
    setTasks([]);
    setView('dashboard');
  };

  const handleProgressChange = (partial) => {
    setProgress((prev) => {
      const incomingStatuses = partial.statuses && typeof partial.statuses === 'object' ? partial.statuses : {};
      const sanitizedStatuses = Object.fromEntries(
        Object.entries(incomingStatuses).map(([key, value]) => [String(key), value]),
      );

      const mergedStatuses = {
        ...(prev.statuses ?? {}),
        ...sanitizedStatuses,
      };

      const incomingLastSeen =
        partial.lastSeenIndex && typeof partial.lastSeenIndex === 'object' ? partial.lastSeenIndex : {};

      const merged = {
        statuses: mergedStatuses,
        lastSeenIndex: {
          ...(prev.lastSeenIndex ?? {}),
          ...incomingLastSeen,
        },
      };

      if (user) {
        const knownCardIds = Object.entries(mergedStatuses)
          .filter(([, status]) => status === 'know')
          .map(([id]) => id);
        const reviewCardIds = Object.entries(mergedStatuses)
          .filter(([, status]) => status !== 'know')
          .map(([id]) => id);
        const payload = {
          ...merged,
          knownCardIds,
          reviewCardIds,
          reviewStatuses: mergedStatuses,
        };

        saveProgress(user.id, payload).catch((error) => {
          console.warn('Не удалось сохранить прогресс', error);
        });
      }

      return merged;
    });
  };

  const handleCardStatusChange = (cardId, status) => {
    handleProgressChange({
      statuses: {
        [String(cardId)]: status,
      },
    });
  };

  const handleTaskCreate = async (payload) => {
    if (!user) return;
    const created = await createTask(user.id, payload);
    setTasks((prev) => [...prev, created]);
  };

  const handleTaskStatusChange = async (taskId, nextStatus) => {
    if (!user) return;
    const updated = await updateTaskStatus(user.id, taskId, nextStatus);
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: updated?.status ?? nextStatus,
            }
          : task,
      ),
    );
  };

  const handleTaskDelete = async (taskId) => {
    if (!user) return;
    await deleteTask(user.id, taskId);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const totalsByCategory = useMemo(() => {
    return cards.reduce((acc, card) => {
      acc[card.category] = (acc[card.category] ?? 0) + 1;
      return acc;
    }, {});
  }, [cards]);

  const progressByCategory = useMemo(() => {
    const statuses = progress.statuses ?? {};
    const knownSet = new Set(
      Object.entries(statuses)
        .filter(([, status]) => status === 'know')
        .map(([id]) => id),
    );
    return Object.fromEntries(
      Object.entries(totalsByCategory).map(([category, total]) => {
        const learned = cards
          .filter((card) => card.category === category)
          .filter((card) => knownSet.has(String(card.id))).length;
        return [category, Math.min(learned, total)];
      }),
    );
  }, [cards, progress.statuses, totalsByCategory]);

  const reviewSummary = useMemo(() => {
    const statuses = progress.statuses ?? {};
    return cards.reduce(
      (acc, card) => {
        const key = String(card.id);
        const status = statuses[key];
        if (status && status !== 'know') {
          acc.total += 1;
          acc.byStatus[status] = (acc.byStatus[status] ?? 0) + 1;
          acc.byCategory[card.category] = (acc.byCategory[card.category] ?? 0) + 1;
          if (!acc.cardIds.includes(key)) {
            acc.cardIds.push(key);
          }
        }
        return acc;
      },
      { total: 0, byStatus: { unsure: 0, dontknow: 0 }, byCategory: {}, cardIds: [] },
    );
  }, [cards, progress.statuses]);

  const reviewCards = useMemo(() => {
    const statuses = progress.statuses ?? {};
    return cards.filter((card) => {
      const status = statuses[String(card.id)];
      return status && status !== 'know';
    });
  }, [cards, progress.statuses]);

  if (initialising) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <svg className="h-8 w-8 animate-spin text-brand" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p>Загружаем площадку…</p>
        </div>
      </div>
    );
  }

  if (globalError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-rose-50 px-6 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-semibold text-rose-700">Возникла ошибка</h1>
          <p className="text-sm text-rose-600">{globalError}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-brand px-5 py-3 text-white font-semibold shadow hover:bg-brand-dark"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onSubmit={handleLogin} loading={authLoading} />;
  }

  if (view === 'trainer') {
    return (
      <TrainingDeck
        cards={cards}
        progress={progress}
        onProgressChange={handleProgressChange}
        onBack={() => setView('dashboard')}
      />
    );
  }

  if (view === 'review') {
    return (
      <ReviewDeck
        cards={reviewCards}
        statuses={progress.statuses ?? {}}
        onUpdateStatus={handleCardStatusChange}
        onBack={() => setView('dashboard')}
      />
    );
  }

  if (view === 'theory') {
    return <TheorySection items={theoryItems} onBack={() => setView('dashboard')} />;
  }

  if (view === 'schedule') {
    return <ScheduleTable items={scheduleItems} onBack={() => setView('dashboard')} />;
  }

  return (
    <Dashboard
      user={user}
      progress={progressByCategory}
      totals={totalsByCategory}
      reviewSummary={reviewSummary}
      onNavigate={setView}
      onLogout={handleLogout}
      tasks={tasks}
      onTaskCreate={handleTaskCreate}
      onTaskStatusChange={handleTaskStatusChange}
      onTaskDelete={handleTaskDelete}
    />
  );
}
