import { getMerchantByShop } from "app/repository/merchant/get-merchant-by-shop.server";
import { authenticate } from "app/shopify.server";

export const requireMerchantFromAdmin = async (request: Request) => {
    const context = await authenticate.admin(request);
    const {
        session: { shop },
    } = context;

    const merchant = await getMerchantByShop(shop);

    return { merchant, context };
};
