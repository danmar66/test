import {z} from "zod";

export enum TriggerType {
  Products = "products",
  Amount = "amount",
}

export enum TriggerConditionType {
  AnyProducts = "anyProducts",
  SpecificProducts = "specificProducts",
  Collections = "collections",
}

export enum RewardActionType {
  Auto = "auto",
  Manual = "manual",
}

export enum DiscountType {
  Percentage = "percentage",
  Amount = "amount",
}

export enum ScheduleType {
  Continuously = "continuously",
  Schedule = "schedule",
}

export enum TriggerConditionText {
  anyProducts = "any products",
  specificProducts = "specific products",
  collections = "specific collections",
}

export interface OfferValidationError {
  offerName: string
  triggerType: string
  triggerCondition: string

  minQuantity: string
  maxQuantity: string
  minAmount: string
  maxAmount: string

  rewardAction: string
  discountType: string
  discountValue: string

  scheduleType: string
  hasEndDate: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
}


export interface OfferPayload {
  merchantId: number;

  offerName: string;
  triggerType: TriggerType;
  triggerCondition: TriggerConditionType;

  minQuantity?: number;
  maxQuantity?: number;
  minAmount?: number;
  maxAmount?: number;

  rewardAction: RewardActionType;
  rewardGiftsAmount?: number;
  discountType: DiscountType;
  discountValue: number;

  scheduleType: ScheduleType;
  hasEndDate: boolean;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;

  selectedTriggerProducts: Product[];
  selectedTriggerCollections: Collection[];
  selectedRewardProducts: Product[];
}

export interface OfferActionResponse {
  mode: string;
  success: boolean;
  values?: OfferPayload;
  id?: string;
  error?: string;
  errors?: z.ZodError["issues"];
  message?: string;
}

export type OfferFormState = Omit<
  OfferPayload,
  | "selectedTriggerProducts"
  | "selectedTriggerCollections"
  | "selectedRewardProducts"
  | "merchantId"
>;

export interface Image {
  id: string;
  altText: string;
  originalSrc: string;
}

export interface Product {
  id: string;
  title: string;
  images: Image[];
  totalVariants: number;
  variants: {
    id: string;
    title: string;
    price: string;
    image: Image;
  }[]
}

export interface Collection {
  id: string;
  title: string;
  image: Image;
}

export enum OfferStatusEnum {
  ACTIVE = "active",
  DRAFT = "draft",
}
