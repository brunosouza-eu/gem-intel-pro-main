/**
 * ✍️ Inline Post Composer
 * Always-visible composer at top of feed — with link blocking
 */
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useGamification } from '@/contexts/GamificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { createPost, containsLink } from '@/lib/communityService';
import { Post, PostType } from '@/types/community';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Send,
    TrendingUp,
    BarChart3,
    HelpCircle,
    Bell,
    Smile,
    Loader2,
    Hash,
    AlertTriangle
} from 'lucide-react';

interface CreatePostInlineProps {
    onPostCreated?: (post: Post) => void;
}

const POST_TYPES: { value: PostType; label: string; labelPt: string; icon: React.ReactNode; color: string }[] = [
    { value: 'insight', label: 'Insight', labelPt: 'Insight', icon: <TrendingUp className="w-3.5 h-3.5" />, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' },
    { value: 'analysis', label: 'Analysis', labelPt: 'Análise', icon: <BarChart3 className="w-3.5 h-3.5" />, color: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20' },
    { value: 'question', label: 'Question', labelPt: 'Dúvida', icon: <HelpCircle className="w-3.5 h-3.5" />, color: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20' },
    { value: 'alert_share', label: 'Alert', labelPt: 'Alerta', icon: <Bell className="w-3.5 h-3.5" />, color: 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20' },
];

export function CreatePostInline({ onPostCreated }: CreatePostInlineProps) {
    const { user } = useAuth();
    const { profile } = useGamification();
    const { language } = useLanguage();
    const pt = language === 'pt';

    const [content, setContent] = useState('');
    const [postType, setPostType] = useState<PostType>('insight');
    const [isFocused, setIsFocused] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const hasLink = containsLink(content);

    const handlePost = async () => {
        if (!content.trim() || isPosting) return;
        setError('');

        if (hasLink) {
            setError(pt ? 'Links não são permitidos. Remova URLs do seu post.' : 'Links are not allowed. Remove URLs from your post.');
            return;
        }

        setIsPosting(true);
        try {
            const result = await createPost({
                content: content.trim(),
                post_type: postType,
            });

            if (result.success && result.post) {
                setContent('');
                setIsFocused(false);
                setPostType('insight');
                setError('');
                onPostCreated?.(result.post);
            } else if (result.error) {
                setError(result.error);
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao publicar.');
        } finally {
            setIsPosting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handlePost();
        }
    };

    if (!user) return null;

    return (
        <div className={cn(
            "rounded-2xl overflow-hidden transition-all duration-300",
            "bg-card/80 backdrop-blur-sm border",
            isFocused
                ? "border-primary/40 shadow-lg shadow-primary/5 ring-1 ring-primary/20"
                : "border-border/50 hover:border-border"
        )}>
            <div className="p-4">
                <div className="flex gap-3">
                    {/* Avatar */}
                    <Avatar className="w-10 h-10 ring-2 ring-primary/20 flex-shrink-0">
                        <AvatarImage src={profile?.avatar_url || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold">
                            {profile?.username?.charAt(0)?.toUpperCase() || '?'}
                        </AvatarFallback>
                    </Avatar>

                    {/* Input area */}
                    <div className="flex-1 min-w-0">
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={e => { setContent(e.target.value); setError(''); }}
                            onFocus={() => setIsFocused(true)}
                            onKeyDown={handleKeyDown}
                            placeholder={pt
                                ? 'O que está pensando sobre o mercado? Use $BTC para marcar tokens...'
                                : "What's on your mind? Use $BTC to tag tokens..."
                            }
                            maxLength={500}
                            rows={isFocused ? 3 : 1}
                            className={cn(
                                "w-full bg-transparent text-sm resize-none",
                                "placeholder:text-muted-foreground/50",
                                "focus:outline-none",
                                "transition-all duration-200"
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* Expanded options when focused */}
            {(isFocused || content.length > 0) && (
                <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    {/* Link warning */}
                    {hasLink && (
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            {pt ? 'Links não são permitidos na comunidade.' : 'Links are not allowed in the community.'}
                        </div>
                    )}

                    {/* Error message */}
                    {error && !hasLink && (
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Post type pills */}
                    <div className="flex gap-1.5 flex-wrap">
                        {POST_TYPES.map(type => (
                            <button
                                key={type.value}
                                onClick={() => setPostType(type.value)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                                    postType === type.value
                                        ? type.color + ' ring-1 ring-current/20'
                                        : 'bg-muted/30 text-muted-foreground border-transparent hover:bg-muted/50'
                                )}
                            >
                                {type.icon}
                                {pt ? type.labelPt : type.label}
                            </button>
                        ))}
                    </div>

                    {/* Action bar */}
                    <div className="flex items-center justify-between pt-1 border-t border-border/30">
                        <div className="flex items-center gap-1">
                            <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors" title="Emoji">
                                <Smile className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors" title="Hashtag">
                                <Hash className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className={cn(
                                "text-xs transition-colors",
                                content.length > 450 ? 'text-amber-400' : content.length > 0 ? 'text-muted-foreground' : 'text-transparent'
                            )}>
                                {content.length}/500
                            </span>

                            {content.length > 0 && (
                                <button
                                    onClick={() => { setContent(''); setIsFocused(false); setError(''); }}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {pt ? 'Cancelar' : 'Cancel'}
                                </button>
                            )}

                            <button
                                onClick={handlePost}
                                disabled={!content.trim() || isPosting || hasLink}
                                className={cn(
                                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all",
                                    content.trim() && !hasLink
                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-primary/20"
                                        : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                                )}
                            >
                                {isPosting ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Send className="w-3.5 h-3.5" />
                                )}
                                {pt ? 'Publicar' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
