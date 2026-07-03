export function deepMerge(target, source) {
  if (!source || typeof source !== 'object') return target;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const val = source[key];
    if (val !== undefined && val !== null) {
      if (typeof val === 'object' && !Array.isArray(val)) {
        result[key] = deepMerge(target[key] || {}, val);
      } else {
        result[key] = val;
      }
    }
  }
  return result;
}
