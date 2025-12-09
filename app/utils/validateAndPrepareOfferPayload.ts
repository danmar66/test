import { OfferSchema } from "../schemas/offer";
import { Prisma } from "@prisma/client";
import { combineDateAndTime } from "./combineDateAndTime";
import {z} from "zod";

export type OfferDTO = z.infer<typeof OfferSchema>;

const safeJson = (value?: string) => {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

export function validateAndPreparePayloadCreate(
  rawData: unknown,
  merchantId: number
): Prisma.OfferUncheckedCreateInput {

  const parsed = OfferSchema.safeParse(rawData);
  if (!parsed.success) throw new Error(JSON.stringify(parsed.error.issues));
  const d = parsed.data;

  return {
    offerName: d.offerName,
    status: d.status,
    triggerType: d.triggerType,
    triggerCondition: d.triggerCondition,
    minQuantity: d.minQuantity ?? null,
    maxQuantity: d.maxQuantity ?? null,
    minAmount: d.minAmount ?? null,
    maxAmount: d.maxAmount ?? null,
    rewardAction: d.rewardAction,
    rewardGiftsAmount: d.rewardGiftsAmount ?? null,
    discountType: d.discountType,
    discountValue: d.discountValue,
    scheduleType: d.scheduleType,
    hasEndDate: d.hasEndDate ?? false,
    startAt: combineDateAndTime(d.startDate, d.startTime),
    endAt: combineDateAndTime(d.endDate, d.endTime),

    selectedTriggerProducts: safeJson(d.selectedTriggerProducts),
    selectedTriggerCollections: safeJson(d.selectedTriggerCollections),
    selectedRewardProducts: safeJson(d.selectedRewardProducts),

    merchantId
  };
}

export function validateAndPreparePayloadUpdate(
  rawData: unknown
): Prisma.OfferUncheckedUpdateInput {

  const parsed = OfferSchema.safeParse(rawData);
  if (!parsed.success) throw new Error(JSON.stringify(parsed.error.issues));
  const d = parsed.data;

  return {
    offerName: d.offerName,
    status: d.status,
    triggerType: d.triggerType,
    triggerCondition: d.triggerCondition,
    minQuantity: d.minQuantity ?? null,
    maxQuantity: d.maxQuantity ?? null,
    minAmount: d.minAmount ?? null,
    maxAmount: d.maxAmount ?? null,
    rewardAction: d.rewardAction,
    rewardGiftsAmount: d.rewardGiftsAmount ?? null,
    discountType: d.discountType,
    discountValue: d.discountValue,
    scheduleType: d.scheduleType,
    hasEndDate: d.hasEndDate ?? false,
    startAt: combineDateAndTime(d.startDate, d.startTime),
    endAt: combineDateAndTime(d.endDate, d.endTime),

    selectedTriggerProducts: safeJson(d.selectedTriggerProducts),
    selectedTriggerCollections: safeJson(d.selectedTriggerCollections),
    selectedRewardProducts: safeJson(d.selectedRewardProducts),
  };
}
