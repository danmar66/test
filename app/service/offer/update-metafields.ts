// import type { SliderListData } from "app/repository/slider/get-merchant-sliders";
import { updateShopMetafield } from "../shopify/shop/add-shop-metafields";
import {AdminContext} from "@shopify/shopify-app-react-router/server";
import { deleteShopMetafield } from "../shopify/shop/delete-shop-metafield";
import {DesignSettings} from "../../routes/app.design/types";

interface IUpdateMetafields {
    graphql: AdminContext["admin"]["graphql"];
    shopId: string;
    activeOffers?: any;
    design?: DesignSettings;
    offerId?: string;
    action: "del" | "add" | "picker_design" | "offers_design";
}

export const updateMetafields = async ({ graphql, shopId, activeOffers, design, offerId, action }: IUpdateMetafields) => {
    if (action === "picker_design") {
      await updateShopMetafield(graphql, shopId, "picker_design_settings", JSON.stringify(design));

      return
    }

    if (action === "offers_design") {
      await updateShopMetafield(graphql, shopId, "offers_design_settings", JSON.stringify(design));

      return
    }

    const offers = action === "del" ? activeOffers.filter((offer) => offer.id !== offerId) : activeOffers;

    const settingsData = offers.map((offer) => ({
        id: offer.id,
        pl: offer.placement,
        pr: offer.products.length ? offer.products.map((prod) => prod.product.shopifyProductId) : undefined,
        cl: offer.collections.length ? offer.collections.map((col) => col.collection.shopifyCollectionId) : undefined,
    }));

    if (action === "add") {
        const offers = offers.find((offer) => offer.id === offerId);

        if (!offers) return;

        const sliderData = {
            layout: offers.layout,
            videosPerRow: offers.videosPerRow,
            autoScrollSeconds: offers.autoScrollSeconds,
            slides: offers.slides
                .sort((a, b) => a.order - b.order)
                .map((offerItem) => ({
                    videoUrl: offerItem.video.videoUrl,
                    thumbnailUrl: offerItem.video.thumbnailUrl,
                    productHandle: offerItem.variant?.product.handle,
                })),
        };

        await updateShopMetafield(graphql, shopId, offerId, sliderData);
    }

    if (action === "del") {
        await deleteShopMetafield(graphql, shopId, offerId);
    }
};
