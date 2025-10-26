import { createClient } from '@supabase/supabase-js';
import codes from '../data/codes.json';
import theory from '../data/theory.json';
import schedule from '../data/schedule.json';
import cards from '../data/cards.json';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const STORAGE_KEYS = {
  user: 'fg_user',
  progress: 'fg_progress',
  usedCodes: 'fg_used_codes',
};

const MOCK_LATENCY = 300;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const safeGetItem = (key) => {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn('localStorage getItem failed', error);
    return null;
  }
};

const safeSetItem = (key, value) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn('localStorage setItem failed', error);
  }
};

const safeRemoveItem = (key) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn('localStorage removeItem failed', error);
  }
};

const parseJson = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('JSON parse failed', error);
    return fallback;
  }
};

function getUsedCodes() {
  const raw = safeGetItem(STORAGE_KEYS.usedCodes);
  return parseJson(raw, []);
}

function rememberCode(code) {
  const current = new Set(getUsedCodes());
  current.add(code);
  safeSetItem(STORAGE_KEYS.usedCodes, JSON.stringify(Array.from(current)));
}

export async function signInWithCode(code) {
  const normalized = code.trim().toUpperCase();

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('access_codes')
        .select('id, code, owner_name, used, user_id')
        .eq('code', normalized)
        .maybeSingle();

      if (error) throw new Error('Ошибка проверки кода: ' + error.message);
      if (!data) throw new Error('Код не найден');
      if (data.used && data.user_id) throw new Error('Код уже активирован');

      const profilePayload = {
        name: data.owner_name ?? `Ученик ${normalized.slice(-4)}`,
        code: normalized,
      };

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert(profilePayload)
        .select()
        .single();

      if (profileError) throw new Error(profileError.message);

      const { error: updateError } = await supabase
        .from('access_codes')
        .update({ used: true, user_id: profile.id })
        .eq('id', data.id);

      if (updateError) throw new Error(updateError.message);

      const user = { id: profile.id, name: profile.name, code: normalized };
      safeSetItem(STORAGE_KEYS.user, JSON.stringify(user));
      return user;
    } catch (error) {
      console.warn('Не удалось выполнить вход через Supabase, пробуем офлайн-режим.', error);
    }
  }

  await wait(MOCK_LATENCY);
  const existing = codes.find((item) => item.code.toUpperCase() === normalized);
  if (!existing) throw new Error('Код не найден');
  if (getUsedCodes().includes(normalized)) {
    throw new Error('Код уже активирован');
  }

  const user = {
    id: normalized,
    name: existing.name,
    code: normalized,
  };

  rememberCode(normalized);
  safeSetItem(STORAGE_KEYS.user, JSON.stringify(user));
  return user;
}

export async function loadUser() {
  const raw = safeGetItem(STORAGE_KEYS.user);
  const stored = parseJson(raw, null);
  if (stored) return stored;

  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase.auth.getUser();
      return data?.user ?? null;
    } catch (error) {
      console.warn('Не удалось получить пользователя из Supabase.', error);
    }
  }
  return null;
}

export async function logout() {
  safeRemoveItem(STORAGE_KEYS.user);
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
}

export async function loadProgress(userId) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('progress')
        .select('data')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data?.data ?? {};
    } catch (error) {
      console.warn('Не удалось загрузить прогресс из Supabase, используем локальное хранилище.', error);
    }
  }

  const raw = safeGetItem(`${STORAGE_KEYS.progress}:${userId}`);
  return parseJson(raw, {});
}

export async function saveProgress(userId, payload) {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('progress')
        .upsert({ user_id: userId, data: payload });
      if (!error) {
        return;
      }
      throw new Error(error.message);
    } catch (error) {
      console.warn('Не удалось сохранить прогресс в Supabase, записываем локально.', error);
    }
  }

  safeSetItem(`${STORAGE_KEYS.progress}:${userId}`, JSON.stringify(payload));
}

async function withOfflineFallback(task, fallbackData, label) {
  if (!isSupabaseConfigured) {
    await wait(MOCK_LATENCY);
    return fallbackData;
  }

  try {
    const result = await task();
    if (!result) {
      console.warn(`Получены пустые данные из Supabase для ${label}, используем офлайн-версии.`);
      return fallbackData;
    }
    return result;
  } catch (error) {
    console.warn(`Ошибка при загрузке ${label} из Supabase, переключаемся на офлайн-режим.`, error);
    return fallbackData;
  }
}

export async function fetchTheory() {
  return withOfflineFallback(
    async () => {
      const { data, error } = await supabase.from('theory').select('*');
      if (error) throw new Error(error.message);
      return data ?? [];
    },
    theory,
    'теории',
  );
}

export async function fetchSchedule() {
  return withOfflineFallback(
    async () => {
      const { data, error } = await supabase
        .from('schedule')
        .select('*')
        .order('date');
      if (error) throw new Error(error.message);
      return data ?? [];
    },
    schedule,
    'расписания',
  );
}

export async function fetchCards() {
  return withOfflineFallback(
    async () => {
      const { data, error } = await supabase.from('training_cards').select('*');
      if (error) throw new Error(error.message);
      return data ?? [];
    },
    cards,
    'тренажёра',
  );
}
