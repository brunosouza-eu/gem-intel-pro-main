import React, { useState, useRef, useEffect } from 'react';
import { ExchangeFloatingBar } from '@/components/ExchangeReferral';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useGamification } from '@/contexts/GamificationContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  MessageSquare, Send, Bot, User, Loader2,
  TrendingUp, Shield, Sparkles, Target, BarChart3,
  Coins, Crown, Zap, Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreditGuard } from '@/hooks/useCreditGuard';
import { UpgradeModal } from '@/components/monetization';
import { ChatTutorial } from '@/components/chat/ChatTutorial';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const ChatPage = () => {
  const { t, language } = useLanguage();
  const { session } = useAuth();
  const { profile, trackGuruUse, refreshProfile } = useGamification();
  const { checkAndUse, isVip, creditsAvailable, timeUntilReset, guardModals } = useCreditGuard();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = language === 'pt' ? [
    { icon: <BarChart3 className="w-4 h-4" />, text: 'Faça uma análise técnica completa do BTC agora com plano estratégico' },
    { icon: <Globe className="w-4 h-4" />, text: 'Qual o cenário macro atual do mercado cripto? Estamos em que fase do ciclo?' },
    { icon: <Target className="w-4 h-4" />, text: 'Monte um plano de operação para ETH com entrada, stop e 3 alvos' },
    { icon: <Zap className="w-4 h-4" />, text: 'Quais são as top 5 oportunidades de swing trade com melhor R:R agora?' },
    { icon: <Shield className="w-4 h-4" />, text: 'Como gerenciar risco em um portfólio cripto? Qual % alocar por trade?' },
    { icon: <Sparkles className="w-4 h-4" />, text: 'Analise SOL: vale entrar agora ou aguardar pullback?' },
  ] : [
    { icon: <BarChart3 className="w-4 h-4" />, text: 'Give me a full technical analysis of BTC with a strategic plan' },
    { icon: <Globe className="w-4 h-4" />, text: 'What\'s the current macro outlook for crypto? What cycle phase are we in?' },
    { icon: <Target className="w-4 h-4" />, text: 'Build a trading plan for ETH with entry, stop loss and 3 targets' },
    { icon: <Zap className="w-4 h-4" />, text: 'Top 5 swing trade opportunities with best R:R right now?' },
    { icon: <Shield className="w-4 h-4" />, text: 'How to manage risk in a crypto portfolio? What % to allocate per trade?' },
    { icon: <Sparkles className="w-4 h-4" />, text: 'Analyze SOL: should I enter now or wait for a pullback?' },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessages: Message[]) => {
    if (!session?.access_token) {
      throw new Error(language === 'pt' ? 'Você precisa estar logado' : 'You must be logged in');
    }

    const resp = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ messages: userMessages, language }),
    });

    if (!resp.ok) {
      if (resp.status === 429) throw new Error(language === 'pt' ? 'Limite de requisições excedido. Tente novamente em alguns segundos.' : 'Rate limit exceeded.');
      if (resp.status === 402) throw new Error(language === 'pt' ? 'Créditos insuficientes.' : 'Insufficient credits.');
      throw new Error(language === 'pt' ? 'Erro ao conectar com IA' : 'Error connecting to AI');
    }

    if (!resp.body) throw new Error('No response body');

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = '';
    let assistantContent = '';
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith('\r')) line = line.slice(0, -1);
        if (line.startsWith(':') || line.trim() === '') continue;
        if (!line.startsWith('data: ')) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
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
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    if (!isVip) {
      const canProceed = await checkAndUse('use_guru');
      if (!canProceed) return;
    }

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      await streamChat([...messages, userMsg]);
      await trackGuruUse();
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: error instanceof Error ? error.message : (language === 'pt' ? 'Erro ao processar mensagem.' : 'Error processing message.')
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  {language === 'pt' ? 'Oráculo do Mercado' : 'Market Oracle'}
                  <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-gradient-to-r from-primary/20 to-info/20 border border-primary/30 text-primary">
                    AI Pro
                  </span>
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  {language === 'pt'
                    ? 'Dados em tempo real • Análise técnica & fundamental • 50+ anos de expertise'
                    : 'Real-time data • Technical & fundamental analysis • 50+ years expertise'}
                  {!isVip && (
                    <span className="ml-2 text-amber-400">
                      (2 {language === 'pt' ? 'créditos/msg' : 'credits/msg'})
                    </span>
                  )}
                </p>
              </div>
            </div>
            {/* Credits / VIP */}
            {!isVip && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium">{creditsAvailable}</span>
                <span className="text-xs text-muted-foreground">
                  {language === 'pt' ? 'créditos' : 'credits'}
                </span>
              </div>
            )}
            {isVip && (
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-amber-400">VIP</span>
              </div>
            )}
          </div>
        </div>

        <ChatTutorial />

        {/* Chat Container */}
        <Card className="flex-1 glass flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center mb-4 animate-pulse">
                  <Bot className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-1">
                  {language === 'pt' ? 'Oráculo do Mercado' : 'Market Oracle'}
                </h3>
                <p className="text-muted-foreground text-center text-sm max-w-md mb-6">
                  {language === 'pt'
                    ? 'Análise técnica e fundamental de elite com dados em tempo real. Peça análises completas, planos estratégicos e operações estruturadas.'
                    : 'Elite technical & fundamental analysis with real-time data. Request full analyses, strategic plans and structured operations.'}
                </p>

                {/* Suggested Questions */}
                <div className="w-full max-w-2xl">
                  <p className="text-xs text-muted-foreground mb-2 text-center">
                    {language === 'pt' ? '⚡ Perguntas sugeridas' : '⚡ Suggested questions'}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {suggestedQuestions.map((q, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="h-auto min-h-[44px] py-3 px-4 justify-start text-left hover:bg-primary/5 hover:border-primary/30 transition-all items-start"
                        onClick={() => sendMessage(q.text)}
                      >
                        <span className="text-primary mr-3 mt-0.5 flex-shrink-0">{q.icon}</span>
                        <span className="text-sm leading-tight text-muted-foreground whitespace-normal break-words">{q.text}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'flex gap-3',
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-3',
                        msg.role === 'user'
                          ? 'max-w-[80%] bg-primary text-primary-foreground'
                          : 'max-w-[90%] bg-muted/50 border border-border/50'
                      )}
                    >
                      {msg.role === 'assistant' ? (
                        <div className="markdown-body">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div className="bg-muted/50 border border-border/50 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {language === 'pt' ? 'Analisando dados em tempo real...' : 'Analyzing real-time data...'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            {/* Low credits warning */}
            {!isVip && creditsAvailable <= 2 && creditsAvailable > 0 && (
              <div className="mb-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400">
                  {language === 'pt'
                    ? `Apenas ${creditsAvailable} créditos restantes!`
                    : `Only ${creditsAvailable} credits left!`}
                </span>
              </div>
            )}
            {!isVip && creditsAvailable === 0 && (
              <div className="mb-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-sm flex items-center gap-2">
                <Coins className="w-4 h-4 text-red-400" />
                <span className="text-red-400">
                  {language === 'pt'
                    ? `Créditos esgotados! Renovam em ${timeUntilReset}`
                    : `Credits depleted! Resets in ${timeUntilReset}`}
                </span>
              </div>
            )}
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === 'pt'
                  ? 'Pergunte sobre qualquer criptoativo, peça análises completas ou planos estratégicos...'
                  : 'Ask about any crypto, request full analyses or strategic plans...'}
                className="min-h-[60px] max-h-[120px] resize-none"
                disabled={isLoading || (!isVip && creditsAvailable < 2)}
              />
              <Button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading || (!isVip && creditsAvailable < 2)}
                size="icon"
                className="h-[60px] w-[60px] bg-gradient-to-r from-primary to-info hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Credit Guard Modals */}
      {guardModals}

      <ExchangeFloatingBar />
    </>
  );
};

export default ChatPage;
