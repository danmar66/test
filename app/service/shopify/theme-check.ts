export type AdminApiSession = {
    shop: string;
    accessToken: string;
};

function templateKindFromKey(key: string): "home" | "product" | "product_custom" | "collection" | "collection_custom" | null {
    if (key === "templates/index.json") return "home";

    const lower = key.toLowerCase();

    if (lower.startsWith("templates/") && lower.includes("product") && lower.endsWith(".json")) {
        if (lower.includes("custom")) return "product_custom";
        return "product";
    }

    if (lower.startsWith("templates/") && lower.includes("collection") && lower.endsWith(".json")) {
        if (lower.includes("custom")) return "collection_custom";
        return "collection";
    }

    return null;
}

function isTargetTemplateKey(key: string): boolean {
    return templateKindFromKey(key) !== null;
}

function normalizePlacement(placement: any, key: string): string {
    if (placement && typeof placement === "string") return placement.trim();

    if (typeof key === "string") {
        const kind = templateKindFromKey(key);
        if (kind) return kind;
    }
    return String(key);
}

function isVisible(node: any): boolean {
    if (!node || typeof node !== "object") return true;
    if (node.disabled === true) return false;
    if (node.visible === false) return false;
    if (node.enabled === false) return false;
    return true;
}

function extractAppSlugFromType(type: string): string | null {
    const m = type.match(/(?:shopify:\/\/)?apps\/([^/]+)\//);
    return m?.[1] ?? null;
}

function isTypeFromThisApp(type: string, appNumericId?: string, appHandle?: string, fallbackHandles: string[] = []): boolean {
    if (!type) return false;

    const slug = extractAppSlugFromType(type); // e.g. "video-app"
    const baseHandle = appHandle ? appHandle.replace(/-\d+$/, "") : undefined;

    // direct matches
    if (appNumericId && (type.includes(`apps/${appNumericId}/`) || type.includes(`shopify://apps/${appNumericId}/`))) {
        return true;
    }
    if (slug) {
        if (appHandle && slug === appHandle) return true;
        if (baseHandle && slug === baseHandle) return true;
        if (fallbackHandles.includes(slug)) return true;
    }
    return false;
}
export async function fetchShopify(session: AdminApiSession, path: string) {
    if (!session.accessToken) throw new Error("Missing accessToken in session");

    const url = `https://${session.shop}/admin/api/2025-10${path}`;
    const res = await fetch(url, {
        headers: {
            "X-Shopify-Access-Token": session.accessToken,
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) throw new Error(`[shopify-fetch] ${res.status} ${res.statusText}: ${path}`);
    return res.json();
}

export async function getMainThemeId(session: AdminApiSession): Promise<string | null> {
    const data = await fetchShopify(session, "/themes.json");
    const main = data.themes.find((t: any) => t.role === "main" || t.role === "MAIN");
    return main ? String(main.id) : null;
}

export async function getPublishedPlacementsFromTheme(
    session: AdminApiSession,
    opts: { appNumericId?: string; appHandle?: string; fallbackHandles?: string[] },
): Promise<{ allPlacements: Set<string>; visiblePlacements: Set<string> }> {
    const allPlacements = new Set<string>();
    const visiblePlacements = new Set<string>();

    const themeId = await getMainThemeId(session);
    if (!themeId) return { allPlacements, visiblePlacements };

    const assetsData = await fetchShopify(session, `/themes/${themeId}/assets.json?fields=key`);
    const keys: string[] = assetsData.assets.map((a: any) => a.key);
    const templateKeys = keys.filter(isTargetTemplateKey);

    for (const key of templateKeys) {
        try {
            const assetData = await fetchShopify(session, `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
            const raw = assetData?.asset?.value;
            if (!raw) continue;

            let json: any;
            try {
                json = JSON.parse(raw);
            } catch {
                console.warn("[theme-check] Failed to parse:", key);
                continue;
            }

            const stack: any[] = [json];
            while (stack.length) {
                const node = stack.pop();
                if (node && typeof node === "object") {
                    if (typeof node.type === "string") {
                        const belongs = isTypeFromThisApp(node.type, opts.appNumericId, opts.appHandle, opts.fallbackHandles ?? []);
                        const visible = isVisible(node);

                        // console.log(`[theme-check] Key=${key} type=${node.type} belongs=${belongs} visible=${visible} disabled=${node.disabled}`);

                        if (belongs) {
                            const rawPlacement = node?.settings?.placement ?? node?.settings?.slot ?? node?.settings?.position ?? null;

                            const placement = normalizePlacement(rawPlacement, key);

                            allPlacements.add(placement);

                            if (visible) {
                                visiblePlacements.add(placement);
                            }
                        }
                    }
                    for (const v of Object.values(node)) if (v && typeof v === "object") stack.push(v);
                }
            }
        } catch (err) {
            console.warn("[theme-check] Failed to scan asset:", key, err);
        }
    }

    return { allPlacements, visiblePlacements };
}
