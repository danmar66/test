import {AdminContext} from "@shopify/shopify-app-react-router/server";
import { logger } from "../../logger.server";

export const updateShopMetafield = async (graphql: AdminContext["admin"]["graphql"], shopId: string, key: string, metafieldData: any) => {
    const metafieldInput = {
        namespace: "walnut",
        key,
        type: "json",
        value: JSON.stringify(metafieldData),
        ownerId: shopId,
    };

    const variables = {
        metafields: [metafieldInput],
    };

    try {
        const response = await graphql(
            `
                #graphql
                mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
                    metafieldsSet(metafields: $metafields) {
                        metafields {
                            id
                            namespace
                            key
                            value
                            type
                        }
                        userErrors {
                            field
                            message
                        }
                    }
                }
            `,
            { variables },
        );
        const data = await response.json();

        const errors = data?.data?.metafieldsSet?.userErrors;
        if (errors?.length) {
            console.log(errors);
            logger.error("Shopify Metafield Error:", { errors });
            throw new Error(errors.map((e: any) => e.message).join(", "));
        }
        return data?.data?.metafieldsSet?.metafields?.[0] ?? false;
    } catch (error) {
      console.log(error);

      logger.error("Shopify Metafield Error:", { error });
        throw new Response(JSON.stringify({ error: error }), { status: 500 });
    }
};
