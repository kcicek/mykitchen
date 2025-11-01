import React, { useEffect, useState } from 'react';

export default function CookModal({ isOpen, recipe, onClose, onConfirm }) {
  const [step, setStep] = useState('question'); // 'question' | 'select'
  const [finished, setFinished] = useState(() => new Set());

  useEffect(() => {
    if (!isOpen) return;
    // Reset when opening or recipe changes
    setStep('question');
    setFinished(new Set());
  }, [isOpen, recipe]);

  if (!isOpen || !recipe) return null;

  const ingrs = recipe.ingredients || [];

  const toggleItem = (name) => {
    setFinished((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const selectAll = () => setFinished(new Set(ingrs));
  const clearAll = () => setFinished(new Set());

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-4">
        <h3 className="text-lg font-semibold">{recipe.name}</h3>

        {step === 'question' ? (
          <>
            <p className="mt-2 text-sm text-gray-700">
              Yemeği pişirdiniz mi? Malzemeler hâlâ yeterli mi?
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button className="px-3 py-1 rounded bg-gray-200" onClick={onClose}>Vazgeç</button>
              <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={() => onConfirm && onConfirm(true)}>Evet, yeterli</button>
              <button className="px-3 py-1 rounded bg-amber-600 text-white" onClick={() => setStep('select')}>Hayır, tükendi</button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-gray-700">
              Hangi malzemeler tükendi? Seçip onaylayın.
            </p>
            <div className="mt-3 flex items-center gap-3 text-xs">
              <button className="px-2 py-1 rounded bg-gray-100" onClick={selectAll}>Tümünü Seç</button>
              <button className="px-2 py-1 rounded bg-gray-100" onClick={clearAll}>Temizle</button>
              <span className="text-gray-500">Seçili: {finished.size}/{ingrs.length}</span>
            </div>
            <ul className="mt-3 max-h-60 overflow-auto divide-y">
              {ingrs.map((name) => (
                <li key={name} className="py-2 flex items-center gap-3">
                  <input
                    id={`fin-${name}`}
                    type="checkbox"
                    className="size-4 accent-amber-600"
                    checked={finished.has(name)}
                    onChange={() => toggleItem(name)}
                  />
                  <label htmlFor={`fin-${name}`} className="text-sm cursor-pointer select-none truncate">
                    {name}
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between gap-2">
              <button className="px-3 py-1 rounded bg-gray-200" onClick={() => setStep('question')}>Geri</button>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 rounded bg-gray-200" onClick={onClose}>Vazgeç</button>
                <button
                  className="px-3 py-1 rounded bg-amber-600 text-white"
                  onClick={() => onConfirm && onConfirm(Array.from(finished))}
                >
                  Onayla
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
