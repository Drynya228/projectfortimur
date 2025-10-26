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

function getUsedCodes() {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STORAGE_KEYS.usedCodes);
  return raw ? JSON.parse(raw) : [];
}

function rememberCode(code) {
  if (typeof window === 'undefined') return;
  const current = new Set(getUsedCodes());
  current.add(code);
  window.localStorage.setItem(
    STORAGE_KEYS.usedCodes,
    JSON.stringify(Array.from(current)),
  );
}

export async function signInWithCode(code) {
  if (isSupabaseConfigured) {
    const normalized = code.trim().toUpperCase();
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
    window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    return user;
  }

  await wait(MOCK_LATENCY);
  const normalized = code.trim().toUpperCase();
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
  window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  return user;
}

export async function loadUser() {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEYS.user);
  if (raw) return JSON.parse(raw);

  if (isSupabaseConfigured) {
    const { data } = await supabase.auth.getUser();
    return data?.user ?? null;
  }
  return null;
}

export async function logout() {
  window.localStorage.removeItem(STORAGE_KEYS.user);
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
}

export async function loadProgress(userId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('progress')
      .select('data')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data?.data ?? {};
  }

  if (typeof window === 'undefined') return {};
  const raw = window.localStorage.getItem(`${STORAGE_KEYS.progress}:${userId}`);
  return raw ? JSON.parse(raw) : {};
}

export async function saveProgress(userId, payload) {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('progress')
      .upsert({ user_id: userId, data: payload });
    if (error) throw new Error(error.message);
    return;
  }

  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    `${STORAGE_KEYS.progress}:${userId}`,
    JSON.stringify(payload),
  );
}

export async function fetchTheory() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('theory').select('*');
    if (error) throw new Error(error.message);
    return data ?? [];
  }
  await wait(MOCK_LATENCY);
  return theory;
}

export async function fetchSchedule() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('schedule')
      .select('*')
      .order('date');
    if (error) throw new Error(error.message);
    return data ?? [];
  }
  await wait(MOCK_LATENCY);
  return schedule;
}

export async function fetchCards() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('training_cards')
      .select('*');
    if (error) throw new Error(error.message);
    return data ?? [];
  }
  await wait(MOCK_LATENCY);
  return cards;
}
