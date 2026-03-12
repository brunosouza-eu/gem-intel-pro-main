/**
 * 🎧 Elite Support Chat — AI-Powered 24/7 Support (Elite Plan Only)
 * A floating chat widget in the bottom-right corner for Elite subscribers
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
    Headphones, X, Send, Loader2, Bot, User,
    MessageCircle, Minimize2, Crown
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const SUPPORT_SYSTEM_PROMPT = `Você é o assistente de suporte da Gem Intel Pro, uma plataforma de análise de criptomoedas com IA.
Seja sempre educado, profissional e objetivo. Responda em português do Brasil.
Você pode ajudar com:
- Dúvidas sobre como usar as ferramentas (Radar, Trade Master, Sniper, Crypto Guru, Bubble Gem, Alertas, AutoPilot)
- Problemas técnicos na plataforma
- Explicações sobre planos, créditos e assinaturas
- Dúvidas básicas sobre trading e mercado cripto
- Orientação sobre como aproveitar melhor a plataforma

Se o usuário tiver um problema técnico sério que você não consiga resolver, oriente-o a enviar um e-mail para suporte@gemintelpro.com.
Mantenha respostas curtas e diretas. Não invente informações sobre preços ou dados de mercado.`;

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const EliteSupportChat: React.FC = () => {
    const { profile, session } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Only show for elite users
    const isElite = profile?.plan === 'elite';

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    if (!isElite) return null;

    const sendMessage = async () => {
        if (!input.trim() || isLoading || !session?.access_token) return;

        const userMsg: Message = { role: 'user', content: input };
        const allMessages = [...messages, userMsg];
        setMessages(allMessages);
        setInput('');
        setIsLoading(true);

        try {
            const resp = await fetch(CHAT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    messages: allMessages,
                    language: 'pt',
                    systemPrompt: SUPPORT_SYSTEM_PROMPT,
                }),
            });

            if (!resp.ok) throw new Error('Erro ao conectar');
            if (!resp.body) throw new Error('No body');

            const reader = resp.body.getReader();
            const decoder = new TextDecoder();
            let textBuffer = '';
            let assistantContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                textBuffer += decoder.decode(value, { stream: true });

                let newlineIndex: number;
                while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
                    let line = textBuffer.slice(0, newlineIndex);
                    textBuffer = textBuffer.slice(newlineIndex + 1);
                    if (line.endsWith('\r')) line = line.slice(0, -1);
                    if (!line.startsWith('data: ')) continue;
                    const jsonStr = line.slice(6).trim();
                    if (jsonStr === '[DONE]') break;

                    try {
                        const parsed = JSON.parse(jsonStr);
                        const content = parsed.choices?.[0]?.delta?.content;
                        if (content) {
                            assistantContent += content;
                            setMessages(prev => {
                                const last = prev[prev.length - 1];
                                if (last?.role === 'assistant') {
                                    return prev.map((m, i) =>
                                        i === prev.length - 1 ? { ...m, content: assistantContent } : m
                                    );
                                }
                                return [...prev, { role: 'assistant', content: assistantContent }];
                            });
                        }
                    } catch {
                        textBuffer = line + '\n' + textBuffer;
                        break;
                    }
                }
            }
        } catch (error) {
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: 'Desculpe, houve um erro. Tente novamente ou envie um e-mail para suporte@gemintelpro.com.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-black shadow-2xl shadow-amber-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group"
                >
                    <Headphones className="w-6 h-6" />
                    {/* Pulse ring */}
                    <span className="absolute inset-0 rounded-full bg-amber-500/30 animate-ping" />
                    {/* Badge */}
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-[9px] font-black flex items-center justify-center text-white border-2 border-background">
                        AI
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-6rem)] rounded-2xl shadow-2xl border border-amber-500/20 bg-card flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 zoom-in-95 duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-border/50">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                                <Headphones className="w-4 h-4 text-black" />
                            </div>
                            <div>
                                <p className="text-sm font-bold flex items-center gap-1">
                                    Suporte Elite
                                    <Crown className="w-3 h-3 text-amber-400" />
                                </p>
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    IA disponível 24/7
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.length === 0 && (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                                    <Bot className="w-6 h-6 text-amber-400" />
                                </div>
                                <p className="text-sm font-medium mb-1">Olá! 👋</p>
                                <p className="text-xs text-muted-foreground">
                                    Sou o assistente IA da Gem Intel Pro. Como posso te ajudar?
                                </p>
                                <div className="mt-4 space-y-2">
                                    {[
                                        'Como uso o Trade Master?',
                                        'Como funcionam os créditos?',
                                        'Estou com problema técnico',
                                    ].map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setInput(q);
                                                setTimeout(() => sendMessage(), 100);
                                            }}
                                            className="block w-full text-left px-3 py-2 rounded-lg bg-muted/30 border border-border/30 text-xs hover:bg-muted/50 transition-colors"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={cn("flex gap-2", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                                {msg.role === 'assistant' && (
                                    <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Bot className="w-3.5 h-3.5 text-amber-400" />
                                    </div>
                                )}
                                <div className={cn(
                                    "rounded-xl px-3 py-2 text-sm max-w-[85%]",
                                    msg.role === 'user'
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted/50 border border-border/30"
                                )}>
                                    {msg.role === 'assistant' ? (
                                        <div className="markdown-body text-xs">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="text-sm">{msg.content}</p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && messages[messages.length - 1]?.role === 'user' && (
                            <div className="flex gap-2">
                                <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                                    <Bot className="w-3.5 h-3.5 text-amber-400" />
                                </div>
                                <div className="bg-muted/50 border border-border/30 rounded-xl px-3 py-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="border-t border-border/50 p-3">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                placeholder="Digite sua dúvida..."
                                className="flex-1 bg-muted/30 border border-border/50 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-500/50 transition-colors placeholder:text-muted-foreground/50"
                                disabled={isLoading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || isLoading}
                                className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-black flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shrink-0"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EliteSupportChat;
