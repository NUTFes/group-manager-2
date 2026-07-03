function getAncestorChain(category, allCategories) {
  const chain = [category];
  let currentCategory = category;
  const visitedCategoryIds = new Set([category.id]);

  while (currentCategory.parent_id) {
    const parent = allCategories.find((c) => c.id === currentCategory.parent_id);
    if (!parent || visitedCategoryIds.has(parent.id)) break;
    chain.unshift(parent);
    currentCategory = parent;
    visitedCategoryIds.add(parent.id);
  }
  return chain;
}

export function getFormattedName(category, allCategories) {
  return getAncestorChain(category, allCategories)
    .map((c) => c.name)
    .join(" / ");
}

export function getSortKey(category, allCategories) {
  const hierarchyIds = getAncestorChain(category, allCategories).map((c) =>
    c.id.toString().padStart(6, "0")
  );
  return hierarchyIds.join("-");
}

export function getChildrenIds(categoryId, allCategories, visitedCategoryIds = new Set()) {
  if (visitedCategoryIds.has(categoryId)) return [];
  visitedCategoryIds.add(categoryId);

  let ids = [];
  const children = allCategories.filter((c) => c.parent_id === categoryId);
  for (const child of children) {
    ids.push(child.id);
    ids = ids.concat(getChildrenIds(child.id, allCategories, visitedCategoryIds));
  }
  return ids;
}
