/**
 * 📸 Stories Bar — Instagram-style active users showcase
 * Horizontal scrollable bar with glowing avatar circles
 */
import React, { useEffect, useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { getTopTraders } from '@/lib/communityService';
import type { TopTrader } from '@/types/community';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function StoriesBar() {
    const [users, setUsers] = useState<TopTrader[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        getTopTraders(15).then(setUsers);
    }, []);

    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    };

    useEffect(() => {
        checkScroll();
        const el = scrollRef.current;
        if (el) el.addEventListener('scroll', checkScroll);
        return () => { if (el) el.removeEventListener('scroll', checkScroll); };
    }, [users]);

    const scroll = (dir: 'left' | 'right') => {
        scrollRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    };

    if (users.length === 0) return null;

    const getLevelGradient = (level: number) => {
        if (level >= 7) return 'from-amber-400 via-orange-500 to-red-500';
        if (level >= 4) return 'from-blue-400 via-purple-500 to-pink-500';
        return 'from-emerald-400 via-cyan-500 to-blue-500';
    };

    return (
        <div className="relative group/stories">
            {/* Scroll Arrows */}
            {canScrollLeft && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card/90 border border-border/50 shadow-lg flex items-center justify-center opacity-0 group-hover/stories:opacity-100 transition-opacity hover:bg-card"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
            )}
            {canScrollRight && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card/90 border border-border/50 shadow-lg flex items-center justify-center opacity-0 group-hover/stories:opacity-100 transition-opacity hover:bg-card"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            )}

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-1"
            >
                {users.map((user, i) => (
                    <div
                        key={user.user_id}
                        className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group/avatar"
                    >
                        {/* Gradient ring wrap */}
                        <div className={cn(
                            "p-[2.5px] rounded-full bg-gradient-to-br transition-transform group-hover/avatar:scale-110",
                            getLevelGradient(user.level)
                        )}>
                            <div className="p-[2px] rounded-full bg-background">
                                <Avatar className="w-14 h-14">
                                    <AvatarImage src={user.avatar_url || ''} />
                                    <AvatarFallback className={cn(
                                        "text-sm font-bold text-white bg-gradient-to-br",
                                        getLevelGradient(user.level)
                                    )}>
                                        {user.username?.charAt(0)?.toUpperCase() || '?'}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                        {/* Online indicator */}
                        <div className="relative -mt-4 ml-9">
                            <div className={cn(
                                "w-3.5 h-3.5 rounded-full border-2 border-background",
                                // Simulate "online" for first 5 users
                                i < 5 ? "bg-emerald-400 shadow-lg shadow-emerald-400/50" : "bg-gray-500"
                            )} />
                        </div>
                        <span className="text-[10px] text-muted-foreground truncate w-16 text-center mt-0.5 group-hover/avatar:text-foreground transition-colors">
                            {user.username?.split('.')[0] || 'user'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
