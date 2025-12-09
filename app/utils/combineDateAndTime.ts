export function combineDateAndTime(
  dateInput?: string | Date,
  timeStr?: string
): Date | null {
  if (!dateInput) return null;

  const dateStr =
    dateInput instanceof Date
      ? dateInput.toISOString().slice(0, 10)
      : dateInput;

  const iso = `${dateStr}T${timeStr || "00:00"}:00`;
  const date = new Date(iso);
  return isNaN(date.getTime()) ? null : date;
}
