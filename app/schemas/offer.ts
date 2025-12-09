import { z } from "zod";

const timeSchema = z
  .string()
  .trim()
  .regex(/^((0?\d|1\d|2[0-3]):[0-5]\d)$/, {
    message: "Invalid time format. Use 24h format like 09:30 or 21:45",
  })
  .optional();

const dateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Invalid date format. Use YYYY-MM-DD",
  })
  .refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && val === date.toISOString().slice(0, 10);
  }, {
    message: "Invalid or non-existent date",
  })
  .transform((val) => new Date(val))
  .optional();

export const OfferSchema = z
  .object({
    offerName: z.string().min(3, "Enter a valid offer name"),
    triggerType: z.enum(["products", "amount"]),
    triggerCondition: z.enum([
      "anyProducts",
      "specificProducts",
      "collections",
    ]),
    minQuantity: z.number().optional(),
    maxQuantity: z.number().optional(),
    minAmount: z.number().optional(),
    maxAmount: z.number().optional(),
    rewardAction: z.enum(["auto", "manual"], "Please, select reward action type"),
    rewardGiftsAmount: z.number("Please, specify the number of gifts").optional(),
    discountType: z.enum(["percentage", "amount"]),
    discountValue: z.number("Please, enter a value"),
    status: z.enum(["active", "draft"]),
    scheduleType: z.enum(["continuously", "schedule"], "Please, select schedule type"),
    hasEndDate: z.boolean().optional(),
    startDate: dateSchema,
    startTime: timeSchema,
    endDate: dateSchema,
    endTime: timeSchema,
    selectedTriggerProducts: z.string().optional(),
    selectedTriggerCollections: z.string().optional(),
    selectedRewardProducts: z
      .string("Select at least one reward product")
      .refine((val) => {
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) && parsed.length > 0;
        } catch {
          return false;
        }
      }, {
        message: "Select at least one reward product",
      }),
  })
  .superRefine((data, ctx) => {
    // === Discount validation ===
    if (data.discountType === "percentage" && data.discountValue > 100) {
      ctx.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "Percentage discount cannot exceed 100%",
      });
    }

    // === Trigger validation ===
    if (data.triggerType === "products" && !data.minQuantity) {
      ctx.addIssue({
        code: "custom",
        path: ["minQuantity"],
        message: "You must specify a minimum quantity",
      });
    }

    if (data.triggerType === "amount" && !data.minAmount) {
      ctx.addIssue({
        code: "custom",
        path: ["minAmount"],
        message: "You must specify a minimum amount",
      });
    }

    // === Trigger condition validation ===
    if (data.triggerCondition === "specificProducts") {
      try {
        const parsedProducts = JSON.parse(String(data.selectedTriggerProducts || "[]"));
        if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
          ctx.addIssue({
            code: "custom",
            path: ["selectedTriggerProducts"],
            message: "Select at least one trigger product",
          });
        }
      } catch {
        ctx.addIssue({
          code: "custom",
          path: ["selectedTriggerProducts"],
          message: "Invalid trigger products data",
        });
      }
    }

    if (data.triggerCondition === "collections") {
      try {
        const parsedCollections = JSON.parse(String(data.selectedTriggerCollections || "[]"));
        if (!Array.isArray(parsedCollections) || parsedCollections.length === 0) {
          ctx.addIssue({
            code: "custom",
            path: ["selectedTriggerCollections"],
            message: "Select at least one trigger collection",
          });
        }
      } catch {
        ctx.addIssue({
          code: "custom",
          path: ["selectedTriggerCollections"],
          message: "Invalid trigger collections data",
        });
      }
    }

    // === Reward validation
    if (data.rewardAction === "manual" && !data.rewardGiftsAmount) {
      ctx.addIssue({
        code: "custom",
        path: ["rewardGiftsAmount"],
        message: "You must specify the number of gifts",
      });
    }

    // === Schedule validation ===
    if (data.scheduleType === "schedule") {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      if (!data.startDate) {
        ctx.addIssue({
          code: "custom",
          path: ["startDate"],
          message: "Start date is required for scheduled offers",
        });
      }

      if (data.hasEndDate && !data.endDate) {
        ctx.addIssue({
          code: "custom",
          path: ["endDate"],
          message: "End date is required when 'hasEndDate' is true",
        });
      }

      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);

        if (start > end) {
          ctx.addIssue({
            code: "custom",
            path: ["endDate"],
            message: "End date cannot be earlier than start date",
          });
        }
      }

      if (data.startDate) {
        const start = new Date(data.startDate);
        if (start < now) {
          ctx.addIssue({
            code: "custom",
            path: ["startDate"],
            message: "Start date cannot be in the past",
          });
        }
      }

      if (data.endDate) {
        const end = new Date(data.endDate);
        if (end < now) {
          ctx.addIssue({
            code: "custom",
            path: ["endDate"],
            message: "End date cannot be in the past",
          });
        }
      }

      if (!data.startTime) {
        ctx.addIssue({
          code: "custom",
          path: ["startTime"],
          message: "Please, specify a start time",
        });
      }

      if (data.hasEndDate && !data.endTime) {
        ctx.addIssue({
          code: "custom",
          path: ["endTime"],
          message: "Please, specify an end time",
        });
      }
    }
  });
