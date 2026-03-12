import React, { useEffect, useState } from 'react';
import { UserCard } from './UserCard';
import { getFollowers, getFollowing, toggleFollow, isFollowing as checkIsFollowing } from '@/lib/communityService';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FollowersListProps {
    userId: string;
    type: 'followers' | 'following';
}

export function FollowersList({ userId, type }: FollowersListProps) {
    const { toast } = useToast();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

    useEffect(() => {
        loadUsers();
    }, [userId, type]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = type === 'followers'
                ? await getFollowers(userId)
                : await getFollowing(userId);

            setUsers(data);

            // Check following status for each user
            const statusMap: Record<string, boolean> = {};
            for (const user of data) {
                if (user?.id) {
                    statusMap[user.id] = await checkIsFollowing(user.id);
                }
            }
            setFollowingMap(statusMap);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollowClick = async (targetUserId: string) => {
        try {
            const result = await toggleFollow(targetUserId);
            if (result.success) {
                setFollowingMap(prev => ({
                    ...prev,
                    [targetUserId]: result.following || false
                }));

                toast({
                    title: result.following ? "Seguindo! 🎉" : "Deixou de seguir",
                    description: result.following
                        ? "Você ganhou +5 XP por seguir este trader."
                        : "Você deixou de seguir este usuário.",
                    className: result.following ? "bg-green-500 text-white border-none" : ""
                });

                // Refresh list if following changed in followers tab
                if (type === 'followers') {
                    loadUsers();
                }
            }
        } catch (error) {
            toast({
                title: "Erro ao seguir",
                variant: "destructive"
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                <p className="text-sm">
                    {type === 'followers'
                        ? 'Ainda não tem seguidores.'
                        : 'Ainda não está seguindo ninguém.'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {users.map((user) => user && (
                <UserCard
                    key={user.id}
                    user={user}
                    isFollowing={followingMap[user.id]}
                    onFollowClick={handleFollowClick}
                    showFollowButton={true}
                    compact={true}
                />
            ))}
        </div>
    );
}
