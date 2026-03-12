import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPost } from '@/lib/communityService';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Image as ImageIcon, BarChart3, TrendingUp, AlertCircle, Share2, MessageSquare } from 'lucide-react';
import { CreatePostParams, PostType } from '@/types/community';

interface CreatePostModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function CreatePostModal({ open, onOpenChange, onSuccess }: CreatePostModalProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, watch, setValue } = useForm<CreatePostParams>({
        defaultValues: {
            post_type: 'insight'
        }
    });

    const postType = watch('post_type');

    const onSubmit = async (data: CreatePostParams) => {
        setLoading(true);
        try {
            const result = await createPost(data);

            if (result.success) {
                toast({
                    title: "Post criado com sucesso! 🎉",
                    description: "Você ganhou +10 XP por compartilhar com a comunidade.",
                    className: "bg-green-500 text-white border-none"
                });
                reset();
                onOpenChange(false);
                if (onSuccess) onSuccess();
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            toast({
                title: "Erro ao criar post",
                description: error.message || "Tente novamente mais tarde.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type: PostType) => {
        switch (type) {
            case 'analysis': return <BarChart3 className="w-4 h-4 mr-2" />;
            case 'insight': return <TrendingUp className="w-4 h-4 mr-2" />;
            case 'question': return <AlertCircle className="w-4 h-4 mr-2" />;
            case 'alert_share': return <Share2 className="w-4 h-4 mr-2" />;
            default: return <MessageSquare className="w-4 h-4 mr-2" />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Criar Novo Post</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tipo de Post</label>
                        <Select
                            onValueChange={(value) => setValue('post_type', value as PostType)}
                            defaultValue={postType}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="insight">
                                    <div className="flex items-center"><TrendingUp className="w-4 h-4 mr-2 text-green-500" /> Insight de Mercado</div>
                                </SelectItem>
                                <SelectItem value="analysis">
                                    <div className="flex items-center"><BarChart3 className="w-4 h-4 mr-2 text-blue-500" /> Análise Técnica</div>
                                </SelectItem>
                                <SelectItem value="question">
                                    <div className="flex items-center"><AlertCircle className="w-4 h-4 mr-2 text-orange-500" /> Dúvida / Pergunta</div>
                                </SelectItem>
                                <SelectItem value="alert_share">
                                    <div className="flex items-center"><Share2 className="w-4 h-4 mr-2 text-purple-500" /> Compartilhar Alerta</div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Conteúdo</label>
                        <Textarea
                            placeholder="O que você está pensando sobre o mercado hoje?"
                            className="min-h-[150px] resize-none"
                            {...register('content', { required: true, maxLength: 1000 })}
                        />
                        <div className="text-xs text-muted-foreground text-right">
                            {watch('content')?.length || 0}/1000
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" className="gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Adicionar Mídia
                        </Button>
                        <Button type="button" variant="outline" size="sm" className="gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Vincular Token
                        </Button>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit" disabled={loading || !watch('content')}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Publicar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
