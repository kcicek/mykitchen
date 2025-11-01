import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'kitchen-assistant:stocks:v1';

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStorage(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {}
}

export default function useStock() {
  const [state, setState] = useState(() => readStorage());

  useEffect(() => {
    writeStorage(state);
  }, [state]);

  const setIngredient = useCallback((name, available) => {
    setState(prev => ({ ...prev, [name]: !!available }));
  }, []);

  const toggleIngredient = useCallback((name) => {
    setState(prev => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const setMultiple = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const stocks = useMemo(() => state, [state]);

  return { stocks, setIngredient, toggleIngredient, setMultiple };
}
