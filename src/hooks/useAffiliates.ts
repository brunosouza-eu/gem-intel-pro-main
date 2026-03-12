import { useState, useEffect } from 'react';

export interface AffiliateLinks {
    mexc: string;
    bybit: string;
    binance: string;
}

const DEFAULT_LINKS: AffiliateLinks = {
    mexc: 'https://www.mexc.com/pt-BR/acquisition/custom-sign-up?shareCode=mexc-3tNJW',
    bybit: 'https://www.bybit.com/register?affiliate_id=DEFAULT',
    binance: 'https://accounts.binance.com/register?ref=DEFAULT',
};

const STORAGE_KEY = 'gem_intel_affiliate_links';

export function useAffiliates() {
    const [links, setLinks] = useState<AffiliateLinks>(DEFAULT_LINKS);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setLinks({ ...DEFAULT_LINKS, ...JSON.parse(stored) });
            } catch (e) {
                console.error('Failed to parse affiliate links', e);
            }
        }
    }, []);

    const updateLink = (platform: keyof AffiliateLinks, url: string) => {
        const newLinks = { ...links, [platform]: url };
        setLinks(newLinks);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLinks));
    };

    const getReferralLink = (platform: keyof AffiliateLinks, symbol?: string) => {
        let baseUrl = links[platform];

        // Logic to append symbol if needed/supported by platform
        // This is basic, can be enhanced per platform
        if (!baseUrl) return '#';

        return baseUrl;
    };

    return {
        links,
        updateLink,
        getReferralLink
    };
}
