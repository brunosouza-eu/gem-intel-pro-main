import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// ===== TYPES =====

export type PlanType = 'free' | 'pro' | 'elite';
export type AccountType = 'real' | 'bot';
export type UserRole = 'admin' | 'moderator' | 'user';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  plan: PlanType;
  credits: number;
  is_blocked: boolean;
  blocked_at: string | null;
  blocked_reason: string | null;
  last_login_at: string | null;
  login_count: number;
  provider: string;
  is_admin: boolean;
  is_moderator: boolean;
  account_type: AccountType;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  total_users: number;
  pro_users: number;
  elite_users: number;
  free_users: number;
  admin_users: number;
  moderator_users: number;
  bot_accounts: number;
  blocked_users: number;
  total_credits_in_circulation: number;
  new_users_7d: number;
  new_users_30d: number;
  credits_spent_30d: number;
  credits_earned_30d: number;
  active_users_7d: number;
}

export interface CreditTransaction {
  id: string;
  amount: number;
  type: string;
  source: string;
  description: string | null;
  balance_after: number;
  created_at: string;
}

export interface UserDetails {
  user: AdminUser;
  recent_transactions: CreditTransaction[];
}

// ===== HOOK =====

export const useAdmin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    total_users: 0,
    pro_users: 0,
    elite_users: 0,
    free_users: 0,
    admin_users: 0,
    moderator_users: 0,
    bot_accounts: 0,
    blocked_users: 0,
    total_credits_in_circulation: 0,
    new_users_7d: 0,
    new_users_30d: 0,
    credits_spent_30d: 0,
    credits_earned_30d: 0,
    active_users_7d: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Check admin/moderator status
  const checkAdminStatus = useCallback(async () => {
    if (!user) {
      setIsAdmin(false);
      setIsModerator(false);
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const roles = (data || []).map((r: any) => r.role);
      setIsAdmin(roles.includes('admin'));
      setIsModerator(roles.includes('moderator'));
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setIsModerator(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    if (!isAdmin && !isModerator) return;

    try {
      // @ts-expect-error - RPC not typed
      const { data, error } = await supabase.rpc('admin_get_users');

      if (error) {
        console.warn('RPC admin_get_users not available, using fallback:', error.message);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: allRoles } = await supabase
          .from('user_roles')
          .select('user_id, role');

        const roleMap: Record<string, string[]> = {};
        (allRoles || []).forEach((r: any) => {
          if (!roleMap[r.user_id]) roleMap[r.user_id] = [];
          roleMap[r.user_id].push(r.role);
        });

        const fallbackUsers: AdminUser[] = (profiles || []).map((p: any) => {
          const userRoles = roleMap[p.id] || [];
          return {
            id: String(p.id),
            email: p.email || 'N/A',
            full_name: p.full_name || null,
            avatar_url: p.avatar_url || null,
            phone: p.phone || null,
            plan: (p.plan || 'free') as PlanType,
            credits: p.credits || 0,
            is_blocked: p.is_blocked || false,
            blocked_at: p.blocked_at || null,
            blocked_reason: p.blocked_reason || null,
            last_login_at: p.last_login_at || null,
            login_count: p.login_count || 0,
            provider: p.provider || 'email',
            is_admin: userRoles.includes('admin'),
            is_moderator: userRoles.includes('moderator'),
            account_type: userRoles.includes('bot') ? 'bot' as AccountType : 'real' as AccountType,
            created_at: p.created_at,
            updated_at: p.updated_at,
          };
        });

        setUsers(fallbackUsers);
        return;
      }

      setUsers((data || []) as unknown as AdminUser[]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao carregar usuários' });
    }
  }, [isAdmin, isModerator, toast]);

  // Fetch stats (computed from users)
  const fetchStats = useCallback(async () => {
    if (!isAdmin && !isModerator) return;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const computedStats: AdminStats = {
      total_users: users.filter(u => u.account_type !== 'bot').length,
      pro_users: users.filter(u => u.plan === 'pro' && u.account_type !== 'bot').length,
      elite_users: users.filter(u => u.plan === 'elite' && u.account_type !== 'bot').length,
      free_users: users.filter(u => u.plan === 'free' && u.account_type !== 'bot').length,
      admin_users: users.filter(u => u.is_admin).length,
      moderator_users: users.filter(u => u.is_moderator).length,
      bot_accounts: users.filter(u => u.account_type === 'bot').length,
      blocked_users: users.filter(u => u.is_blocked).length,
      total_credits_in_circulation: users.reduce((sum, u) => sum + (u.credits || 0), 0),
      new_users_7d: users.filter(u => new Date(u.created_at) >= sevenDaysAgo).length,
      new_users_30d: users.filter(u => new Date(u.created_at) >= thirtyDaysAgo).length,
      credits_spent_30d: 0,
      credits_earned_30d: 0,
      active_users_7d: users.filter(u => u.last_login_at && new Date(u.last_login_at) >= sevenDaysAgo).length,
    };
    setStats(computedStats);
  }, [isAdmin, isModerator, users]);

  // Block user
  const blockUser = async (userId: string, reason: string) => {
    try {
      // @ts-expect-error - RPC
      const { error } = await supabase.rpc('admin_block_user', { p_user_id: userId, p_reason: reason });
      if (error) {
        // Fallback
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ is_blocked: true, blocked_at: new Date().toISOString(), blocked_reason: reason } as any)
          .eq('id', userId);
        if (updateError) throw updateError;
      }
      toast({ title: '🔒 Usuário bloqueado', description: reason });
      await fetchUsers();
      return true;
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro', description: error.message });
      return false;
    }
  };

  // Unblock user
  const unblockUser = async (userId: string) => {
    try {
      // @ts-expect-error - RPC
      const { error } = await supabase.rpc('admin_unblock_user', { p_user_id: userId });
      if (error) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ is_blocked: false, blocked_at: null, blocked_reason: null } as any)
          .eq('id', userId);
        if (updateError) throw updateError;
      }
      toast({ title: '🔓 Usuário desbloqueado' });
      await fetchUsers();
      return true;
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro', description: error.message });
      return false;
    }
  };

  // Adjust credits
  const adjustCredits = async (userId: string, amount: number, reason: string) => {
    try {
      // @ts-expect-error - RPC
      const { error } = await supabase.rpc('admin_adjust_credits', { p_user_id: userId, p_amount: amount, p_reason: reason });
      if (error) {
        // Fallback: direct update
        const targetUser = users.find(u => u.id === userId);
        if (targetUser) {
          const newBalance = Math.max(0, (targetUser.credits || 0) + amount);
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ credits: newBalance } as any)
            .eq('id', userId);
          if (updateError) throw updateError;
        }
      }
      toast({
        title: amount > 0 ? '💰 Créditos adicionados' : '💸 Créditos removidos',
        description: `${Math.abs(amount)} créditos. ${reason}`,
      });
      await fetchUsers();
      return true;
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro', description: error.message });
      return false;
    }
  };

  // Change plan (Free / Pro / Elite)
  const updateUserPlan = async (userId: string, newPlan: PlanType) => {
    try {
      // @ts-expect-error - RPC
      const { error } = await supabase.rpc('admin_change_plan', { p_user_id: userId, p_new_plan: newPlan });
      if (error) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ plan: newPlan, updated_at: new Date().toISOString() } as any)
          .eq('id', userId);
        if (updateError) throw updateError;
      }
      toast({ title: '📋 Plano atualizado', description: `Plano alterado para ${newPlan.toUpperCase()}` });
      await fetchUsers();
      return true;
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro', description: error.message });
      return false;
    }
  };

  // Toggle admin role
  const toggleAdminRole = async (userId: string, currentlyAdmin: boolean) => {
    try {
      if (currentlyAdmin) {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');
        if (error) throw error;
        toast({ title: '🛡️ Admin removido' });
      } else {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' } as any);
        if (error) throw error;
        toast({ title: '🛡️ Admin concedido' });
      }
      await fetchUsers();
      return true;
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro', description: error.message });
      return false;
    }
  };

  // Toggle moderator role
  const toggleModeratorRole = async (userId: string, currentlyModerator: boolean) => {
    try {
      if (currentlyModerator) {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'moderator');
        if (error) throw error;
        toast({ title: '🟣 Moderador removido' });
      } else {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'moderator' } as any);
        if (error) throw error;
        toast({ title: '🟣 Moderador concedido' });
      }
      await fetchUsers();
      return true;
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro', description: error.message });
      return false;
    }
  };

  // Toggle bot account type
  const toggleBotAccount = async (userId: string, currentlyBot: boolean) => {
    try {
      if (currentlyBot) {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'bot');
        if (error) throw error;
        toast({ title: '🤖 Conta desmarcada como Bot' });
      } else {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'bot' } as any);
        if (error) throw error;
        toast({ title: '🤖 Conta marcada como Bot' });
      }
      await fetchUsers();
      return true;
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro', description: error.message });
      return false;
    }
  };

  // Delete user
  const deleteUser = async (userId: string) => {
    try {
      // Delete roles first
      await supabase.from('user_roles').delete().eq('user_id', userId);
      // Delete profile
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;
      toast({ title: '🗑️ Conta excluída', description: 'O perfil do usuário foi removido permanentemente.' });
      await fetchUsers();
      return true;
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro ao excluir', description: error.message });
      return false;
    }
  };

  // Get user details
  const getUserDetails = async (userId: string): Promise<UserDetails | null> => {
    try {
      // @ts-expect-error - RPC
      const { data, error } = await supabase.rpc('admin_get_user_details', { p_user_id: userId });
      if (error) throw error;
      return data as unknown as UserDetails;
    } catch (error) {
      console.error('Error getting user details:', error);
      return null;
    }
  };

  // Filtered users
  const filteredUsers = users.filter(u => {
    const matchesSearch = searchQuery === '' ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlan = filterPlan === 'all' || u.plan === filterPlan;

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && !u.is_blocked && u.account_type !== 'bot') ||
      (filterStatus === 'blocked' && u.is_blocked) ||
      (filterStatus === 'admin' && u.is_admin) ||
      (filterStatus === 'moderator' && u.is_moderator) ||
      (filterStatus === 'bot' && u.account_type === 'bot');

    return matchesSearch && matchesPlan && matchesStatus;
  });

  useEffect(() => { checkAdminStatus(); }, [checkAdminStatus]);
  useEffect(() => { if (isAdmin || isModerator) fetchUsers(); }, [isAdmin, isModerator, fetchUsers]);
  useEffect(() => { if ((isAdmin || isModerator) && users.length > 0) fetchStats(); }, [isAdmin, isModerator, users.length, fetchStats]);

  return {
    isAdmin,
    isModerator,
    loading,
    users: filteredUsers,
    allUsers: users,
    stats,
    searchQuery, setSearchQuery,
    filterPlan, setFilterPlan,
    filterStatus, setFilterStatus,
    fetchUsers, fetchStats,
    updateUserPlan,
    toggleAdminRole,
    toggleModeratorRole,
    toggleBotAccount,
    deleteUser,
    blockUser, unblockUser,
    adjustCredits,
    getUserDetails,
  };
};
