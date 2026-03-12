import React, { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CoinGeckoTokenData, TimePeriod, getChangeForPeriod, fetchBinanceKlines } from '@/lib/coinGeckoService';

interface BubbleDetailPopupProps {
    ticker: string;
    name: string;
    price: number;
    change: number;
    volume: number;
    marketCap: number;
    score: number;
    cgData?: CoinGeckoTokenData;
    onClose: () => void;
    language: string;
}

// ─── Mini Sparkline Chart ────────────────────────────────────
const MiniChart: React.FC<{ ticker: string }> = ({ ticker }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [chartData, setChartData] = useState<{ time: number; close: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const data = await fetchBinanceKlines(ticker, '1h', 168);
            if (!cancelled && data.length > 0) {
                setChartData(data);
            }
            setLoading(false);
        })();
        return () => { cancelled = true; };
    }, [ticker]);

    useEffect(() => {
        if (!canvasRef.current || chartData.length === 0) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const prices = chartData.map(d => d.close);
        const minP = Math.min(...prices);
        const maxP = Math.max(...prices);
        const range = maxP - minP || 1;

        // Find high/low indices
        let highIdx = 0, lowIdx = 0;
        for (let i = 1; i < prices.length; i++) {
            if (prices[i] > prices[highIdx]) highIdx = i;
            if (prices[i] < prices[lowIdx]) lowIdx = i;
        }

        const pad = { top: 20, bottom: 20, left: 4, right: 4 };
        const chartW = w - pad.left - pad.right;
        const chartH = h - pad.top - pad.bottom;

        const toX = (i: number) => pad.left + (i / (prices.length - 1)) * chartW;
        const toY = (p: number) => pad.top + (1 - (p - minP) / range) * chartH;

        // Determine color by overall trend
        const isUp = prices[prices.length - 1] >= prices[0];
        const lineColor = isUp ? '#22c55e' : '#ef4444';
        const gradColor = isUp ? 'rgba(34,197,94,' : 'rgba(239,68,68,';

        ctx.clearRect(0, 0, w, h);

        // Gradient fill
        ctx.beginPath();
        ctx.moveTo(toX(0), toY(prices[0]));
        for (let i = 1; i < prices.length; i++) {
            ctx.lineTo(toX(i), toY(prices[i]));
        }
        ctx.lineTo(toX(prices.length - 1), h);
        ctx.lineTo(toX(0), h);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, pad.top, 0, h);
        grad.addColorStop(0, gradColor + '0.3)');
        grad.addColorStop(1, gradColor + '0.02)');
        ctx.fillStyle = grad;
        ctx.fill();

        // Line
        ctx.beginPath();
        ctx.moveTo(toX(0), toY(prices[0]));
        for (let i = 1; i < prices.length; i++) {
            ctx.lineTo(toX(i), toY(prices[i]));
        }
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1.5;
        ctx.lineJoin = 'round';
        ctx.stroke();

        // High marker
        const hx = toX(highIdx), hy = toY(prices[highIdx]);
        ctx.beginPath();
        ctx.arc(hx, hy, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#22c55e';
        ctx.fill();
        ctx.font = 'bold 9px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#4ade80';
        ctx.textAlign = hx > w / 2 ? 'right' : 'left';
        ctx.fillText(`$${formatCompact(maxP)}`, hx > w / 2 ? hx - 6 : hx + 6, hy - 5);

        // Low marker
        const lx = toX(lowIdx), ly = toY(prices[lowIdx]);
        ctx.beginPath();
        ctx.arc(lx, ly, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.fillStyle = '#f87171';
        ctx.textAlign = lx > w / 2 ? 'right' : 'left';
        ctx.fillText(`$${formatCompact(minP)}`, lx > w / 2 ? lx - 6 : lx + 6, ly + 12);
    }, [chartData]);

    if (loading) {
        return (
            <div className="h-[130px] flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (chartData.length === 0) {
        return (
            <div className="h-[130px] flex items-center justify-center text-xs text-muted-foreground">
                Gráfico indisponível
            </div>
        );
    }

    return (
        <canvas
            ref={canvasRef}
            className="w-full"
            style={{ height: 130 }}
        />
    );
};

// ─── Format helpers ──────────────────────────────────────────
function formatCompact(n: number): string {
    if (n >= 1) return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return n.toFixed(6);
}

function formatMoney(n: number): string {
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
    return `$${n.toFixed(2)}`;
}

function formatPrice(price: number): string {
    if (price >= 1) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(8)}`;
}

// ─── Change Badge ────────────────────────────────────────────
const ChangeBadge: React.FC<{ value: number | null; label: string; isActive?: boolean }> = ({ value, label, isActive }) => {
    const v = value ?? 0;
    return (
        <div className={cn(
            'flex-1 text-center py-1.5 rounded-lg transition-all',
            isActive && 'bg-primary/20 ring-1 ring-primary/40'
        )}>
            <div className="text-[9px] text-muted-foreground font-medium">{label}</div>
            <div className={cn(
                'text-xs font-bold mt-0.5',
                v > 0 ? 'text-green-400' : v < 0 ? 'text-red-400' : 'text-muted-foreground'
            )}>
                {v > 0 ? '+' : ''}{v.toFixed(1)}%
            </div>
        </div>
    );
};

// ─── Main Popup Component ────────────────────────────────────
const BubbleDetailPopup: React.FC<BubbleDetailPopupProps> = ({
    ticker, name, price, change, volume, marketCap, score, cgData, onClose, language,
}) => {
    const logoUrl = cgData?.image || `https://assets.coincap.io/assets/icons/${ticker.toLowerCase()}@2x.png`;
    const rank = cgData?.market_cap_rank;
    const displayPrice = cgData?.current_price || price;
    const displayVolume = cgData?.total_volume || volume;
    const displayMcap = cgData?.market_cap || marketCap;

    const change1h = cgData?.price_change_percentage_1h_in_currency ?? null;
    const change24h = cgData?.price_change_percentage_24h_in_currency ?? change;
    const change7d = cgData?.price_change_percentage_7d_in_currency ?? null;
    const change30d = cgData?.price_change_percentage_30d_in_currency ?? null;
    const change1y = cgData?.price_change_percentage_1y_in_currency ?? null;

    const pt = language === 'pt';

    return (
        <div className="absolute top-3 right-3 w-[290px] bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden z-30 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between px-3 pt-3 pb-2">
                <div className="flex items-center gap-2.5">
                    <img
                        src={logoUrl}
                        alt={ticker}
                        className="w-8 h-8 rounded-full bg-muted"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div>
                        <div className="font-bold text-sm leading-tight">{ticker}</div>
                        <div className="text-[10px] text-muted-foreground">{name}</div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted/50 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Links Row */}
            <div className="flex items-center gap-4 px-3 pb-2 text-[10px]">
                <div>
                    <div className="text-muted-foreground mb-1">{pt ? 'Ligações' : 'Links'}</div>
                    <div className="flex items-center gap-1.5">
                        <a href={`https://www.coingecko.com/en/coins/${cgData?.id || ticker.toLowerCase()}`} target="_blank" rel="noopener noreferrer"
                            className="w-5 h-5 rounded-full bg-[#8DC63F]/20 flex items-center justify-center hover:bg-[#8DC63F]/40 transition-colors" title="CoinGecko">
                            <span className="text-[8px] font-bold text-[#8DC63F]">CG</span>
                        </a>
                        <a href={`https://coinmarketcap.com/currencies/${cgData?.id || name.toLowerCase().replace(/\s+/g, '-')}/`} target="_blank" rel="noopener noreferrer"
                            className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center hover:bg-blue-500/40 transition-colors" title="CoinMarketCap">
                            <span className="text-[8px] font-bold text-blue-400">CM</span>
                        </a>
                        <a href={`https://www.tradingview.com/chart/?symbol=BINANCE:${ticker}USDT`} target="_blank" rel="noopener noreferrer"
                            className="w-5 h-5 rounded-full bg-[#2962FF]/20 flex items-center justify-center hover:bg-[#2962FF]/40 transition-colors" title="TradingView">
                            <span className="text-[8px] font-bold text-[#2962FF]">TV</span>
                        </a>
                    </div>
                </div>
                <div>
                    <div className="text-muted-foreground mb-1">{pt ? 'Negociar' : 'Trade'}</div>
                    <div className="flex items-center gap-1.5">
                        <a href="https://www.binance.com/register?ref=1221295078" target="_blank" rel="noopener noreferrer"
                            className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center hover:bg-yellow-500/40 transition-colors" title="Binance">
                            <span className="text-[8px] font-bold text-yellow-400">BN</span>
                        </a>
                        <a href="https://partner.bybit.com/b/155513" target="_blank" rel="noopener noreferrer"
                            className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center hover:bg-orange-500/40 transition-colors" title="Bybit">
                            <span className="text-[8px] font-bold text-orange-400">BB</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Price Row */}
            <div className="px-3 py-1.5 flex items-baseline gap-2">
                <div className="text-lg font-bold">{name}</div>
                <div className="text-sm text-muted-foreground">=</div>
                <div className="text-lg font-bold text-primary">{formatPrice(displayPrice)}</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-px bg-border/10 mx-3 mb-2 rounded-lg overflow-hidden text-[11px]">
                {rank && (
                    <div className="bg-card/80 p-2">
                        <div className="text-muted-foreground text-[9px]">{pt ? 'Posição' : 'Rank'}</div>
                        <div className="font-bold flex items-center gap-0.5">
                            {change24h >= 0 ? (
                                <TrendingUp className="w-2.5 h-2.5 text-green-400" />
                            ) : (
                                <TrendingDown className="w-2.5 h-2.5 text-red-400" />
                            )}
                            #{rank}
                        </div>
                    </div>
                )}
                <div className="bg-card/80 p-2">
                    <div className="text-muted-foreground text-[9px]">Cap de Mercado</div>
                    <div className="font-bold">{formatMoney(displayMcap)}</div>
                </div>
                <div className="bg-card/80 p-2">
                    <div className="text-muted-foreground text-[9px]">Volume 24h</div>
                    <div className="font-bold">{formatMoney(displayVolume)}</div>
                </div>
            </div>

            {/* Mini Chart */}
            <div className="mx-3 mb-2 rounded-lg bg-background/50 overflow-hidden border border-border/30">
                <MiniChart ticker={ticker} />
            </div>

            {/* Time Period Changes */}
            <div className="flex items-stretch gap-1 mx-3 mb-3 bg-muted/30 rounded-lg p-1">
                <ChangeBadge value={change1h} label={pt ? 'Hora' : '1h'} />
                <ChangeBadge value={change24h} label={pt ? 'Dia' : '24h'} isActive />
                <ChangeBadge value={change7d} label={pt ? 'Semana' : '7d'} />
                <ChangeBadge value={change30d} label={pt ? 'Mês' : '30d'} />
                <ChangeBadge value={change1y} label={pt ? 'Ano' : '1y'} />
            </div>
        </div>
    );
};

export default BubbleDetailPopup;
