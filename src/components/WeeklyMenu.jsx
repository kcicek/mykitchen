import React, { useEffect, useMemo, useState } from 'react';

/**
 * WeeklyMenu
 * - value: Array< Array<number> > length 7, recipe ids per day
 * - onChange: (nextPlan) => void
 */
export default function WeeklyMenu({ recipes = [], value = [[], [], [], [], [], [], []], onChange, unavailable = new Set() }) {
  const [openDay, setOpenDay] = useState(0); // which day panel is open
  const [query, setQuery] = useState('');

  const dayLabels = useMemo(() => {
    const base = new Date();
    const labels = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      try {
        labels.push(d.toLocaleDateString('tr-TR', { weekday: 'long' }));
      } catch {
        labels.push(`Gün ${i + 1}`);
      }
    }
    return labels;
  }, []);

  const filteredRecipes = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr-TR');
    if (!q) return recipes;
    return recipes.filter(r => r.name.toLocaleLowerCase('tr-TR').includes(q));
  }, [recipes, query]);

  const toggleSelect = (dayIndex, recipeId) => {
    const next = value.map((arr, idx) => (idx === dayIndex ? [...arr] : arr));
    const arr = next[dayIndex];
    const i = arr.indexOf(recipeId);
    if (i >= 0) arr.splice(i, 1);
    else arr.push(recipeId);
    onChange && onChange(next);
  };

  const clearDay = (dayIndex) => {
    const next = value.map((arr, idx) => (idx === dayIndex ? [] : arr));
    onChange && onChange(next);
  };

  return (
    <div className="space-y-3">
      {value.map((ids, dayIndex) => (
        <div
          key={dayIndex}
          className={`border rounded-lg transition-opacity ${openDay === dayIndex ? 'opacity-100 ring-1 ring-indigo-200 bg-indigo-50/30' : 'opacity-70 hover:opacity-100'}`}
        >
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 text-left"
            onClick={() => setOpenDay(openDay === dayIndex ? -1 : dayIndex)}
          >
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">
                {dayLabels[dayIndex] || `Gün ${dayIndex + 1}`}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {ids.length ? (
                  ids.map((id) => {
                    const r = recipes.find(x => x.id === id);
                    const isUnavailable = unavailable instanceof Set ? unavailable.has(id) : false;
                    return (
                      <span
                        key={id}
                        className={`text-xs px-2 py-0.5 rounded-full truncate max-w-[12rem] ${isUnavailable ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}
                        title={isUnavailable ? 'Eksik malzeme var' : ''}
                      >
                        {r ? r.name : `#${id}`}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xs text-gray-500">Seçilmedi</span>
                )}
              </div>
            </div>
            <svg className={`size-4 shrink-0 transition-transform ${openDay === dayIndex ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>

          {openDay === dayIndex && (
            <div className="px-3 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="Tarif ara..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="px-2 py-1 text-xs rounded bg-gray-100" onClick={() => clearDay(dayIndex)}>Temizle</button>
              </div>
              <ul className="max-h-56 overflow-auto divide-y">
                {filteredRecipes.map((r) => {
                  const checked = ids.includes(r.id);
                  const isUnavailable = unavailable instanceof Set ? unavailable.has(r.id) : false;
                  return (
                    <li key={r.id} className="py-2 flex items-center gap-2">
                      <input
                        id={`day-${dayIndex}-rec-${r.id}`}
                        type="checkbox"
                        className={`size-4 ${isUnavailable ? 'accent-rose-600' : 'accent-indigo-600'}`}
                        checked={checked}
                        onChange={() => toggleSelect(dayIndex, r.id)}
                      />
                      <label htmlFor={`day-${dayIndex}-rec-${r.id}`} className={`text-sm cursor-pointer select-none truncate ${isUnavailable ? 'text-rose-700' : ''}`}>
                        {r.name}
                        {isUnavailable && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 ring-1 ring-rose-200">Eksik</span>}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
