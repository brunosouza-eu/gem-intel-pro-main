/**
 * AutoPilot Status Indicator
 * Compact, discrete indicator showing the automation system status.
 * OPTIMIZED: Computes countdown locally via useInterval instead of subscribing
 * to a global 1-second state update.
 */

import React, { useState, useEffect } from 'react';
import { useAutoPilot } from '@/contexts/AutoSyncContext';
import { cn } from '@/lib/utils';
import { Zap, ChevronDown } from 'lucide-react';

const SYNC_INTERVAL_S = 5 * 60; // 5 minutes
const ANALYSIS_INTERVAL_S = 7 * 60; // 7 minutes

export const AutoPilotIndicator: React.FC = () => {
    const status = useAutoPilot();
    const [isExpanded, setIsExpanded] = useState(false);
    const [now, setNow] = useState(Date.now());

    // Local 1-second tick — only updates THIS component, not the whole app
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    const formatTime = (seconds: number): string => {
        const s = Math.max(0, Math.round(seconds));
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const nextSyncIn = status.lastSync
        ? Math.max(0, SYNC_INTERVAL_S - (now - status.lastSync.getTime()) / 1000)
        : 0;

    return (
        <div className="w-full px-2 mb-2">
            <div
                className={cn(
                    "bg-background/90 backdrop-blur-lg rounded-lg border border-border/50 shadow-lg transition-all duration-300",
                    isExpanded ? "p-3 w-56" : "p-2 cursor-pointer hover:bg-muted/50"
                )}
                onClick={() => !isExpanded && setIsExpanded(true)}
            >
                {/* Compact Header */}
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        status.isRunning ? "bg-success animate-pulse" : "bg-destructive"
                    )} />
                    <Zap className="w-3 h-3 text-warning shrink-0" />
                    <span className="text-xs font-semibold">AutoPilot</span>

                    {!isExpanded && (
                        <span className="text-xs text-muted-foreground ml-auto">
                            {status.tokenCount} tokens
                        </span>
                    )}

                    {isExpanded && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                            className="ml-auto p-0.5 hover:bg-muted rounded"
                        >
                            <ChevronDown className="w-3 h-3" />
                        </button>
                    )}
                </div>

                {/* Expanded panel */}
                {isExpanded && (
                    <div className="mt-2 pt-2 border-t border-border/50 space-y-1.5">
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className={cn(
                                "w-1 h-1 rounded-full shrink-0",
                                status.currentAction.includes('...') ? "bg-warning animate-pulse" : "bg-muted-foreground"
                            )} />
                            <span className="truncate">{status.currentAction}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <span className="text-muted-foreground">Tokens:</span>
                                <span className="font-semibold ml-1">{status.tokenCount}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Próx.:</span>
                                <span className="font-mono ml-1">{formatTime(nextSyncIn)}</span>
                            </div>
                        </div>

                        {status.lastSync && (
                            <div className="text-xs text-muted-foreground">
                                Último: {status.lastSync.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AutoPilotIndicator;
