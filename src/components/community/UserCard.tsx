import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserCardProps {
    user: {
        id: string;
        username?: string;
        avatar_url?: string;
        level?: number;
        followers_count?: number;
        following_count?: number;
        posts_count?: number;
        bio?: string;
    };
    isFollowing?: boolean;
    onFollowClick?: (userId: string) => void;
    showFollowButton?: boolean;
    compact?: boolean;
}

export function UserCard({
    user,
    isFollowing = false,
    onFollowClick,
    showFollowButton = true,
    compact = false
}: UserCardProps) {
    return (
        <Card className={cn(
            "overflow-hidden hover:border-primary/20 transition-all cursor-pointer",
            compact && "border-0 shadow-none"
        )}>
            <CardContent className={cn("p-4", compact && "p-3")}>
                <div className="flex items-start gap-3">
                    <Avatar className={cn("cursor-pointer", compact ? "w-10 h-10" : "w-12 h-12")}>
                        <AvatarImage src={user.avatar_url || ''} />
                        <AvatarFallback>{user.username?.substring(0, 2).toUpperCase() || 'AN'}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className={cn(
                                "font-semibold truncate",
                                compact ? "text-sm" : "text-base"
                            )}>
                                {user.username || 'Anônimo'}
                            </h3>
                            {user.level && (
                                <Badge variant="outline" className="text-[10px] h-4 px-1 border-yellow-500/50 text-yellow-500 bg-yellow-500/10">
                                    Lvl {user.level}
                                </Badge>
                            )}
                        </div>

                        {user.bio && !compact && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                {user.bio}
                            </p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>{user.followers_count || 0} seguidores</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                <span>{user.posts_count || 0} posts</span>
                            </div>
                        </div>
                    </div>

                    {showFollowButton && onFollowClick && (
                        <Button
                            size="sm"
                            variant={isFollowing ? "outline" : "default"}
                            onClick={(e) => {
                                e.stopPropagation();
                                onFollowClick(user.id);
                            }}
                            className={cn(
                                "shrink-0",
                                compact && "h-8 text-xs"
                            )}
                        >
                            {isFollowing ? 'Seguindo' : 'Seguir'}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
