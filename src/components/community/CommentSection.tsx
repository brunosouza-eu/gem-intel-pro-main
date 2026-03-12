import React, { useState, useEffect } from 'react';
import { Post, PostComment } from '@/types/community';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    addComment,
    getPostComments,
    toggleCommentLike,
    deleteComment,
    adminDeleteComment
} from '@/lib/communityService';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Send, Heart, Reply, Trash2 } from 'lucide-react';
import { cn, safeFormatDistance } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface CommentSectionProps {
    post: Post;
    isOpen: boolean;
}

export function CommentSection({ post, isOpen }: CommentSectionProps) {
    const { user, isAdmin } = useAuth();
    const { language } = useLanguage();
    const pt = language === 'pt';
    const [comments, setComments] = useState<PostComment[]>([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadComments();
        }
    }, [isOpen, post.id]);

    const loadComments = async () => {
        setLoading(true);
        try {
            const data = await getPostComments(post.id);
            setComments(data);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const result = await addComment({
                post_id: post.id,
                content: newComment.trim()
            });

            if (result.success && result.comment) {
                let commentId = Math.random().toString(36).substring(7); // Fallback ID
                if (typeof result.comment === 'string') {
                    commentId = result.comment;
                } else if (result.comment?.id) {
                    commentId = result.comment.id;
                }

                // Add optimistic comment with user data
                const optimisticComment: PostComment = {
                    ...(typeof result.comment === 'object' ? result.comment : {}),
                    id: commentId,
                    post_id: post.id,
                    content: newComment.trim(),
                    likes_count: 0,
                    user_liked: false,
                    user_id: user?.id || '',
                    username: user?.user_metadata?.username || 'Você',
                    avatar_url: user?.user_metadata?.avatar_url,
                    level: user?.user_metadata?.level,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };

                setComments(prev => [optimisticComment, ...prev]);
                setNewComment('');

                // Immediately reload from server to get the real ID to prevent delete errors
                loadComments();
                toast({
                    title: "+5 XP Ganhos! 🎯",
                    description: "Obrigado por contribuir com a discussão.",
                    className: "bg-green-500 text-white border-none h-12"
                });
            }
        } catch (error) {
            toast({
                title: "Erro ao comentar",
                variant: "destructive"
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (commentId: string) => {
        // Optimistic UI update
        setComments(prev => prev.map(c => {
            if (c.id === commentId) {
                const isLiked = c.user_liked;
                return {
                    ...c,
                    user_liked: !isLiked,
                    likes_count: isLiked ? (c.likes_count || 1) - 1 : (c.likes_count || 0) + 1
                };
            }
            return c;
        }));

        try {
            await toggleCommentLike(commentId);
        } catch (error) {
            console.error(error);
            // Revert on error
            setComments(prev => prev.map(c => {
                if (c.id === commentId) {
                    const isLiked = c.user_liked;
                    return {
                        ...c,
                        user_liked: !isLiked,
                        likes_count: isLiked ? (c.likes_count || 1) - 1 : (c.likes_count || 0) + 1
                    };
                }
                return c;
            }));
            toast({ title: pt ? 'Erro ao curtir' : 'Error liking', variant: 'destructive' });
        }
    };

    const handleDelete = async (commentId: string, commentUserId: string) => {
        try {
            if (isAdmin && commentUserId !== user?.id) {
                await adminDeleteComment(commentId);
            } else {
                await deleteComment(commentId);
            }
            setComments(prev => prev.filter(c => c.id !== commentId));
            toast({ title: pt ? 'Comentário deletado' : 'Comment deleted' });
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast({ title: pt ? 'Erro ao deletar' : 'Error deleting', variant: 'destructive' });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="bg-muted/30 p-4 border-t animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>EU</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                    <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Adicione um comentário..."
                        className="min-h-[40px] h-[40px] py-2 resize-none text-sm"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={submitting || !newComment.trim()}
                        className="h-[40px] w-[40px] shrink-0"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </div>
            </form>

            {loading ? (
                <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-4 text-xs text-muted-foreground">
                    Seja o primeiro a comentar!
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map(comment => (
                        <div key={comment.id} className="flex gap-3 text-sm">
                            <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80">
                                <AvatarImage src={comment.avatar_url || ''} />
                                <AvatarFallback>{comment.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-xs hover:underline cursor-pointer">{comment.username}</span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {safeFormatDistance(comment.created_at, pt)}
                                    </span>
                                </div>
                                <p className="text-foreground/90 leading-relaxed">{comment.content}</p>

                                <div className="flex items-center gap-4 mt-1">
                                    <button
                                        onClick={() => handleLike(comment.id)}
                                        className={cn(
                                            "flex items-center gap-1 text-[10px] transition-colors",
                                            comment.user_liked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-500"
                                        )}
                                    >
                                        <Heart className={cn("w-3 h-3", comment.user_liked && "fill-current")} />
                                        {comment.likes_count > 0 && <span>{comment.likes_count}</span>}
                                        {pt ? 'Curtir' : 'Like'}
                                    </button>
                                    <button
                                        onClick={() => setNewComment(`@${comment.username} `)}
                                        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-blue-500 transition-colors"
                                    >
                                        <Reply className="w-3 h-3" />
                                        {pt ? 'Responder' : 'Reply'}
                                    </button>
                                    {(isAdmin || comment.user_id === user?.id) && (
                                        <button
                                            onClick={() => handleDelete(comment.id, comment.user_id)}
                                            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-red-500 transition-colors ml-auto"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            {pt ? 'Deletar' : 'Delete'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
