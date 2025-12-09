import prisma from "app/db.server";

export const getMerchantByShop = async (shop: string) => {
  return await prisma.merchant.findUnique({
    where: { shop },
  });
};
