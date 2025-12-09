import prisma from "app/db.server";
import {useLoaderData} from "react-router";

export const getMerchantOffers = async (
  merchantId: number,
  status?: string
) => {
  return await prisma.offer.findMany({
    where: {
      merchantId,
      ...(status ? { status } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export type MerchantOffersData = ReturnType<typeof useLoaderData<typeof getMerchantOffers>>;
