/**
 * 💬 Comment Drawer — Instagram-style slide-up comments
 * Overlay drawer that shows comments without pushing the feed
 */
import React, { useState, useEffect, useRef } from 'react';
import { Post, PostComment } from '@/types/community';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getPostComments, addComment, toggleCommentLike, deleteComment } from '@/lib/communityService';
import { X, Send, Heart, Trash2, Loader2 } from 'lucide-react';
import { cn, safeFormatDistance } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';

interface CommentDrawerProps {
    post: Post | null;
    isOpen: boolean;
    onClose: () => void;
}

export function CommentDrawer({ post, isOpen, onClose }: CommentDrawerProps) {
    const { user, isAdmin } = useAuth();
    const { language } = useLanguage();
    const pt = language === 'pt';

    const [comments, setComments] = useState<PostComment[]>([]);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const commentsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && post) {
            loadComments();
            setTimeout(() => inputRef.current?.focus(), 300);
        }
        if (!isOpen) {
            setComments([]);
            setContent('');
        }
    }, [isOpen, post]);

    const loadComments = async () => {
        if (!post) return;
        setLoading(true);
        const data = await getPostComments(post.id);
        setComments(data);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !post || !user) return;

        setSubmitting(true);
        const result = await addComment({ post_id: post.id, content: content.trim() });
        if (result.success && result.comment) {
            setComments(prev => [...prev, result.comment!]);
            setContent('');
            setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        } else {
            toast({ title: result.error || (pt ? 'Erro ao comentar' : 'Error commenting'), variant: 'destructive' });
        }
        setSubmitting(false);
    };

    const handleLike = async (commentId: string) => {
        const result = await toggleCommentLike(commentId);
        if (result.success) {
            setComments(prev => prev.map(c =>
                c.id === commentId
                    ? { ...c, user_liked: result.liked, likes_count: result.likes_count ?? c.likes_count }
                    : c
            ));
        }
    };

    const handleDelete = async (commentId: string) => {
        const success = await deleteComment(commentId);
        if (success) {
            setComments(prev => prev.filter(c => c.id !== commentId));
        }
    };

    if (!isOpen || !post) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={cn(
                "fixed z-50 bg-card border-t border-border/50 rounded-t-3xl shadow-2xl shadow-black/50",
                "left-0 right-0 bottom-0",
                "max-h-[80vh] flex flex-col",
                "animate-in slide-in-from-bottom duration-300",
                // Desktop: centered modal style
                "lg:left-1/2 lg:-translate-x-1/2 lg:max-w-lg lg:rounded-3xl lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:max-h-[70vh]"
            )}>
                {/* Handle / Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/30 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-1 rounded-full bg-muted-foreground/30 lg:hidden mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
                        <h3 className="font-semibold text-sm">
                            {pt ? 'Comentários' : 'Comments'}
                            {comments.length > 0 && (
                                <span className="text-muted-foreground ml-1">({comments.length})</span>
                            )}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Original Post Summary */}
                <div className="px-4 py-3 border-b border-border/20 bg-muted/10 flex-shrink-0">
                    <div className="flex gap-2.5">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={post.avatar_url || ''} />
                            <AvatarFallback className="text-[10px] font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {post.username?.charAt(0)?.toUpperCase() || '?'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold">{post.username}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{post.content}</p>
                        </div>
                    </div>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px]">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-sm text-muted-foreground">
                                {pt ? 'Nenhum comentário ainda. Seja o primeiro!' : 'No comments yet. Be the first!'}
                            </p>
                        </div>
                    ) : (
                        comments.map(comment => (
                            <div key={comment.id} className="flex gap-2.5 group/comment">
                                <Avatar className="w-8 h-8 flex-shrink-0">
                                    <AvatarImage src={comment.avatar_url || ''} />
                                    <AvatarFallback className="text-[10px] font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                        {comment.username?.charAt(0)?.toUpperCase() || '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold">{comment.username || 'Anônimo'}</span>
                                        {comment.level && (
                                            <span className="text-[9px] text-muted-foreground">Lvl {comment.level}</span>
                                        )}
                                        <span className="text-[10px] text-muted-foreground">
                                            {safeFormatDistance(comment.created_at, pt)}
                                        </span>
                                    </div>
                                    <p className="text-sm mt-0.5 leading-relaxed">{comment.content}</p>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <button
                                            onClick={() => handleLike(comment.id)}
                                            className={cn(
                                                "flex items-center gap-1 text-[11px] transition-colors",
                                                comment.user_liked
                                                    ? "text-red-400"
                                                    : "text-muted-foreground hover:text-red-400"
                                            )}
                                        >
                                            <Heart className={cn("w-3 h-3", comment.user_liked && "fill-current")} />
                                            {comment.likes_count > 0 && comment.likes_count}
                                        </button>
                                        {(user?.id === comment.user_id || isAdmin) && (
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="text-[11px] text-muted-foreground hover:text-red-400 transition-colors opacity-0 group-hover/comment:opacity-100"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={commentsEndRef} />
                </div>

                {/* Input Bar — Fixed at bottom */}
                {user && (
                    <form
                        onSubmit={handleSubmit}
                        className="flex items-center gap-2 p-3 border-t border-border/30 bg-card flex-shrink-0"
                    >
                        <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="text-[10px] font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {user.email?.charAt(0)?.toUpperCase() || '?'}
                            </AvatarFallback>
                        </Avatar>
                        <input
                            ref={inputRef}
                            type="text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={pt ? 'Adicione um comentário...' : 'Add a comment...'}
                            className="flex-1 bg-muted/30 border border-border/30 rounded-full px-4 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30"
                            disabled={submitting}
                        />
                        <button
                            type="submit"
                            disabled={!content.trim() || submitting}
                            className={cn(
                                "p-2 rounded-full transition-all",
                                content.trim()
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                                    : "text-muted-foreground opacity-40"
                            )}
                        >
                            {submitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </button>
                    </form>
                )}
            </div>
        </>
    );
}
