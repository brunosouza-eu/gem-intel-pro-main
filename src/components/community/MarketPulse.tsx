/**
 * 📊 Market Pulse — Live market context widget
 * Compact glassmorphism card showing BTC price + Fear & Greed
 */
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';

interface MarketData {
    btcPrice: number;
    btcChange: number;
    fearGreed: number;
    fearGreedLabel: string;
}

export function MarketPulse() {
    const [data, setData] = useState<MarketData | null>(null);

    useEffect(() => {
        fetchMarketData();
        const interval = setInterval(fetchMarketData, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    async function fetchMarketData() {
        try {
            const [btcRes, fngRes] = await Promise.all([
                fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT')
                    .then(r => r.json())
                    .catch(() => null),
                fetch('https://api.alternative.me/fng/?limit=1')
                    .then(r => r.json())
                    .catch(() => null),
            ]);

            if (btcRes) {
                const fng = fngRes?.data?.[0];
                const labels: Record<string, string> = {
                    'Extreme Fear': 'Medo Extremo', 'Fear': 'Medo', 'Neutral': 'Neutro',
                    'Greed': 'Ganância', 'Extreme Greed': 'Ganância Extrema'
                };
                setData({
                    btcPrice: parseFloat(btcRes.lastPrice),
                    btcChange: parseFloat(btcRes.priceChangePercent),
                    fearGreed: fng ? parseInt(fng.value) : 0,
                    fearGreedLabel: fng ? (labels[fng.value_classification] || fng.value_classification) : 'N/A',
                });
            }
        } catch { /* silent */ }
    }

    if (!data) return null;

    const isPositive = data.btcChange >= 0;
    const fgColor = data.fearGreed <= 25 ? 'text-red-400' :
        data.fearGreed <= 45 ? 'text-orange-400' :
            data.fearGreed <= 55 ? 'text-yellow-400' :
                data.fearGreed <= 75 ? 'text-emerald-400' : 'text-green-400';

    const fgBg = data.fearGreed <= 25 ? 'from-red-500/10 to-red-500/5' :
        data.fearGreed <= 45 ? 'from-orange-500/10 to-orange-500/5' :
            data.fearGreed <= 55 ? 'from-yellow-500/10 to-yellow-500/5' :
                data.fearGreed <= 75 ? 'from-emerald-500/10 to-emerald-500/5' : 'from-green-500/10 to-green-500/5';

    return (
        <div className={cn(
            "rounded-2xl p-4 border border-border/30",
            "bg-gradient-to-r from-card/80 via-card/60 to-card/80",
            "backdrop-blur-sm",
            "flex items-center justify-between gap-4 flex-wrap"
        )}>
            {/* BTC Price */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                    <span className="text-lg font-bold">₿</span>
                </div>
                <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Bitcoin</p>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold tabular-nums">
                            ${data.btcPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </span>
                        <span className={cn(
                            "flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md",
                            isPositive
                                ? "text-emerald-400 bg-emerald-500/10"
                                : "text-red-400 bg-red-500/10"
                        )}>
                            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {isPositive ? '+' : ''}{data.btcChange.toFixed(2)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="w-px h-10 bg-border/30 hidden sm:block" />

            {/* Fear & Greed */}
            <div className="flex items-center gap-3">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br",
                    fgBg
                )}>
                    <Activity className={cn("w-5 h-5", fgColor)} />
                </div>
                <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Fear & Greed</p>
                    <div className="flex items-center gap-2">
                        <span className={cn("text-lg font-bold", fgColor)}>{data.fearGreed}</span>
                        <span className="text-xs text-muted-foreground">{data.fearGreedLabel}</span>
                    </div>
                </div>
            </div>

            {/* Pulse animation */}
            <div className="flex items-center gap-1.5 ml-auto">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-muted-foreground">Live</span>
            </div>
        </div>
    );
}
