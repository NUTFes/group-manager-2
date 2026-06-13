export function getFormattedName(cat, allCategories) {
  let name = cat.name;
  let current = cat;
  const visited = new Set([cat.id]);
  
  while (current.parent_id) {
    const parent = allCategories.find((p) => p.id === current.parent_id);
    if (!parent || visited.has(parent.id)) break;
    name = `${parent.name} / ${name}`;
    current = parent;
    visited.add(parent.id);
  }
  return name;
}

export function getSortKey(cat, allCategories) {
  let keys = [cat.id.toString().padStart(6, "0")];
  let current = cat;
  const visited = new Set([cat.id]);

  while (current.parent_id) {
    const parent = allCategories.find((p) => p.id === current.parent_id);
    if (!parent || visited.has(parent.id)) break;
    keys.unshift(parent.id.toString().padStart(6, "0"));
    current = parent;
    visited.add(parent.id);
  }
  return keys.join("/");
}

export function getDescendantIds(catId, allCategories) {
  let ids = [];
  const children = allCategories.filter((c) => c.parent_id === catId);
  for (const child of children) {
    ids.push(child.id);
    ids = ids.concat(getDescendantIds(child.id, allCategories));
  }
  return ids;
}
