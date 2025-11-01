import React from 'react';

export default function GroceryList({ items = [], onMarkBought, essentialItems = new Set(), planCounts = {}, emptyMessage = 'Eksik yok. Afiyet olsun!' }) {
  const isEssentialFn = (name) => (essentialItems instanceof Set ? essentialItems.has(name) : Array.isArray(essentialItems) && essentialItems.includes(name));
  const getCount = (name) => (planCounts instanceof Map ? (planCounts.get(name) || 0) : (planCounts?.[name] || 0));

  if (!items.length) return <p className="text-sm text-gray-500">{emptyMessage}</p>;

  const sortNames = (arr) => arr.slice().sort((a, b) => a.localeCompare(b, 'tr-TR', { sensitivity: 'base' }));
  const essentialsRaw = items.filter(isEssentialFn);
  const others = sortNames(items.filter((n) => !isEssentialFn(n)));
  const essentials = essentialsRaw
    .slice()
    .sort((a, b) => {
      const cb = getCount(b);
      const ca = getCount(a);
      if (cb !== ca) return cb - ca; // desc by count
      return a.localeCompare(b, 'tr-TR', { sensitivity: 'base' });
    });

  const copyToClipboard = async () => {
    const text = items.join('\n');
    try {
      await navigator.clipboard?.writeText(text);
      // eslint-disable-next-line no-alert
      alert('Liste panoya kopyalandı.');
    } catch {
      // Fallback
      // eslint-disable-next-line no-alert
      alert(text);
    }
  };

  const printList = () => {
    window.print();
  };

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <button className="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200" onClick={copyToClipboard}>Kopyala</button>
        <button className="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200" onClick={printList}>Yazdır</button>
      </div>

      {essentials.length && others.length ? (
        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold text-rose-700 mb-1">Elzem</div>
            <ul className="space-y-2">
              {essentials.map(name => (
                <ItemRow key={name} name={name} isEssential count={getCount(name)} onMarkBought={onMarkBought} />
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-1">Diğer</div>
            <ul className="space-y-2">
              {others.map(name => (
                <ItemRow key={name} name={name} onMarkBought={onMarkBought} />
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {(() => {
            const allEssential = items.every(isEssentialFn);
            const list = allEssential
              ? items.slice().sort((a, b) => {
                  const cb = getCount(b);
                  const ca = getCount(a);
                  if (cb !== ca) return cb - ca;
                  return a.localeCompare(b, 'tr-TR', { sensitivity: 'base' });
                })
              : sortNames(items);
            return list.map(name => (
              <ItemRow key={name} name={name} isEssential={isEssentialFn(name)} count={getCount(name)} onMarkBought={onMarkBought} />
            ));
          })()}
        </ul>
      )}
    </div>
  );
}

function ItemRow({ name, isEssential = false, count = 0, onMarkBought }) {
  return (
    <li className="flex items-center justify-between border rounded p-2">
      <div className="flex items-center gap-2 min-w-0">
        <span className="truncate">{name}</span>
        {isEssential && (
          <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 ring-1 ring-rose-200 shrink-0">
            Elzem{count ? <span className="ml-1 font-semibold">×{count}</span> : null}
          </span>
        )}
      </div>
      <button
        className="text-sm px-2 py-1 rounded bg-emerald-600 text-white"
        onClick={() => onMarkBought && onMarkBought(name)}
      >
        Aldım
      </button>
    </li>
  );
}
