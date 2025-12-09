/**
 * Safely parses the input value (string or array) into a typed array T[].*
 * Used for JSON fields with Prisma, which can be string | JsonArray | JsonObject | null.
 */
export function safeParseArray<T>(input: unknown): T[] {
  if (!input) return [];

  try {
    // Якщо з бази прийшов рядок JSON
    if (typeof input === "string") {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    }

    // Якщо це вже масив
    if (Array.isArray(input)) {
      return input as T[];
    }

    // Якщо це не масив — повертаємо порожній
    return [];
  } catch (err) {
    console.warn("safeParseArray error:", err);
    return [];
  }
}
