import {AdminContext} from "@shopify/shopify-app-react-router/server";
import { logger } from "app/service/logger.server";

export const getShopMetafield = async (graphql: AdminContext["admin"]["graphql"], shopId: string, key: string) => {
    const variables = {
        ownerId: shopId,
        namespace: "walnut",
        key,
    };
    try {
        const resp = await graphql(
            `
                #graphql
                query getShopMetafield($ownerId: ID!, $namespace: String!, $key: String!) {
                    node(id: $ownerId) {
                        ... on Shop {
                            metafield(namespace: $namespace, key: $key) {
                                id
                            }
                        }
                    }
                }
            `,
            { variables },
        );
        const json = await resp.json();
        const metafieldId = json?.data?.node?.metafield?.id;

        if (!metafieldId) {
            logger.warn(`Metafield with key "${key}" not found for shop ${shopId}`);
            throw new Response(`Metafield with key "${key}" not found for shop ${shopId}`, { status: 500 });
        }

        return metafieldId;
    } catch (error) {
        logger.error("Shopify Metafield Get Error:", { error });
        throw new Response(JSON.stringify({ error: error }), { status: 500 });
    }
};
