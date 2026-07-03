export function getFormattedName(category, allCategories) {
  let name = category.name;
  let currentCategory = category;
  const visitedCategoryIds = new Set([category.id]);
  
  while (currentCategory.parent_id) {
    const parent = allCategories.find((c) => c.id === currentCategory.parent_id);
    if (!parent || visitedCategoryIds.has(parent.id)) break;
    name = `${parent.name} > ${name}`;
    currentCategory = parent;
    visitedCategoryIds.add(parent.id);
  }
  return name;
}

export function getSortKey(category, allCategories) {
  let hierarchyIds = [category.id.toString().padStart(6, "0")];
  let currentCategory = category;
  const visitedCategoryIds = new Set([category.id]);

  while (currentCategory.parent_id) {
    const parent = allCategories.find((c) => c.id === currentCategory.parent_id);
    if (!parent || visitedCategoryIds.has(parent.id)) break;
    hierarchyIds.unshift(parent.id.toString().padStart(6, "0"));
    currentCategory = parent;
    visitedCategoryIds.add(parent.id);
  }
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
