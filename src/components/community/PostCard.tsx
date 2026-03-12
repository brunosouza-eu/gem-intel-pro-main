/**
 * 💎 Post Card — Premium Compact Design
 * Instagram/Binance-style post card with truncation & drawer comments
 */
import React, { useState, useMemo } from 'react';
import { Post } from '@/types/community';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Heart,
    MessageCircle,
    Share2,
    MoreHorizontal,
    TrendingUp,
    BarChart3,
    HelpCircle,
    Bell,
    MessageSquare,
    Bookmark,
    Copy,
    Flag,
    Trash2,
    ExternalLink,
    Crown,
    Edit2,
    Loader2,
    Eye
} from 'lucide-react';
import { cn, safeFormatDistance } from '@/lib/utils';
import { togglePostLike, deletePost, updatePost } from '@/lib/communityService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const CONTENT_MAX_LENGTH = 280;

interface PostCardProps {
    post: Post;
    onLike?: (postId: string, newLikesCount: number, liked: boolean) => void;
    onCommentOpen?: (post: Post) => void;
    onDelete?: (postId: string) => void;
}

export function PostCard({ post, onLike, onCommentOpen, onDelete }: PostCardProps) {
    const { user, isAdmin } = useAuth();
    const { toast } = useToast();
    const { language } = useLanguage();
    const pt = language === 'pt';

    const [isLiked, setIsLiked] = useState(post.user_liked);
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const [isLiking, setIsLiking] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likeAnimation, setLikeAnimation] = useState(false);
    const [expanded, setExpanded] = useState(false);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [isSaving, setIsSaving] = useState(false);

    const isOwner = user?.id === post.user_id;
    const isLongContent = post.content.length > CONTENT_MAX_LENGTH;

    // Fake view count based on likes + comments + deterministic hash
    const viewCount = useMemo(() => {
        const hash = post.id.charCodeAt(0) + post.id.charCodeAt(post.id.length - 1);
        return (post.likes_count + post.comments_count) * 3 + hash % 50 + 12;
    }, [post.id, post.likes_count, post.comments_count]);

    const handleLike = async () => {
        if (!user) return;
        setLikeAnimation(true);
        setTimeout(() => setLikeAnimation(false), 300);

        const previousLiked = isLiked;
        const previousCount = likesCount;
        const newLiked = !isLiked;
        const newCount = newLiked ? likesCount + 1 : likesCount - 1;

        setIsLiked(newLiked);
        setLikesCount(newCount);
        setIsLiking(true);

        try {
            const result = await togglePostLike(post.id);
            if (result.success && result.likes_count !== undefined) {
                setLikesCount(result.likes_count);
                if (onLike) onLike(post.id, result.likes_count, !!result.liked);
            } else {
                setIsLiked(previousLiked);
                setLikesCount(previousCount);
            }
        } catch {
            setIsLiked(previousLiked);
            setLikesCount(previousCount);
        } finally {
            setIsLiking(false);
        }
    };

    const handleDelete = async () => {
        if (!isOwner && !isAdmin) return;
        const success = await deletePost(post.id);
        if (success) {
            toast({ title: pt ? 'Post deletado' : 'Post deleted' });
            onDelete?.(post.id);
        }
        setShowMenu(false);
    };

    const handleEdit = async () => {
        if (!editContent.trim() || editContent === post.content) return;
        setIsSaving(true);
        const success = await updatePost(post.id, editContent.trim());
        if (success) {
            toast({ title: pt ? 'Post atualizado' : 'Post updated' });
            post.content = editContent.trim();
            setIsEditing(false);
            setShowMenu(false);
        } else {
            toast({ title: pt ? 'Erro ao atualizar' : 'Error updating', variant: 'destructive' });
        }
        setIsSaving(false);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.origin + '/community?post=' + post.id);
        toast({ title: pt ? 'Link copiado!' : 'Link copied!' });
    };

    const getPostTypeConfig = () => {
        switch (post.post_type) {
            case 'analysis': return {
                icon: <BarChart3 className="w-3 h-3" />,
                label: pt ? 'Análise' : 'Analysis',
                class: 'bg-blue-500/15 text-blue-400 border-blue-500/25'
            };
            case 'insight': return {
                icon: <TrendingUp className="w-3 h-3" />,
                label: 'Insight',
                class: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
            };
            case 'question': return {
                icon: <HelpCircle className="w-3 h-3" />,
                label: pt ? 'Dúvida' : 'Question',
                class: 'bg-amber-500/15 text-amber-400 border-amber-500/25'
            };
            case 'alert_share': return {
                icon: <Bell className="w-3 h-3" />,
                label: pt ? 'Alerta' : 'Alert',
                class: 'bg-purple-500/15 text-purple-400 border-purple-500/25'
            };
            default: return {
                icon: <MessageSquare className="w-3 h-3" />,
                label: pt ? 'Geral' : 'General',
                class: 'bg-muted text-muted-foreground border-border'
            };
        }
    };

    const renderContent = (text: string) => {
        const displayText = (!expanded && isLongContent) ? text.slice(0, CONTENT_MAX_LENGTH) : text;
        const parts = displayText.split(/(\$[A-Z]{2,10})/g);
        return parts.map((part, i) =>
            part.match(/^\$[A-Z]{2,10}$/)
                ? <span key={i} className="text-primary font-semibold cursor-pointer hover:underline">{part}</span>
                : <span key={i}>{part}</span>
        );
    };

    const typeConfig = getPostTypeConfig();

    return (
        <div className={cn(
            "group rounded-2xl overflow-hidden transition-all duration-300",
            "bg-card/60 backdrop-blur-sm border border-border/40",
            "hover:border-border/80 hover:bg-card/80",
            "hover:shadow-lg hover:shadow-black/5"
        )}>
            {/* Header */}
            <div className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                        <Avatar className="w-10 h-10 ring-2 ring-border/50 cursor-pointer hover:ring-primary/30 transition-all">
                            <AvatarImage src={post.avatar_url || ''} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold">
                                {post.username?.substring(0, 2).toUpperCase() || 'AN'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-sm hover:text-primary cursor-pointer transition-colors">
                                    {post.username || 'Anônimo'}
                                </span>
                                {post.level && post.level >= 5 && (
                                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                                )}
                                {post.level && (
                                    <span className={cn(
                                        "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                                        post.level >= 7 ? "bg-amber-500/10 text-amber-400" :
                                            post.level >= 4 ? "bg-blue-500/10 text-blue-400" :
                                                "bg-muted/50 text-muted-foreground"
                                    )}>
                                        Lvl {post.level}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className={cn(
                                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border",
                                    typeConfig.class
                                )}>
                                    {typeConfig.icon}
                                    {typeConfig.label}
                                </div>
                                <span className="text-[11px] text-muted-foreground">
                                    {safeFormatDistance(post.created_at, pt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* More menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                                <div className={cn(
                                    "absolute right-0 top-8 z-50 w-44 rounded-xl overflow-hidden",
                                    "bg-card border border-border shadow-xl shadow-black/20",
                                    "animate-in fade-in-0 zoom-in-95 duration-150"
                                )}>
                                    <button
                                        onClick={handleShare}
                                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-muted/50 transition-colors"
                                    >
                                        <Copy className="w-3.5 h-3.5" /> {pt ? 'Copiar link' : 'Copy link'}
                                    </button>
                                    {(isOwner || isAdmin) && (
                                        <>
                                            <button
                                                onClick={() => { setIsEditing(true); setShowMenu(false); }}
                                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-muted/50 transition-colors"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" /> {pt ? 'Editar' : 'Edit'}
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> {pt ? 'Deletar' : 'Delete'}
                                            </button>
                                        </>
                                    )}
                                    {(!isOwner && !isAdmin) && (
                                        <button
                                            onClick={() => setShowMenu(false)}
                                            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-muted/50 transition-colors"
                                        >
                                            <Flag className="w-3.5 h-3.5" /> {pt ? 'Reportar' : 'Report'}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
                {isEditing ? (
                    <div className="space-y-3 mt-2 animate-in fade-in-0 duration-200">
                        <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[100px] text-sm resize-none bg-background/50 border-primary/20 focus:ring-primary/30"
                            placeholder={pt ? "O que você está pensando?" : "What's on your mind?"}
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setIsEditing(false); setEditContent(post.content); }}
                                disabled={isSaving}
                                className="h-8 text-xs"
                            >
                                {pt ? 'Cancelar' : 'Cancel'}
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleEdit}
                                disabled={isSaving || !editContent.trim() || editContent === post.content}
                                className="h-8 text-xs"
                            >
                                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                                {pt ? 'Salvar' : 'Save'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {renderContent(post.content)}
                            {isLongContent && !expanded && '...'}
                        </p>
                        {isLongContent && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="text-xs text-primary font-medium mt-1 hover:underline"
                            >
                                {expanded
                                    ? (pt ? 'Ver menos' : 'Show less')
                                    : (pt ? 'Ler mais' : 'Read more')
                                }
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Media */}
            {post.media_urls && post.media_urls.length > 0 && (
                <div className="rounded-xl overflow-hidden border border-border/30 mx-4 mb-3">
                    <img
                        src={post.media_urls[0]}
                        alt="Post attachment"
                        className="w-full h-auto max-h-[400px] object-cover hover:scale-[1.02] transition-transform duration-500"
                    />
                </div>
            )}

            {/* Token/Analysis Link */}
            {post.token_id && (
                <div className="mx-4 mb-3 p-3 rounded-xl border border-primary/15 bg-primary/5 flex items-center justify-between cursor-pointer hover:bg-primary/10 transition-colors group/link">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-primary">
                            {pt ? 'Ver Análise Vinculada' : 'View Linked Analysis'}
                        </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-primary group-hover/link:translate-x-0.5 transition-transform" />
                </div>
            )}

            {/* Action Bar */}
            <div className="px-3 py-1.5 flex items-center border-t border-border/20">
                {/* Like */}
                <button
                    onClick={handleLike}
                    disabled={isLiking}
                    className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                        isLiked
                            ? "text-red-400"
                            : "text-muted-foreground hover:text-red-400"
                    )}
                >
                    <Heart className={cn(
                        "w-[18px] h-[18px] transition-all",
                        isLiked && "fill-current",
                        likeAnimation && "scale-125"
                    )} />
                    {likesCount > 0 && <span>{likesCount}</span>}
                </button>

                {/* Comment — opens drawer */}
                <button
                    onClick={() => onCommentOpen?.(post)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-blue-400 transition-all"
                >
                    <MessageCircle className="w-[18px] h-[18px]" />
                    {post.comments_count > 0 && <span>{post.comments_count}</span>}
                </button>

                {/* Share */}
                <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-emerald-400 transition-all"
                >
                    <Share2 className="w-[18px] h-[18px]" />
                </button>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Views */}
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground/50 mr-2">
                    <Eye className="w-3.5 h-3.5" />
                    {viewCount}
                </span>

                {/* Bookmark */}
                <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={cn(
                        "p-1.5 rounded-lg transition-all",
                        isBookmarked
                            ? "text-amber-400"
                            : "text-muted-foreground hover:text-amber-400"
                    )}
                >
                    <Bookmark className={cn("w-[18px] h-[18px]", isBookmarked && "fill-current")} />
                </button>
            </div>
        </div>
    );
}
