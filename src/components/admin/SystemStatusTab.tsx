import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Activity, Database, Wifi, WifiOff, Zap, CheckCircle2, XCircle, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRealtimePrices } from '@/lib/realtimeService';

interface SystemLog {
    id: string;
    timestamp: Date;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
}

const SystemStatusTab: React.FC = () => {
    const { isConnected } = useRealtimePrices([]);
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    // Simulate system logs (in real app, these would come from backend)
    useEffect(() => {
        const initialLogs: SystemLog[] = [
            { id: '1', timestamp: new Date(Date.now() - 60000), type: 'success', message: 'WebSocket connection established' },
            { id: '2', timestamp: new Date(Date.now() - 120000), type: 'info', message: 'Token sync service started' },
            { id: '3', timestamp: new Date(Date.now() - 180000), type: 'success', message: 'Database health check passed' },
            { id: '4', timestamp: new Date(Date.now() - 240000), type: 'info', message: 'Edge Functions initialized' },
            { id: '5', timestamp: new Date(Date.now() - 300000), type: 'success', message: 'Real-time price updates active' },
        ];
        setLogs(initialLogs);

        // Update timestamp every minute
        const interval = setInterval(() => {
            setLastUpdate(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    // Add log when connection status changes
    useEffect(() => {
        if (isConnected) {
            const newLog: SystemLog = {
                id: Date.now().toString(),
                timestamp: new Date(),
                type: 'success',
                message: 'WebSocket reconnected successfully'
            };
            setLogs(prev => [newLog, ...prev].slice(0, 20));
        } else {
            const newLog: SystemLog = {
                id: Date.now().toString(),
                timestamp: new Date(),
                type: 'error',
                message: 'WebSocket connection lost'
            };
            setLogs(prev => [newLog, ...prev].slice(0, 20));
        }
    }, [isConnected]);

    const getLogIcon = (type: SystemLog['type']) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-3 h-3 text-success" />;
            case 'error': return <XCircle className="w-3 h-3 text-destructive" />;
            case 'warning': return <Activity className="w-3 h-3 text-warning" />;
            default: return <Clock className="w-3 h-3 text-info" />;
        }
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Agora';
        if (diffMins < 60) return `${diffMins}min atrás`;
        const diffHours = Math.floor(diffMins / 60);
        return `${diffHours}h atrás`;
    };

    return (
        <div className="space-y-6">
            {/* Connection Status */}
            <Card className="border-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Status de Conexão em Tempo Real
                    </CardTitle>
                    <CardDescription>
                        Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* WebSocket Status */}
                        <div className={cn(
                            "p-4 rounded-lg border-2 transition-colors",
                            isConnected ? "bg-success/5 border-success/30" : "bg-destructive/5 border-destructive/30"
                        )}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">WebSocket</span>
                                {isConnected ? (
                                    <Wifi className="w-5 h-5 text-success" />
                                ) : (
                                    <WifiOff className="w-5 h-5 text-destructive" />
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={isConnected ? "default" : "destructive"} className={cn(
                                    isConnected && "bg-success hover:bg-success"
                                )}>
                                    {isConnected ? 'Conectado' : 'Desconectado'}
                                </Badge>
                            </div>
                        </div>

                        {/* Database Status */}
                        <div className="p-4 rounded-lg border-2 bg-success/5 border-success/30 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Database</span>
                                <Database className="w-5 h-5 text-success" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-success hover:bg-success">
                                    Online
                                </Badge>
                                <span className="text-xs text-muted-foreground">~20ms</span>
                            </div>
                        </div>

                        {/* Edge Functions Status */}
                        <div className="p-4 rounded-lg border-2 bg-success/5 border-success/30 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Edge Functions</span>
                                <Zap className="w-5 h-5 text-success" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-success hover:bg-success">
                                    Operacional
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* System Logs */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Logs do Sistema
                    </CardTitle>
                    <CardDescription>
                        Últimas 20 entradas
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-2">
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="mt-0.5">
                                        {getLogIcon(log.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm">{log.message}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {formatTimestamp(log.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};

export default SystemStatusTab;
