import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ExchangeFloatingBar } from '@/components/ExchangeReferral';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimePrices } from '@/lib/realtimeService';
import { useCoinGeckoData, getChangeForPeriod, type TimePeriod } from '@/lib/coinGeckoService';
import { Maximize2, Minimize2, Plus, Minus, RotateCcw, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import BubbleDetailPopup from '@/components/bubbles/BubbleDetailPopup';

// ─── Types ──────────────────────────────────────────────────────
interface TokenData {
    id: string; ticker: string; name: string; price: number;
    change: number; volume: number; marketCap: number; score: number;
}
interface Bubble extends TokenData {
    x: number; y: number; vx: number; vy: number; r: number; targetR: number;
}

// ─── Visual helpers ─────────────────────────────────────────────
function getGradientColors(change: number): [string, string] {
    if (change >= 10) return ['rgba(34,230,118,0.50)', 'rgba(16,185,90,0.12)'];
    if (change >= 5) return ['rgba(34,197,94,0.42)', 'rgba(16,150,72,0.10)'];
    if (change >= 2) return ['rgba(74,222,128,0.32)', 'rgba(34,120,60,0.07)'];
    if (change >= 0) return ['rgba(22,101,52,0.28)', 'rgba(10,60,30,0.06)'];
    if (change >= -2) return ['rgba(153,27,27,0.28)', 'rgba(100,15,15,0.06)'];
    if (change >= -5) return ['rgba(220,60,60,0.38)', 'rgba(150,30,30,0.08)'];
    if (change >= -10) return ['rgba(239,68,68,0.42)', 'rgba(185,28,28,0.10)'];
    return ['rgba(220,38,38,0.50)', 'rgba(160,20,20,0.12)'];
}
function getBorderColor(c: number): string {
    if (c >= 5) return 'rgba(34,197,94,0.8)';
    if (c >= 0) return 'rgba(21,128,61,0.5)';
    if (c >= -5) return 'rgba(153,27,27,0.5)';
    return 'rgba(220,38,38,0.8)';
}
const chgColor = (c: number) => c >= 0 ? '#4ade80' : '#f87171';

// ─── Component ──────────────────────────────────────────────────
const BubblesPage = () => {
    const { language } = useLanguage();
    const pt = language === 'pt';

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const bubblesRef = useRef<Bubble[]>([]);
    const animFrameRef = useRef(0);
    const sizeRef = useRef({ width: 1200, height: 700 });
    const logoCache = useRef<Map<string, HTMLImageElement | null>>(new Map());

    // Camera
    const camRef = useRef({ x: 0, y: 0, scale: 1 });
    // Interaction
    const intRef = useRef({
        mode: 'none' as 'none' | 'drag' | 'pan' | 'pinch',
        bubble: null as Bubble | null,
        ox: 0, oy: 0, sx: 0, sy: 0, camSx: 0, camSy: 0,
        pinchDist0: 0, pinchScale0: 1, pinchMx: 0, pinchMy: 0,
        moved: false,
    });

    const [tokens, setTokens] = useState<TokenData[]>([]);
    const [search, setSearch] = useState('');
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('24h');
    const [dims, setDims] = useState({ width: 1200, height: 700 });
    const [selToken, setSelToken] = useState<Bubble | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const [zoom, setZoom] = useState(1);

    const { getTokenData: getCGData } = useCoinGeckoData();
    useEffect(() => { sizeRef.current = dims; }, [dims]);

    // ─── Logos ───────────────────────────────────────────────────
    useEffect(() => {
        tokens.forEach(t => {
            if (logoCache.current.has(t.ticker)) return;
            const cgd = getCGData(t.ticker);
            const url = cgd?.image || `https://assets.coincap.io/assets/icons/${t.ticker.toLowerCase()}@2x.png`;
            const img = new Image();
            // Removed crossOrigin to prevent CORS blocking from rendering the image
            img.src = url;
            img.onload = () => logoCache.current.set(t.ticker, img);
            img.onerror = () => logoCache.current.set(t.ticker, null);
        });
    }, [tokens, getCGData]);

    // ─── Fetch ──────────────────────────────────────────────────
    // Known stablecoins / wrapped / junk to exclude
    const EXCLUDED = useMemo(() => new Set([
        'USDT', 'USDC', 'BUSD', 'DAI', 'TUSD', 'USDP', 'USDD', 'FDUSD', 'PYUSD',
        'USDE', 'XUSD', 'RLUSD', 'BFUSD', 'PAXG', 'WBTC', 'WBETH', 'WETH',
    ]), []);

    useEffect(() => {
        (async () => {
            const { data } = await supabase.from('tokens')
                .select('id, ticker, name, current_price, change_24h, volume_24h, market_cap, score')
                .not('current_price', 'is', null)
                .order('market_cap', { ascending: false, nullsFirst: false });
            if (data) setTokens(data
                .filter(t => !EXCLUDED.has(t.ticker))
                .map(t => ({
                    id: t.id, ticker: t.ticker, name: t.name || t.ticker,
                    price: t.current_price || 0, change: t.change_24h || 0,
                    volume: t.volume_24h || 0, marketCap: t.market_cap || 0, score: t.score || 0,
                })));
        })();
    }, [EXCLUDED]);

    // ─── Live data ──────────────────────────────────────────────
    const symbols = useMemo(() => tokens.map(t => t.ticker), [tokens]);
    const { getPrice, isConnected } = useRealtimePrices(symbols);

    const liveTokens = useMemo(() => tokens.map(t => {
        const rt = getPrice(t.ticker);
        const cgd = getCGData(t.ticker);
        const price = rt?.price || t.price;
        let change = t.change;
        if (timePeriod === '24h') change = rt?.change24h ?? t.change;
        else if (cgd) change = getChangeForPeriod(cgd, timePeriod);
        return { ...t, price, change };
    }), [tokens, getPrice, getCGData, timePeriod]);

    const filtered = useMemo(() => {
        const s = search.toUpperCase();
        return liveTokens.filter(t => !search || t.ticker.includes(s) || t.name.toUpperCase().includes(s));
    }, [liveTokens, search]);

    const stats = useMemo(() => {
        if (!liveTokens.length) return { bull: 0, bear: 0, total: 0, gainer: null as TokenData | null, loser: null as TokenData | null };
        return {
            bull: liveTokens.filter(t => t.change > 0).length,
            bear: liveTokens.filter(t => t.change < 0).length,
            total: liveTokens.length,
            gainer: liveTokens.reduce((a, b) => a.change > b.change ? a : b),
            loser: liveTokens.reduce((a, b) => a.change < b.change ? a : b),
        };
    }, [liveTokens]);

    // ─── Resize ─────────────────────────────────────────────────
    useEffect(() => {
        if (!containerRef.current) return;
        const obs = new ResizeObserver(e => {
            const { width: w, height: h } = e[0].contentRect;
            if (w > 0 && h > 0) setDims({ width: Math.floor(w), height: Math.floor(h) });
        });
        obs.observe(containerRef.current);
        return () => obs.disconnect();
    }, []);

    // ─── Radii (%-change based — bigger movers = bigger bubbles) ─
    const radiiMap = useMemo(() => {
        const { width: w, height: h } = dims;
        if (!filtered.length || !w) return new Map<string, number>();
        const mob = w < 640;
        const minR = mob ? 18 : 14, maxR = Math.min(w, h) / (mob ? 3 : 3.5);
        const values = filtered.map(t => Math.abs(t.change) + 0.5);
        const maxVal = Math.max(...values, 1);
        const rawRadii = values.map(v => Math.sqrt(v / maxVal));
        const rawAreaSum = rawRadii.reduce((s, r) => s + Math.PI * r * r, 0);
        const targetArea = w * h * 0.52;
        const scale = rawAreaSum > 0 ? Math.sqrt(targetArea / rawAreaSum) : 1;
        const map = new Map<string, number>();
        filtered.forEach((t, i) => map.set(t.ticker, Math.max(minR, Math.min(maxR, rawRadii[i] * scale))));
        return map;
    }, [filtered, dims]);

    // ─── Init / update bubbles ──────────────────────────────────
    useEffect(() => {
        const { width: w, height: h } = dims;
        if (!filtered.length || !w || !radiiMap.size) return;
        const old = new Map(bubblesRef.current.map(b => [b.ticker, b]));
        bubblesRef.current = filtered.map(t => {
            const tR = radiiMap.get(t.ticker) || 16;
            const ex = old.get(t.ticker);
            if (ex) { ex.price = t.price; ex.change = t.change; ex.volume = t.volume; ex.marketCap = t.marketCap; ex.score = t.score; ex.targetR = tR; return ex; }
            return { ...t, x: Math.random() * (w - tR * 2) + tR, y: Math.random() * (h - tR * 2) + tR, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, r: tR * .1, targetR: tR };
        });
    }, [filtered, dims, radiiMap]);

    // ─── Helpers ────────────────────────────────────────────────
    const toCanvas = useCallback((cx: number, cy: number) => {
        const c = canvasRef.current; if (!c) return { x: 0, y: 0 };
        const r = c.getBoundingClientRect();
        return { x: cx - r.left, y: cy - r.top };
    }, []);
    const toWorld = useCallback((sx: number, sy: number) => {
        const c = camRef.current;
        return { x: (sx - c.x) / c.scale, y: (sy - c.y) / c.scale };
    }, []);
    const hitTest = useCallback((wx: number, wy: number): Bubble | null => {
        for (const b of [...bubblesRef.current].sort((a, b) => a.r - b.r)) {
            const dx = wx - b.x, dy = wy - b.y;
            if (dx * dx + dy * dy <= b.r * b.r) return b;
        }
        return null;
    }, []);

    // ─── Physics & Render ───────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        let run = true, lW = 0, lH = 0, dpr = 1, glow = 0;

        const setup = (w: number, h: number) => {
            dpr = window.devicePixelRatio || 1;
            canvas.width = w * dpr; canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            lW = w; lH = h;
        };

        const loop = () => {
            if (!run) return;
            animFrameRef.current = requestAnimationFrame(loop);
            const { width: w, height: h } = sizeRef.current;
            if (w !== lW || h !== lH) setup(w, h);
            const bubs = bubblesRef.current, cam = camRef.current, it = intRef.current;
            glow += 0.025;

            // Dynamic world bounds — expand when zoomed out so bubbles fill visible area
            const zoomClamp = Math.min(cam.scale, 1);
            const worldW = w / zoomClamp, worldH = h / zoomClamp;
            const wx0 = (w - worldW) / 2, wy0 = (h - worldH) / 2;

            // Physics
            for (const b of bubs) {
                b.r += (b.targetR - b.r) * 0.08;
                if (it.mode === 'drag' && it.bubble === b) continue;
                b.x += b.vx; b.y += b.vy;
                b.vx *= 0.985; b.vy *= 0.985;
                b.vx += (Math.random() - .5) * .008; b.vy += (Math.random() - .5) * .008;
                if (b.x - b.r < wx0) { b.x = wx0 + b.r; b.vx = Math.abs(b.vx) * .5; }
                if (b.x + b.r > wx0 + worldW) { b.x = wx0 + worldW - b.r; b.vx = -Math.abs(b.vx) * .5; }
                if (b.y - b.r < wy0) { b.y = wy0 + b.r; b.vy = Math.abs(b.vy) * .5; }
                if (b.y + b.r > wy0 + worldH) { b.y = wy0 + worldH - b.r; b.vy = -Math.abs(b.vy) * .5; }
            }
            // Collisions
            const lim = Math.min(bubs.length, 300);
            for (let iter = 0; iter < 5; iter++) {
                for (let i = 0; i < lim; i++) for (let j = i + 1; j < lim; j++) {
                    const a = bubs[i], b = bubs[j];
                    const dx = b.x - a.x, dy = b.y - a.y, md = a.r + b.r + 3;
                    if (Math.abs(dx) > md || Math.abs(dy) > md) continue;
                    const d2 = dx * dx + dy * dy;
                    if (d2 >= md * md || d2 === 0) continue;
                    const d = Math.sqrt(d2), ol = md - d, nx = dx / d, ny = dy / d, sep = ol * .55;
                    const dA = it.mode === 'drag' && it.bubble === a, dB = it.mode === 'drag' && it.bubble === b;
                    if (!dA) { a.x -= nx * sep; a.y -= ny * sep; }
                    if (!dB) { b.x += nx * sep; b.y += ny * sep; }
                    if (iter === 0) {
                        const dvn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
                        if (dvn > 0) {
                            const mA = a.r * a.r, mB = b.r * b.r, mt = mA + mB, imp = dvn * .8;
                            if (!dA) { a.vx -= imp * mB / mt * nx; a.vy -= imp * mB / mt * ny; }
                            if (!dB) { b.vx += imp * mA / mt * nx; b.vy += imp * mA / mt * ny; }
                        }
                    }
                }
            }
            for (const b of bubs) { b.vx = Math.max(-2.5, Math.min(2.5, b.vx)); b.vy = Math.max(-2.5, Math.min(2.5, b.vy)); }

            // ── Render ──
            ctx.clearRect(0, 0, w, h);

            // Grid
            const gs = 60 * cam.scale;
            ctx.strokeStyle = 'rgba(255,255,255,0.018)'; ctx.lineWidth = .5;
            ctx.beginPath();
            for (let x = cam.x % gs; x < w; x += gs) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
            for (let y = cam.y % gs; y < h; y += gs) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
            ctx.stroke();

            ctx.save(); ctx.translate(cam.x, cam.y); ctx.scale(cam.scale, cam.scale);

            const sorted = [...bubs].sort((a, b) => b.r - a.r);
            for (const b of sorted) {
                // Frustum cull
                const sx = b.x * cam.scale + cam.x, sy = b.y * cam.scale + cam.y, sr = b.r * cam.scale;
                if (sx + sr < -30 || sx - sr > w + 30 || sy + sr < -30 || sy - sr > h + 30) continue;

                const isSel = selToken?.ticker === b.ticker;
                const screenR = sr;

                // Glow
                if (Math.abs(b.change) >= 8) {
                    const gi = .15 + Math.sin(glow + b.x * .01) * .08;
                    const gr = b.r + 8 + Math.sin(glow * 1.5) * 3;
                    const gg = ctx.createRadialGradient(b.x, b.y, b.r * .8, b.x, b.y, gr);
                    gg.addColorStop(0, b.change >= 0 ? `rgba(34,197,94,${gi})` : `rgba(239,68,68,${gi})`);
                    gg.addColorStop(1, 'transparent');
                    ctx.beginPath(); ctx.arc(b.x, b.y, gr, 0, 2 * Math.PI); ctx.fillStyle = gg; ctx.fill();
                }

                // Gradient fill
                const [ic, oc] = getGradientColors(b.change);
                const g = ctx.createRadialGradient(b.x - b.r * .2, b.y - b.r * .25, 0, b.x, b.y, b.r);
                g.addColorStop(0, ic); g.addColorStop(1, oc);
                ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
                ctx.fillStyle = g; ctx.fill();
                ctx.strokeStyle = isSel ? '#f59e0b' : getBorderColor(b.change);
                ctx.lineWidth = isSel ? 2.5 : 1.2; ctx.stroke();

                // Glass highlight
                if (b.r >= 16) {
                    const hl = ctx.createRadialGradient(b.x - b.r * .15, b.y - b.r * .3, 0, b.x, b.y, b.r * .7);
                    hl.addColorStop(0, 'rgba(255,255,255,0.07)'); hl.addColorStop(1, 'transparent');
                    ctx.beginPath(); ctx.arc(b.x, b.y, b.r * .7, 0, 2 * Math.PI); ctx.fillStyle = hl; ctx.fill();
                }

                // Content — use world radius (b.r) so logos always appear regardless of zoom
                const logo = logoCache.current.get(b.ticker);
                if (logo && b.r >= 16) {
                    ctx.save();
                    const lr = Math.min(b.r * .35, 20), ly = b.r >= 28 ? b.y - b.r * .2 : b.y - b.r * .1;
                    ctx.beginPath(); ctx.arc(b.x, ly, lr, 0, 2 * Math.PI); ctx.clip();
                    ctx.drawImage(logo, b.x - lr, ly - lr, lr * 2, lr * 2); ctx.restore();
                    if (b.r >= 22) {
                        const ts = Math.max(7, Math.min(b.r * .24, 15));
                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                        ctx.font = `bold ${ts}px Inter,system-ui,sans-serif`; ctx.fillStyle = '#e2e8f0';
                        ctx.fillText(b.ticker, b.x, b.y + b.r * .26);
                        const cs = Math.max(5, Math.min(b.r * .19, 12));
                        ctx.font = `600 ${cs}px Inter,system-ui,sans-serif`; ctx.fillStyle = chgColor(b.change);
                        ctx.fillText(`${b.change >= 0 ? '+' : ''}${b.change.toFixed(1)}%`, b.x, b.y + b.r * .50);
                    }
                } else if (b.r >= 10) {
                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    if (b.r >= 18) {
                        const ts = Math.max(7, Math.min(b.r * .35, 18));
                        ctx.font = `bold ${ts}px Inter,system-ui,sans-serif`; ctx.fillStyle = '#e2e8f0';
                        ctx.fillText(b.ticker, b.x, b.y - ts * .35);
                        ctx.font = `600 ${Math.max(6, b.r * .26)}px Inter,system-ui,sans-serif`; ctx.fillStyle = chgColor(b.change);
                        ctx.fillText(`${b.change >= 0 ? '+' : ''}${b.change.toFixed(1)}%`, b.x, b.y + ts * .5);
                    } else {
                        ctx.font = `bold ${Math.max(6, b.r * .35)}px Inter,system-ui,sans-serif`; ctx.fillStyle = '#e2e8f0';
                        ctx.fillText(b.ticker, b.x, b.y);
                    }
                }
            }
            ctx.restore();
        };
        animFrameRef.current = requestAnimationFrame(loop);
        return () => { run = false; cancelAnimationFrame(animFrameRef.current); };
    }, [selToken]);

    // ─── Mouse ──────────────────────────────────────────────────
    const onMD = useCallback((e: React.MouseEvent) => {
        const sp = toCanvas(e.clientX, e.clientY), wp = toWorld(sp.x, sp.y);
        const bub = hitTest(wp.x, wp.y);
        const i = intRef.current;
        if (bub) { i.mode = 'drag'; i.bubble = bub; i.ox = wp.x - bub.x; i.oy = wp.y - bub.y; bub.vx = 0; bub.vy = 0; }
        else { i.mode = 'pan'; i.camSx = camRef.current.x; i.camSy = camRef.current.y; }
        i.sx = sp.x; i.sy = sp.y; i.moved = false;
    }, [toCanvas, toWorld, hitTest]);

    const onMM = useCallback((e: React.MouseEvent) => {
        const i = intRef.current, sp = toCanvas(e.clientX, e.clientY);
        if (i.mode === 'drag' && i.bubble) {
            const wp = toWorld(sp.x, sp.y), px = i.bubble.x, py = i.bubble.y;
            i.bubble.x = wp.x - i.ox; i.bubble.y = wp.y - i.oy;
            i.bubble.vx = (i.bubble.x - px) * .3; i.bubble.vy = (i.bubble.y - py) * .3;
            i.moved = true;
        } else if (i.mode === 'pan') {
            const dx = sp.x - i.sx, dy = sp.y - i.sy;
            if (Math.abs(dx) > 2 || Math.abs(dy) > 2) i.moved = true;
            camRef.current.x = i.camSx + dx; camRef.current.y = i.camSy + dy;
        }
        const canvas = canvasRef.current;
        if (canvas) {
            if (i.mode === 'drag') canvas.style.cursor = 'grabbing';
            else if (i.mode === 'pan' && i.moved) canvas.style.cursor = 'grabbing';
            else { const wp = toWorld(sp.x, sp.y); canvas.style.cursor = hitTest(wp.x, wp.y) ? 'grab' : 'default'; }
        }
    }, [toCanvas, toWorld, hitTest]);

    const onMU = useCallback(() => {
        const i = intRef.current;
        const clicked = i.bubble;
        if (!i.moved && i.mode === 'drag' && clicked) setSelToken(p => p?.ticker === clicked.ticker ? null : clicked);
        i.mode = 'none'; i.bubble = null;
    }, []);

    // ─── Touch ──────────────────────────────────────────────────
    const onTS = useCallback((e: React.TouchEvent) => {
        e.preventDefault(); const i = intRef.current;
        if (e.touches.length === 2) {
            const p1 = toCanvas(e.touches[0].clientX, e.touches[0].clientY);
            const p2 = toCanvas(e.touches[1].clientX, e.touches[1].clientY);
            i.mode = 'pinch'; i.pinchDist0 = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
            i.pinchScale0 = camRef.current.scale; i.pinchMx = (p1.x + p2.x) / 2; i.pinchMy = (p1.y + p2.y) / 2;
            i.camSx = camRef.current.x; i.camSy = camRef.current.y; i.moved = false;
        } else if (e.touches.length === 1) {
            const sp = toCanvas(e.touches[0].clientX, e.touches[0].clientY), wp = toWorld(sp.x, sp.y);
            const bub = hitTest(wp.x, wp.y);
            if (bub) { i.mode = 'drag'; i.bubble = bub; i.ox = wp.x - bub.x; i.oy = wp.y - bub.y; bub.vx = 0; bub.vy = 0; }
            else { i.mode = 'pan'; i.camSx = camRef.current.x; i.camSy = camRef.current.y; }
            i.sx = sp.x; i.sy = sp.y; i.moved = false;
        }
    }, [toCanvas, toWorld, hitTest]);

    const onTM = useCallback((e: React.TouchEvent) => {
        e.preventDefault(); const i = intRef.current;
        if (i.mode === 'pinch' && e.touches.length === 2) {
            const p1 = toCanvas(e.touches[0].clientX, e.touches[0].clientY);
            const p2 = toCanvas(e.touches[1].clientX, e.touches[1].clientY);
            const d = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
            const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
            const ns = Math.max(.3, Math.min(3, i.pinchScale0 * (d / i.pinchDist0)));
            const wm = (i.pinchMx - i.camSx) / i.pinchScale0, wmy = (i.pinchMy - i.camSy) / i.pinchScale0;
            camRef.current.scale = ns; camRef.current.x = mx - wm * ns; camRef.current.y = my - wmy * ns;
            setZoom(ns); i.moved = true;
        } else if (i.mode === 'drag' && i.bubble && e.touches.length === 1) {
            const sp = toCanvas(e.touches[0].clientX, e.touches[0].clientY), wp = toWorld(sp.x, sp.y);
            const px = i.bubble.x, py = i.bubble.y;
            i.bubble.x = wp.x - i.ox; i.bubble.y = wp.y - i.oy;
            i.bubble.vx = (i.bubble.x - px) * .3; i.bubble.vy = (i.bubble.y - py) * .3; i.moved = true;
        } else if (i.mode === 'pan' && e.touches.length === 1) {
            const sp = toCanvas(e.touches[0].clientX, e.touches[0].clientY);
            if (Math.abs(sp.x - i.sx) > 2 || Math.abs(sp.y - i.sy) > 2) i.moved = true;
            camRef.current.x = i.camSx + (sp.x - i.sx); camRef.current.y = i.camSy + (sp.y - i.sy);
        }
    }, [toCanvas, toWorld]);

    const onTE = useCallback(() => {
        const i = intRef.current;
        const clicked = i.bubble;
        if (!i.moved && i.mode === 'drag' && clicked) setSelToken(p => p?.ticker === clicked.ticker ? null : clicked);
        i.mode = 'none'; i.bubble = null;
    }, []);

    // ─── Wheel zoom ─────────────────────────────────────────────
    useEffect(() => {
        const c = canvasRef.current; if (!c) return;
        const h = (e: WheelEvent) => {
            e.preventDefault();
            const cam = camRef.current, r = c.getBoundingClientRect();
            const mx = e.clientX - r.left, my = e.clientY - r.top;
            const wx = (mx - cam.x) / cam.scale, wy = (my - cam.y) / cam.scale;
            const ns = Math.max(.3, Math.min(3, cam.scale * (e.deltaY < 0 ? 1.08 : .92)));
            cam.scale = ns; cam.x = mx - wx * ns; cam.y = my - wy * ns;
            setZoom(ns);
        };
        c.addEventListener('wheel', h, { passive: false });
        return () => c.removeEventListener('wheel', h);
    }, []);

    // ─── Fullscreen ESC ─────────────────────────────────────────
    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && fullscreen) setFullscreen(false); };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [fullscreen]);

    // ─── Zoom controls ──────────────────────────────────────────
    const zoomIn = () => { const c = camRef.current, cx = dims.width / 2, cy = dims.height / 2, wx = (cx - c.x) / c.scale, wy = (cy - c.y) / c.scale; const ns = Math.min(3, c.scale * 1.3); c.scale = ns; c.x = cx - wx * ns; c.y = cy - wy * ns; setZoom(ns); };
    const zoomOut = () => { const c = camRef.current, cx = dims.width / 2, cy = dims.height / 2, wx = (cx - c.x) / c.scale, wy = (cy - c.y) / c.scale; const ns = Math.max(.3, c.scale * .7); c.scale = ns; c.x = cx - wx * ns; c.y = cy - wy * ns; setZoom(ns); };
    const resetCam = () => { camRef.current = { x: 0, y: 0, scale: 1 }; setZoom(1); };

    const periods: { key: TimePeriod; label: string }[] = [
        { key: '1h', label: pt ? 'Hora' : '1h' }, { key: '24h', label: pt ? 'Dia' : '24h' },
        { key: '7d', label: pt ? 'Semana' : '7d' }, { key: '30d', label: pt ? 'Mês' : '30d' },
        { key: '1y', label: pt ? 'Ano' : '1y' },
    ];

    // ─── JSX ────────────────────────────────────────────────────
    return (
        <div className={cn(
            'flex flex-col animate-fade-in',
            fullscreen ? 'fixed inset-0 z-50 bg-[#050a12]' : 'h-[calc(100vh-8rem)] pb-12 sm:pb-0'
        )}>
            {/* Canvas */}
            <div ref={containerRef} className="flex-1 bg-[#050a12] overflow-hidden relative" style={{ minHeight: 300 }}>
                <canvas ref={canvasRef} className="w-full h-full" style={{ width: dims.width, height: dims.height, touchAction: 'none' }}
                    onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU}
                    onMouseLeave={() => { intRef.current.mode = 'none'; intRef.current.bubble = null; }}
                    onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}
                />

                {/* ─── HUD: Top Bar ──────────────────────────────── */}
                <div className="absolute top-0 inset-x-0 p-3 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-3 pointer-events-auto">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10">
                            <span className="text-base font-bold text-white">Bubble Gem</span>
                            <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', isConnected ? 'bg-emerald-400' : 'bg-yellow-500')} />
                            <span className="text-[10px] text-white/50">{stats.total} tokens</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-black/50 backdrop-blur-xl border border-white/10 text-xs">
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">{stats.bull}</span>
                            <span className="text-white/20 mx-0.5">|</span>
                            <TrendingDown className="w-3 h-3 text-red-400" />
                            <span className="text-red-400 font-semibold">{stats.bear}</span>
                        </div>
                        {stats.gainer && (
                            <span className="hidden md:inline px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                                🚀 {stats.gainer.ticker} +{stats.gainer.change.toFixed(1)}%
                            </span>
                        )}
                        {stats.loser && (
                            <span className="hidden md:inline px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
                                📉 {stats.loser.ticker} {stats.loser.change.toFixed(1)}%
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 pointer-events-auto">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                            <input value={search} onChange={e => setSearch(e.target.value)}
                                placeholder={pt ? 'Buscar...' : 'Search...'}
                                className="pl-7 pr-3 h-8 w-32 sm:w-40 text-xs rounded-lg bg-black/50 backdrop-blur-xl border border-white/10 text-white placeholder-white/30 outline-none focus:border-primary/50"
                            />
                        </div>
                        <button onClick={() => setFullscreen(!fullscreen)}
                            className="p-2 rounded-lg bg-black/50 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white transition-colors">
                            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* ─── HUD: Bottom Bar ───────────────────────────── */}
                <div className="absolute bottom-12 sm:bottom-0 inset-x-0 p-2 sm:p-3 flex items-end justify-between pointer-events-none gap-2">
                    {/* Time periods + legend stacked on mobile */}
                    <div className="flex flex-col gap-1.5 pointer-events-auto">
                        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-black/40 backdrop-blur-lg text-[8px] sm:text-[9px] text-white/40">
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 border border-emerald-600" />{pt ? 'Alta' : 'Up'}</span>
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500/40 border border-red-600" />{pt ? 'Baixa' : 'Down'}</span>
                        </div>
                        <div className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-1 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10">
                            {periods.map(p => (
                                <button key={p.key} onClick={() => setTimePeriod(p.key)}
                                    className={cn(
                                        'px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all',
                                        timePeriod === p.key
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                            : 'text-white/50 hover:text-white/80'
                                    )}>
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Zoom controls */}
                    <div className="flex flex-col gap-1 pointer-events-auto">
                        <button onClick={zoomIn} className="p-1.5 sm:p-2 rounded-lg bg-black/50 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white transition-colors">
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button onClick={resetCam} title={`${Math.round(zoom * 100)}%`}
                            className="px-1.5 sm:px-2 py-1 rounded-lg bg-black/50 backdrop-blur-xl border border-white/10 text-white/50 text-[9px] sm:text-[10px] font-mono text-center hover:text-white transition-colors">
                            {Math.round(zoom * 100)}%
                        </button>
                        <button onClick={zoomOut} className="p-1.5 sm:p-2 rounded-lg bg-black/50 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white transition-colors">
                            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                </div>

                {/* ─── Detail Popup ───────────────────────────────── */}
                {selToken && (
                    <BubbleDetailPopup
                        ticker={selToken.ticker} name={selToken.name} price={selToken.price}
                        change={selToken.change} volume={selToken.volume} marketCap={selToken.marketCap}
                        score={selToken.score} cgData={getCGData(selToken.ticker)}
                        onClose={() => setSelToken(null)} language={language}
                    />
                )}
            </div>

            <ExchangeFloatingBar />
        </div>
    );
};

export default BubblesPage;
