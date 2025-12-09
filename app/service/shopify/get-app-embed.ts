import { updateMerchantByShop } from "app/repository/merchant/update-merchant-by-shop";
import { logger } from "../logger.server";
import type { AdminApiSession } from "./theme-check";
import { fetchShopify, getMainThemeId } from "./theme-check";

type SettingsData = {
    current?: {
        blocks?: Record<string, { type?: string; disabled?: boolean; settings?: unknown }>;
    };
};

export const getAppEmbed = async (session: AdminApiSession, currentStatus: boolean) => {
    // TODO: remove or condition
    // const EXT_ID = process.env.SHOPIFY_THEME_EXTENSION_ID;
    const EXT_ID = "123";
    if (!EXT_ID) {
        logger.error("Missing SHOPIFY_THEME_EXTENSION_ID");
        throw new Error("Missing SHOPIFY_THEME_EXTENSION_ID");
    }

    const mainThemeId = await getMainThemeId(session);

    const { asset } = await fetchShopify(session, `/themes/${mainThemeId}/assets.json?asset[key]=config/settings_data.json`);
    if (!asset?.value) {
        logger.error("settings_data.json: empty value", { mainThemeId });
        throw new Error("settings_data.json: empty value");
    }

    const settingsData: SettingsData = JSON.parse(asset.value);
    const blocks = settingsData?.current?.blocks ?? {};
    const embed = Object.entries(blocks).find((block) => {
        const bl = block[1];
        if (typeof bl.settings === "object" && Object.keys(bl.settings!).length === 0 && bl.type?.endsWith(`embed/${EXT_ID}`)) {
            return true;
        }

        return false;
    });

    const embedDisabled = embed ? (embed[1].disabled ?? true) : true;

    const isAppEnabled = !embedDisabled;

    if (isAppEnabled !== currentStatus) {
        await updateMerchantByShop(session.shop, { themeExtensionActivated: isAppEnabled, infoBannerHide: !isAppEnabled ? false : undefined });
    }

    return { isAppEnabled, mainThemeId };
};
