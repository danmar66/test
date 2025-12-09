import { z } from "zod";

export function parseValidationErrors(errorArray: z.ZodError["issues"] = []) {
  const fieldErrors: Record<string, string> = {};

  for (const err of errorArray) {
    const path = err.path?.[0];
    if (typeof path === "string") {
      fieldErrors[path] = err.message;
    }
  }

  return fieldErrors;
}
