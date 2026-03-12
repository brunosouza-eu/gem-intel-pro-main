import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, LineData, Time, HistogramData, CrosshairMode } from 'lightweight-charts';
import { Loader2, RefreshCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TradeButton } from '@/components/common/TradeButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChartData } from '@/hooks/useChartData';
import { updateEMA } from '@/lib/chartIndicators';
import CryptoLogo from './CryptoLogo';

interface CandlestickChartProps {
  symbol: string;
  availableTokens?: string[];
  onSymbolChange?: (symbol: string) => void;
  onTimeframeChange?: (timeframe: string) => void;
}

const TIMEFRAMES = [
  { value: '1m', label: '1m' },
  { value: '3m', label: '3m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '1h', label: '1H' },
  { value: '4h', label: '4H' },
  { value: '1d', label: '1D' },
];

const CandlestickChart: React.FC<CandlestickChartProps> = ({
  symbol,
  availableTokens = [],
  onSymbolChange,
  onTimeframeChange
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const ema21SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const ema50SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const ema200SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const [timeframe, setTimeframe] = useState('4h');
  const {
    candleData,
    volumeData,
    ema21Data,
    ema50Data,
    ema200Data,
    lastCandle,
    isLoading,
    error,
    prevEma21,
    prevEma50,
    prevEma200
  } = useChartData(symbol, timeframe);

  // Refs for Real-Time EMA Calculation
  const baseEma21Ref = useRef<number | undefined>(undefined);
  const baseEma50Ref = useRef<number | undefined>(undefined);
  const baseEma200Ref = useRef<number | undefined>(undefined);
  const currentEma21Ref = useRef<number | undefined>(undefined);
  const currentEma50Ref = useRef<number | undefined>(undefined);
  const currentEma200Ref = useRef<number | undefined>(undefined);
  const lastTickTimeRef = useRef<Time | null>(null);

  // Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0a0a0f' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: 'rgba(30, 41, 59, 0.5)' }, // Darker grid
        horzLines: { color: 'rgba(30, 41, 59, 0.5)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      timeScale: {
        borderColor: '#1e293b',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#1e293b',
      },
    });

    // Candlestick Series
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });
    candleSeriesRef.current = candleSeries;

    // Volume Series (Overlay)
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: { type: 'volume' },
      priceScaleId: '', // Overlay on main chart
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8, // Push volume to bottom
        bottom: 0,
      },
    });
    volumeSeriesRef.current = volumeSeries;

    // EMA Series
    const ema21Series = chart.addLineSeries({ color: '#f59e0b', lineWidth: 1, title: 'EMA 21', crosshairMarkerVisible: false }); // Amber
    const ema50Series = chart.addLineSeries({ color: '#3b82f6', lineWidth: 1, title: 'EMA 50', crosshairMarkerVisible: false }); // Blue
    const ema200Series = chart.addLineSeries({ color: '#a855f7', lineWidth: 2, title: 'EMA 200', crosshairMarkerVisible: false }); // Purple

    ema21SeriesRef.current = ema21Series;
    ema50SeriesRef.current = ema50Series;
    ema200SeriesRef.current = ema200Series;

    chartRef.current = chart;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []); // Run once on mount

  const hasAutoFitRef = useRef(false);

  // Reset auto-fit when symbol or timeframe changes
  useEffect(() => {
    hasAutoFitRef.current = false;
  }, [symbol, timeframe]);

  // Update Logic - Historical Data
  useEffect(() => {
    if (!candleSeriesRef.current || candleData.length === 0) return;

    candleSeriesRef.current.setData(candleData as CandlestickData<Time>[]);
    volumeSeriesRef.current?.setData(volumeData as HistogramData<Time>[]);
    ema21SeriesRef.current?.setData(ema21Data as LineData<Time>[]);
    ema50SeriesRef.current?.setData(ema50Data as LineData<Time>[]);
    ema200SeriesRef.current?.setData(ema200Data as LineData<Time>[]);

    // Only fit content on initial load or timeframe/symbol change
    if (!hasAutoFitRef.current) {
      chartRef.current?.timeScale().fitContent();
      hasAutoFitRef.current = true;
    }

  }, [candleData, volumeData, ema21Data, ema50Data, ema200Data]);

  // Sync Refs when historical data changes
  useEffect(() => {
    if (candleData.length > 0) {
      baseEma21Ref.current = prevEma21;
      baseEma50Ref.current = prevEma50;
      baseEma200Ref.current = prevEma200;

      // Initialize current refs with the last known data point to avoid gaps
      // (This is an approximation, ideally we'd calculate it for the open candle if needed)

      const lastCandleTime = candleData[candleData.length - 1].time as Time;
      lastTickTimeRef.current = lastCandleTime;
    }
  }, [candleData, prevEma21, prevEma50, prevEma200]);

  // Update Logic - Realtime Ticks
  useEffect(() => {
    if (!lastCandle || !candleSeriesRef.current) return;

    // Update Candle
    candleSeriesRef.current.update(lastCandle as CandlestickData<Time>);

    // Update Volume
    volumeSeriesRef.current?.update({
      time: lastCandle.time as Time,
      value: lastCandle.volume,
      color: lastCandle.close >= lastCandle.open ? '#22c55e' : '#ef4444',
    } as HistogramData<Time>);

    // Dynamic EMA updates for the ticking candle
    if (candleData.length > 0) {
      const time = lastCandle.time as Time;

      // Check for New Candle (Boundary Crossing)
      if (lastTickTimeRef.current !== null && time > lastTickTimeRef.current) {
        // The candle we were updating just closed!
        // Promote the last calculated current EMA to be the base for the new candle.
        if (currentEma21Ref.current !== undefined) baseEma21Ref.current = currentEma21Ref.current;
        if (currentEma50Ref.current !== undefined) baseEma50Ref.current = currentEma50Ref.current;
        if (currentEma200Ref.current !== undefined) baseEma200Ref.current = currentEma200Ref.current;

        lastTickTimeRef.current = time;
      }

      // Helper to calculate and update
      const updateSeries = (
        series: ISeriesApi<"Line"> | null,
        baseRef: React.MutableRefObject<number | undefined>,
        currentRef: React.MutableRefObject<number | undefined>,
        period: number
      ) => {
        if (series && baseRef.current !== undefined) {
          const newVal = updateEMA(lastCandle.close, baseRef.current, period);
          if (newVal !== undefined) {
            currentRef.current = newVal;
            series.update({ time, value: newVal });
          }
        }
      };

      updateSeries(ema21SeriesRef.current, baseEma21Ref, currentEma21Ref, 21);
      updateSeries(ema50SeriesRef.current, baseEma50Ref, currentEma50Ref, 50);
      updateSeries(ema200SeriesRef.current, baseEma200Ref, currentEma200Ref, 200);
    }

  }, [lastCandle, candleData.length]);

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
    onTimeframeChange?.(value);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-4 border-b border-border gap-2">
        <div className="flex items-center gap-2">
          {availableTokens.length > 0 ? (
            <Select value={symbol} onValueChange={onSymbolChange}>
              <SelectTrigger className="w-[140px] h-9 bg-background/50 border-input font-medium">
                <div className="flex items-center gap-2">
                  <CryptoLogo symbol={symbol} size={20} />
                  <span>{symbol}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {[...new Set(availableTokens)].map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center gap-2 font-bold text-lg px-2">
              <CryptoLogo symbol={symbol} size={24} />
              {symbol}/USDT
            </div>
          )}

          <div className="hidden md:flex gap-1.5 ml-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-medium border border-amber-500/20">EMA 21</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-medium border border-blue-500/20">EMA 50</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500 font-medium border border-purple-500/20">EMA 200</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex bg-muted/50 rounded-lg p-1 gap-1">
            {TIMEFRAMES.map(tf => (
              <button
                key={tf.value}
                onClick={() => handleTimeframeChange(tf.value)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeframe === tf.value
                  ? 'bg-background text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative flex-1 min-h-[400px]">
        {isLoading && candleData.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-20 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Carregando dados...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20">
            <div className="text-center">
              <p className="text-red-500 mb-2">Erro ao carregar gráfico</p>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                Recarregar
              </Button>
            </div>
          </div>
        )}

        <div ref={chartContainerRef} className="w-full h-full" />

        {/* Floating Price Tag (Optional) */}
        {lastCandle && (
          <div className={`absolute top-4 right-16 px-2 py-1 rounded text-sm font-mono font-bold z-10 ${lastCandle.close >= lastCandle.open ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
            ${lastCandle.close.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandlestickChart;
