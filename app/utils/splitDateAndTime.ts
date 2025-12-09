export function splitDateAndTime(date?: Date | null) {
  if (!date) return { date: undefined, time: undefined };
  const iso = date.toISOString();
  return {
    date: iso.slice(0, 10),
    time: iso.slice(11, 16),
  };
}
