// Utility functions for recipe suggestions and grocery list computation

export function isCookable(recipe, stocks) {
  if (!recipe || !Array.isArray(recipe.ingredients)) return false;
  return recipe.ingredients.every(i => !!stocks[i]);
}

export function missingIngredients(recipe, stocks) {
  if (!recipe || !Array.isArray(recipe.ingredients)) return [];
  return recipe.ingredients.filter(i => !stocks[i]);
}

export function getGroceryList(recipes, stocks) {
  const miss = new Set();
  (recipes || []).forEach(r => missingIngredients(r, stocks).forEach(i => miss.add(i)));
  return Array.from(miss).sort((a, b) => a.localeCompare(b, 'tr'));
}

export function bestRecipeSuggestions(recipes, stocks, limit = 10) {
  const scored = (recipes || []).map(r => {
    const missing = missingIngredients(r, stocks);
    const have = r.ingredients.length - missing.length;
    return { recipe: r, missing, have };
  });
  scored.sort((a, b) => {
    if (a.missing.length !== b.missing.length) return a.missing.length - b.missing.length;
    return b.have - a.have;
  });
  return scored.slice(0, limit).map(s => ({ ...s.recipe, _missing: s.missing }));
}
