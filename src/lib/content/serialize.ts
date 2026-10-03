/** Convertit récursivement les Timestamp Firestore en chaînes ISO (sérialisables vers le navigateur). */
export function serialize<T>(value: unknown): T {
  if (value === null || value === undefined) return value as T;
  if (typeof value === "object" && "toDate" in value && typeof (value as { toDate: unknown }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString() as T;
  }
  if (value instanceof Date) return value.toISOString() as T;
  if (Array.isArray(value)) return value.map((v) => serialize(v)) as T;
  if (typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, serialize(v)])) as T;
  }
  return value as T;
}
