import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
    HelpCircle, ChevronDown, ChevronUp, Users, MessageSquarePlus, Trophy, Heart
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export const CommunityTutorial = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { language } = useLanguage();
    const pt = language === 'pt';

    return (
        <Card className="glass border-primary/20 overflow-hidden mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-green-600/20">
                        <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-sm">
                            {pt ? 'Como funciona a Comunidade?' : 'How does the Community work?'}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            {pt ? 'Aprenda a interagir, ganhar XP e subir de nível' : 'Learn to interact, earn XP, and level up'}
                        </p>
                    </div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </button>

            {isOpen && (
                <CardContent className="pt-0 pb-5 space-y-5 animate-in fade-in-50 slide-in-from-top-2 duration-300">
                    <div className="border-t border-border/50" />

                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {pt ? 'A Comunidade Gem Intel é o seu espaço para trocar ideias de trades, análises e aprender com outros investidores. Participe ativamente para subir de rank!'
                                : 'The Gem Intel Community is your space to share trade ideas, analysis, and learn from other investors. Participate actively to rank up!'}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2">
                            <div className="flex items-center gap-2">
                                <MessageSquarePlus className="w-4 h-4 text-primary" />
                                <span className="font-semibold text-sm">{pt ? 'Criando Posts e Comentários' : 'Creating Posts & Comments'}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {pt ? 'Compartilhe suas análises, dúvidas ou setups. Você ganha XP por cada post (+50 XP) e comentário (+10 XP) que fizer.'
                                    : 'Share your analysis, questions, or setups. You earn XP for every post (+50 XP) and comment (+10 XP) you make.'}
                            </p>
                        </div>

                        <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2">
                            <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-destructive" />
                                <span className="font-semibold text-sm">{pt ? 'Ganhando Interações' : 'Earning Interactions'}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {pt ? 'Posts de qualidade recebem likes. Quando alguém curte seu post, VOCÊ ganha XP extra (+2 XP por like)!'
                                    : 'Quality posts receive likes. When someone likes your post, YOU earn extra XP (+2 XP per like)!'}
                            </p>
                        </div>

                        <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-warning" />
                                <span className="font-semibold text-sm">{pt ? 'Sistema de Ranks' : 'Ranking System'}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {pt ? 'Seu XP define seu nível de perfil (ex: Novato, Trader, Baleia). Usuários com ranks mais altos ganham mais destaque na comunidade.'
                                    : 'Your XP defines your profile level (e.g., Novice, Trader, Whale). Higher-ranked users get more visibility in the community.'}
                            </p>
                        </div>

                        <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-info" />
                                <span className="font-semibold text-sm">{pt ? 'Perfil Customizável' : 'Customizable Profile'}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {pt ? 'Clique no seu avatar para editar sua foto de perfil e mostrar seu status para os outros membros.'
                                    : 'Click your avatar to edit your profile picture and show your status to other members.'}
                            </p>
                        </div>
                    </div>

                </CardContent>
            )}
        </Card>
    );
};
