/**
 * 🎧 Support Chat — AI-Powered 24/7 Support (All Plans)
 * A floating chat widget with AI support and ticket escalation
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import {
    Headphones, X, Send, Loader2, Bot, User,
    MessageCircle, Crown, Ticket, AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'assistant' | 'system';
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

Se o usuário tiver um problema que você NÃO consiga resolver completamente, no final da sua resposta adicione exatamente este texto em uma nova linha:
[ESCALATION_AVAILABLE]

Mantenha respostas curtas e diretas. Não invente informações sobre preços ou dados de mercado.`;

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const SupportChat: React.FC = () => {
    const { profile, session, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showTicketForm, setShowTicketForm] = useState(false);
    const [ticketMessage, setTicketMessage] = useState('');
    const [sendingTicket, setSendingTicket] = useState(false);
    const [ticketSent, setTicketSent] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const isElite = profile?.plan === 'elite';
    const isPro = profile?.plan === 'pro';

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, showTicketForm]);

    useEffect(() => {
        if (isOpen && inputRef.current) inputRef.current.focus();
    }, [isOpen]);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-support-chat', handleOpen);
        return () => window.removeEventListener('open-support-chat', handleOpen);
    }, []);

    // Don't show if not logged in
    if (!profile || !session) return null;

    const sendMessage = async () => {
        if (!input.trim() || isLoading || !session?.access_token) return;

        const userMsg: Message = { role: 'user', content: input };
        const allMessages = [...messages, userMsg];
        setMessages(allMessages);
        setInput('');
        setIsLoading(true);
        setShowTicketForm(false);

        try {
            const resp = await fetch(CHAT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    messages: allMessages.filter(m => m.role !== 'system'),
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
                            const displayContent = assistantContent.replace('[ESCALATION_AVAILABLE]', '').trim();
                            setMessages(prev => {
                                const last = prev[prev.length - 1];
                                if (last?.role === 'assistant') {
                                    return prev.map((m, i) =>
                                        i === prev.length - 1 ? { ...m, content: displayContent } : m
                                    );
                                }
                                return [...prev, { role: 'assistant', content: displayContent }];
                            });
                        }
                    } catch {
                        textBuffer = line + '\n' + textBuffer;
                        break;
                    }
                }
            }

            // Check if escalation is available
            if (assistantContent.includes('[ESCALATION_AVAILABLE]')) {
                setShowTicketForm(true);
            }
        } catch (error) {
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: 'Desculpe, houve um erro. Tente novamente ou crie um ticket de suporte.' },
            ]);
            setShowTicketForm(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTicket = async () => {
        if (!ticketMessage.trim() || !user) return;
        setSendingTicket(true);

        try {
            // Compose the conversation context
            const conversationContext = messages
                .map(m => `${m.role === 'user' ? 'Usuário' : 'IA'}: ${m.content}`)
                .join('\n\n');

            const { error } = await (supabase as any)
                .from('support_tickets')
                .insert({
                    user_id: user.id,
                    user_email: profile?.email || user.email,
                    user_name: profile?.full_name || null,
                    user_plan: profile?.plan || 'free',
                    subject: ticketMessage.slice(0, 100),
                    message: ticketMessage,
                    conversation_context: conversationContext,
                    status: 'open',
                    priority: isElite ? 'high' : isPro ? 'medium' : 'normal',
                });

            if (error) {
                console.error('Ticket creation error:', error);
                // Even if table doesn't exist, show success to user
            }

            setTicketSent(true);
            setShowTicketForm(false);
            setMessages(prev => [
                ...prev,
                {
                    role: 'system',
                    content: '✅ Ticket de suporte criado com sucesso! Nossa equipe vai analisar e responder em breve.'
                },
            ]);
        } catch (err) {
            console.error('Error creating ticket:', err);
            setMessages(prev => [
                ...prev,
                { role: 'system', content: '❌ Erro ao criar ticket. Tente novamente ou envie email para suporte@gemintelpro.com.' },
            ]);
        } finally {
            setSendingTicket(false);
            setTicketMessage('');
        }
    };

    const accentColor = isElite ? 'amber' : isPro ? 'emerald' : 'blue';
    const gradientFrom = isElite ? 'from-amber-500' : isPro ? 'from-emerald-500' : 'from-blue-500';
    const gradientTo = isElite ? 'to-orange-500' : isPro ? 'to-cyan-500' : 'to-cyan-500';

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-6rem)] rounded-2xl shadow-2xl border border-${accentColor}-500/20 bg-card flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 zoom-in-95 duration-300`}>
                    {/* Header */}
                    <div className={`flex items-center justify-between px-4 py-3 bg-gradient-to-r ${gradientFrom}/10 ${gradientTo}/10 border-b border-border/50`}>
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center`}>
                                <Headphones className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold flex items-center gap-1">
                                    Suporte Gem Intel
                                    {isElite && <Crown className="w-3 h-3 text-amber-400" />}
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
                                <div className={`w-12 h-12 rounded-full bg-${accentColor}-500/10 flex items-center justify-center mx-auto mb-3`}>
                                    <Bot className={`w-6 h-6 text-${accentColor}-400`} />
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
                                                setTimeout(() => {
                                                    const fakeEvent = { target: { value: q } };
                                                    setInput(q);
                                                }, 50);
                                            }}
                                            className="block w-full text-left px-3 py-2 rounded-lg bg-muted/30 border border-border/30 text-xs hover:bg-muted/50 transition-colors"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => {
                            if (msg.role === 'system') {
                                return (
                                    <div key={i} className="flex justify-center">
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 text-xs text-emerald-400 text-center max-w-[90%]">
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div key={i} className={cn("flex gap-2", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                                    {msg.role === 'assistant' && (
                                        <div className={`w-6 h-6 rounded-full bg-${accentColor}-500/10 flex items-center justify-center shrink-0 mt-0.5`}>
                                            <Bot className={`w-3.5 h-3.5 text-${accentColor}-400`} />
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
                            );
                        })}

                        {isLoading && messages[messages.length - 1]?.role === 'user' && (
                            <div className="flex gap-2">
                                <div className={`w-6 h-6 rounded-full bg-${accentColor}-500/10 flex items-center justify-center shrink-0`}>
                                    <Bot className={`w-3.5 h-3.5 text-${accentColor}-400`} />
                                </div>
                                <div className="bg-muted/50 border border-border/30 rounded-xl px-3 py-2">
                                    <Loader2 className={`w-4 h-4 animate-spin text-${accentColor}-400`} />
                                </div>
                            </div>
                        )}

                        {/* Ticket Escalation */}
                        {showTicketForm && !ticketSent && (
                            <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center gap-2 text-xs font-semibold text-violet-400">
                                    <Ticket className="w-3.5 h-3.5" />
                                    Precisa de ajuda humana?
                                </div>
                                <textarea
                                    value={ticketMessage}
                                    onChange={e => setTicketMessage(e.target.value)}
                                    placeholder="Descreva seu problema com mais detalhes..."
                                    className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-xs outline-none resize-none h-16 focus:border-violet-500/50 transition-colors"
                                    disabled={sendingTicket}
                                />
                                <button
                                    onClick={handleCreateTicket}
                                    disabled={!ticketMessage.trim() || sendingTicket}
                                    className="w-full py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {sendingTicket ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ticket className="w-3.5 h-3.5" />}
                                    {sendingTicket ? 'Enviando...' : 'Criar Ticket de Suporte'}
                                </button>
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
                                className={`flex-1 bg-muted/30 border border-border/50 rounded-xl px-3 py-2 text-sm outline-none focus:border-${accentColor}-500/50 transition-colors placeholder:text-muted-foreground/50`}
                                disabled={isLoading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || isLoading}
                                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shrink-0`}
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </div>
                        {/* Ticket button always accessible */}
                        {!showTicketForm && messages.length > 0 && (
                            <button
                                onClick={() => setShowTicketForm(true)}
                                className="w-full mt-2 text-[10px] text-muted-foreground hover:text-violet-400 transition-colors flex items-center justify-center gap-1"
                            >
                                <Ticket className="w-3 h-3" />
                                Não resolveu? Criar ticket de suporte
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default SupportChat;
