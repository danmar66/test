import "@shopify/shopify-app-react-router/adapters/node";
import type { Session, shopifyApp } from "@shopify/shopify-app-react-router/server";
import prisma from "app/db.server";
import { getShopifyShopData } from "app/service/shopify/get-shopify-data";

export type AfterAuthOptions = Parameters<
  NonNullable<
    NonNullable<Parameters<typeof shopifyApp>[0]["hooks"]>["afterAuth"]
  >
>[0];

const createMerchant = async (
  session: Session,
  shopifyData: Awaited<ReturnType<typeof getShopifyShopData>>
) => {
  const merchant = await prisma.merchant.create({
    data: {
      currencyCode: shopifyData.shop.currencyCode,
      shop: session.shop,
      shopId: shopifyData.shop.id,
      email: shopifyData.shop.email,
    },
  });

  return merchant;
};

export const getOrCreateMerchant = async ({ session, admin }: AfterAuthOptions) => {
  const existing = await prisma.merchant.findUnique({
    where: { shop: session.shop },
  });

  if (existing) {
    return existing;
  }

  const shopifyData = await getShopifyShopData(admin.graphql);
  const created = await createMerchant(session, shopifyData);

  return created;
};
