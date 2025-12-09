import prisma from "app/db.server";
import type { Prisma } from "@prisma/client";

export const updateMerchantByShop = async (
  shop: string,
  data: Prisma.MerchantUpdateInput
) => {
  const result = await prisma.merchant.update({
    where: { shop },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });

  return result;
};
