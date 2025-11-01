import React from 'react';

export default function IngredientList({ ingredients = [], stocks = {}, onToggle }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {ingredients.map((name) => {
        const on = !!stocks[name];
        return (
          <li key={name} className="flex items-center justify-between rounded border p-2">
            <span className="truncate mr-2">{name}</span>
            <button
              className={`px-2 py-1 text-sm rounded ${on ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
              onClick={() => onToggle && onToggle(name)}
            >
              {on ? 'Var' : 'Yok'}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
