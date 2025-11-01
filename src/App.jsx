import React, { useEffect, useMemo, useState } from 'react';
import { recipes } from './data/recipes';
import IngredientList from './components/IngredientList';
import RecipeList from './components/RecipeList';
import GroceryList from './components/GroceryList';
import CookModal from './components/CookModal';
import CollapsibleSection from './components/CollapsibleSection';
import WeeklyMenu from './components/WeeklyMenu';
import { IconCalendar, IconCart } from './components/icons';
import useStock from './hooks/useStock';
import { getGroceryList, bestRecipeSuggestions, missingIngredients } from './utils/suggestionEngine';
import './index.css';

export default function App() {
  const { stocks, toggleIngredient, setIngredient, setMultiple } = useStock();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Filter state for Ingredient Stock list (persisted)
  const [showInStock, setShowInStock] = useState(() => {
    try { const v = localStorage.getItem('filter-showInStock'); return v == null ? true : v === '1'; } catch { return true; }
  }); // "Var"
  const [showOutOfStock, setShowOutOfStock] = useState(() => {
    try { const v = localStorage.getItem('filter-showOutOfStock'); return v == null ? true : v === '1'; } catch { return true; }
  }); // "Yok"
  // Grocery filter: show only essential ones (persisted)
  const [onlyEssential, setOnlyEssential] = useState(() => {
    try { const v = localStorage.getItem('filter-onlyEssential'); return v === '1'; } catch { return false; }
  });
  // Weekly menu plan: 7 days, multiple recipe IDs per day
  const [weeklyPlan, setWeeklyPlan] = useState(() => {
    try {
      const raw = localStorage.getItem('weekly-plan-v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === 7) return parsed;
      }
    } catch {}
    return [[], [], [], [], [], [], []];
  });

  const allIngredients = useMemo(() => {
    const set = new Set();
    recipes.forEach(r => r.ingredients.forEach(i => set.add(i)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'tr'));
  }, []);

  const grocery = useMemo(() => getGroceryList(recipes, stocks), [stocks]);
  const [suggestionLimit, setSuggestionLimit] = useState(8);
  const allSuggestions = useMemo(() => bestRecipeSuggestions(recipes, stocks, recipes.length), [stocks]);
  const suggestions = useMemo(() => allSuggestions.slice(0, suggestionLimit), [allSuggestions, suggestionLimit]);

  // Apply ingredient filter according to checkboxes
  const filteredIngredients = useMemo(() => {
    if (showInStock && showOutOfStock) return allIngredients;
    if (!showInStock && !showOutOfStock) return [];
    return allIngredients.filter((name) => {
      const on = !!stocks[name];
      return (showInStock && on) || (showOutOfStock && !on);
    });
  }, [allIngredients, stocks, showInStock, showOutOfStock]);

  // Persist weekly plan
  useEffect(() => {
    try { localStorage.setItem('weekly-plan-v1', JSON.stringify(weeklyPlan)); } catch {}
  }, [weeklyPlan]);

  // Persist filters
  useEffect(() => { try { localStorage.setItem('filter-showInStock', showInStock ? '1' : '0'); } catch {} }, [showInStock]);
  useEffect(() => { try { localStorage.setItem('filter-showOutOfStock', showOutOfStock ? '1' : '0'); } catch {} }, [showOutOfStock]);
  useEffect(() => { try { localStorage.setItem('filter-onlyEssential', onlyEssential ? '1' : '0'); } catch {} }, [onlyEssential]);

  // Compute essential grocery items required for the weekly plan (that are currently missing)
  const essentialItems = useMemo(() => {
    const idSet = new Set(weeklyPlan.flat());
    if (!idSet.size) return new Set();
    const byId = new Map(recipes.map(r => [r.id, r]));
    const needed = new Set();
    idSet.forEach((id) => {
      const r = byId.get(id);
      if (r) missingIngredients(r, stocks).forEach(i => needed.add(i));
    });
    return needed;
  }, [weeklyPlan, stocks]);

  const groceryToShow = useMemo(() => {
    if (!onlyEssential) return grocery;
    return grocery.filter((name) => essentialItems.has(name));
  }, [grocery, essentialItems, onlyEssential]);

  const weeklyCount = useMemo(() => weeklyPlan.flat().length, [weeklyPlan]);
  const groceryCount = groceryToShow.length;

  // Recipes that currently have missing ingredients (unavailable to cook fully)
  const unavailableRecipes = useMemo(() => {
    const set = new Set();
    (recipes || []).forEach(r => {
      const miss = missingIngredients(r, stocks);
      if (Array.isArray(miss) && miss.length > 0) set.add(r.id);
    });
    return set;
  }, [stocks]);

  // Count how many planned recipes require each ingredient (used to rank ELZEM items)
  const plannedIngredientCounts = useMemo(() => {
    const byId = new Map(recipes.map(r => [r.id, r]));
    const counts = Object.create(null);
    (weeklyPlan || []).forEach(day => {
      (day || []).forEach(id => {
        const r = byId.get(id);
        if (!r || !Array.isArray(r.ingredients)) return;
        r.ingredients.forEach((name) => {
          counts[name] = (counts[name] || 0) + 1;
        });
      });
    });
    return counts; // plain object name -> count
  }, [weeklyPlan, recipes]);

  const onCook = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCookConfirm = (result) => {
    if (!selectedRecipe) return;
    // If true, nothing to change; if array, it lists finished ingredients
    if (Array.isArray(result)) {
      const updates = {};
      result.forEach((i) => { updates[i] = false; });
      if (Object.keys(updates).length) setMultiple(updates);
    }
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="min-h-screen p-3 md:p-6 lg:p-8">
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 rounded-full mb-4 opacity-80" />
      <header className="max-w-6xl mx-auto mb-4 flex items-center gap-3">
        <img src="/icons/kitchen-icon.svg" alt="MyKitchen" className="h-8 w-8 rounded" loading="eager" />
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">MyKitchen</h1>
      </header>
      <div className="max-w-6xl mx-auto flex flex-col gap-0 lg:grid lg:grid-cols-3 lg:gap-6">
      <CollapsibleSection className="lg:col-span-1" title="🍱 Malzeme Stoğu" persistKey="sec-stock" defaultOpen={false}>
        <div className="mb-3 flex items-center gap-4 text-sm">
          <label className="inline-flex items-center gap-2 select-none">
            <input
              type="checkbox"
              className="size-4 accent-green-600"
              checked={showInStock}
              onChange={(e) => setShowInStock(e.target.checked)}
            />
            <span>Var</span>
          </label>
          <label className="inline-flex items-center gap-2 select-none">
            <input
              type="checkbox"
              className="size-4 accent-gray-600"
              checked={showOutOfStock}
              onChange={(e) => setShowOutOfStock(e.target.checked)}
            />
            <span>Yok</span>
          </label>
        </div>
        <IngredientList ingredients={filteredIngredients} stocks={stocks} onToggle={toggleIngredient} />
      </CollapsibleSection>

      <CollapsibleSection className="lg:col-span-2" title="👨‍🍳 Önerilen Tarifler" persistKey="sec-suggestions" defaultOpen={false}>
        <RecipeList recipes={suggestions} stocks={stocks} onCook={onCook} />
        {suggestionLimit < allSuggestions.length && (
          <div className="mt-3 flex justify-center">
            <button
              className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-sm"
              onClick={() => setSuggestionLimit((n) => Math.min(n + 10, allSuggestions.length))}
            >
              Daha Fazla Göster
            </button>
          </div>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        className="lg:col-span-2"
        title={(
          <span className="inline-flex items-center gap-2">
            <IconCalendar className="size-5 text-gray-600" />
            <span>Haftalık Menü</span>
            {weeklyCount ? (
              <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">{weeklyCount}</span>
            ) : null}
          </span>
        )}
        persistKey="sec-weekly"
        defaultOpen={false}
      >
        <div className="mb-3 flex items-center justify-end">
          <button
            className="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200"
            onClick={() => setWeeklyPlan([[], [], [], [], [], [], []])}
            title="Planı temizle"
          >
            Planı Temizle
          </button>
        </div>
        <WeeklyMenu recipes={recipes} value={weeklyPlan} onChange={setWeeklyPlan} unavailable={unavailableRecipes} />
      </CollapsibleSection>

      <CollapsibleSection
        className="lg:col-span-2"
        title={(
          <span className="inline-flex items-center gap-2">
            <IconCart className="size-5 text-gray-600" />
            <span>Alışveriş Listesi</span>
            {groceryCount ? (
              <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">{groceryCount}</span>
            ) : null}
          </span>
        )}
        persistKey="sec-grocery"
        defaultOpen={false}
      >
        <div className="mb-3">
          <button
            type="button"
            role="switch"
            aria-checked={onlyEssential}
            onClick={() => setOnlyEssential(o => !o)}
            className={`inline-flex items-center text-sm select-none gap-2`}
          >
            <span className="text-sm">Sadece ELZEM olanları göster</span>
            <span className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${onlyEssential ? 'bg-rose-600' : 'bg-gray-300'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${onlyEssential ? 'translate-x-4' : 'translate-x-1'}`}></span>
            </span>
          </button>
        </div>
        <GroceryList
          items={groceryToShow}
          essentialItems={essentialItems}
          planCounts={plannedIngredientCounts}
          emptyMessage={onlyEssential ? 'Elzem eksik yok 🎉' : 'Eksik yok. Afiyet olsun!'}
          onMarkBought={(name) => setIngredient(name, true)}
        />
      </CollapsibleSection>

      <CookModal
        isOpen={isModalOpen}
        recipe={selectedRecipe}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCookConfirm}
      />
      </div>
    </div>
  );
}
