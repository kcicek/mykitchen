import React from 'react';
import { missingIngredients, isCookable } from '../utils/suggestionEngine';

export default function RecipeList({ recipes = [], stocks = {}, onCook }) {
  if (!recipes.length) {
    return <p className="text-sm text-gray-500">Gösterilecek tarif yok.</p>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {recipes.map((r) => {
        const miss = missingIngredients(r, stocks);
        const can = isCookable(r, stocks);
        return (
          <div key={r.id} className="border rounded-lg p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{r.name}</h3>
                <p className="text-xs text-gray-600">{r.ingredients.join(', ')}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${can ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {can ? 'Yapılabilir' : `${miss.length} eksik`}
              </span>
            </div>
            {!can && miss.length > 0 && (
              <p className="text-xs mt-2 text-gray-700">Eksikler: {miss.join(', ')}</p>
            )}
            <div className="mt-3">
              <button
                className="px-3 py-1 rounded bg-blue-600 text-white text-sm disabled:opacity-50"
                onClick={() => onCook && onCook(r)}
                disabled={!can && miss.length > 4}
              >
                Pişir
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
