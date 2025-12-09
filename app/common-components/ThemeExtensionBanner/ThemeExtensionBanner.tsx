import { Banner, Text, Button, Page } from "@shopify/polaris";
import { useEffect, useRef, useState } from "react";

import "./ThemeExtensionBanner.css";
import {useFetcher} from "react-router";

const MAX_ATTEMPTS = 8;
const MAX_DELAY = 30000;

interface ThemeExtensionBannerProps {
    shop: string;
    themeExtensionActivated: boolean;
    infoBannerHide: boolean;
    apiKey: string;
}

export default function ThemeExtensionBanner({ shop, themeExtensionActivated, infoBannerHide, apiKey }: ThemeExtensionBannerProps) {
    const [showBanner, setShowBanner] = useState(false);
    const [appActivated, setAppActivated] = useState(false);
    const [refetchStatus, setRefetchStatus] = useState(false);
    const attemptRef = useRef(0);
    const timerRef = useRef<number | null>(null);

    const fetcher = useFetcher<{ data: { ok?: boolean; themeExtensionActivated: boolean; infoBannerHide?: boolean } }>();

    const onClickClose = () => {
        if (appActivated) {
            fetcher.submit(
                { infoBannerHide: true },
                {
                    method: "post",
                    action: `/api/check-app-embed`,
                    encType: "application/json",
                },
            );
        }

        setShowBanner(false);
    };

    const clearTimer = () => {
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    useEffect(() => {
        return () => clearTimer();
    }, []);

    useEffect(() => {
        if (!refetchStatus || appActivated) return;

        if (fetcher.data?.data?.ok && fetcher.data.data.themeExtensionActivated) {
            setAppActivated(true);
            setRefetchStatus(false);
            attemptRef.current = 0;
            clearTimer();
            return;
        }

        if (attemptRef.current >= MAX_ATTEMPTS) {
            setRefetchStatus(false);
            clearTimer();
            return;
        }

        if (fetcher.state !== "idle") return;

        const delay = Math.min(2000 * Math.pow(2, attemptRef.current), MAX_DELAY);

        timerRef.current = window.setTimeout(() => {
            attemptRef.current += 1;
            fetcher.submit(
                {},
                {
                    method: "post",
                    action: `/api/check-app-embed`,
                    encType: "application/json",
                },
            );
        }, delay);

        return () => clearTimer();
    }, [refetchStatus, appActivated, fetcher.state, fetcher.data, fetcher]);

    useEffect(() => {
        if (themeExtensionActivated && infoBannerHide) setShowBanner(false);
        else setShowBanner(true);

        setAppActivated(themeExtensionActivated);
    }, [themeExtensionActivated, infoBannerHide]);

    return (
        <>
            {showBanner ? (
                <Page>
                    {appActivated ? (
                        <Banner tone="success" title="Gift App is enabled for live theme" onDismiss={onClickClose}>
                            <Text as="span">Gift App App Embed is Enabled. Now you can add offers on app.</Text>
                        </Banner>
                    ) : (
                        <Banner tone="warning" title="Gift App is not acivated yet" onDismiss={onClickClose}>
                            <Text as="span">Click “Activate” button below and then “Save” in the next page.</Text>
                            <div style={{ marginTop: 16 }}>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        setRefetchStatus(true);
                                        window.open(`https://${shop}/admin/themes/current/editor?context=apps&activateAppId=${apiKey}/embed`, "_blank");
                                    }}
                                >
                                    Activate
                                </Button>
                            </div>
                        </Banner>
                    )}
                </Page>
            ) : null}
        </>
    );
}
