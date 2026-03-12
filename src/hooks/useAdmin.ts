import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// ===== TYPES =====

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  plan: 'free' | 'pro';
  credits: number;
  is_blocked: boolean;
  blocked_at: string | null;
  blocked_reason: string | null;
  last_login_at: string | null;
  login_count: number;
  provider: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  total_users: number;
  pro_users: number;
  free_users: number;
  admin_users: number;
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
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    total_users: 0,
    pro_users: 0,
    free_users: 0,
    admin_users: 0,
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

  // Check admin status
  const checkAdminStatus = useCallback(async () => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      setIsAdmin(!!data);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch all users (via RPC)
  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;

    try {
      // @ts-expect-error - RPC not typed in current Supabase types
      const { data, error } = await supabase.rpc('admin_get_users');

      if (error) {
        // Fallback to old method if RPC doesn't exist yet
        console.warn('RPC admin_get_users not available, using fallback:', error.message);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: adminRoles } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin');

        const adminUserIds = new Set(adminRoles?.map(r => r.user_id) || []);

        const fallbackUsers: AdminUser[] = (profiles || []).map((p: any) => ({
          id: String(p.id),
          email: p.email || 'N/A',
          full_name: p.full_name || null,
          avatar_url: p.avatar_url || null,
          phone: p.phone || null,
          plan: (p.plan || 'free') as 'free' | 'pro',
          credits: p.credits || 0,
          is_blocked: p.is_blocked || false,
          blocked_at: p.blocked_at || null,
          blocked_reason: p.blocked_reason || null,
          last_login_at: p.last_login_at || null,
          login_count: p.login_count || 0,
          provider: p.provider || 'email',
          is_admin: adminUserIds.has(p.id),
          created_at: p.created_at,
          updated_at: p.updated_at,
        }));

        setUsers(fallbackUsers);
        return;
      }

      setUsers((data || []) as unknown as AdminUser[]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Falha ao carregar usuários',
      });
    }
  }, [isAdmin, toast]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    if (!isAdmin) return;

    try {
      // @ts-expect-error - RPC not typed in current Supabase types
      const { data, error } = await supabase.rpc('admin_get_stats');

      if (error) {
        // Fallback stats
        console.warn('RPC admin_get_stats not available:', error.message);
        const computedStats: AdminStats = {
          total_users: users.length,
          pro_users: users.filter(u => u.plan === 'pro').length,
          free_users: users.filter(u => u.plan !== 'pro').length,
          admin_users: users.filter(u => u.is_admin).length,
          blocked_users: users.filter(u => u.is_blocked).length,
          total_credits_in_circulation: users.reduce((sum, u) => sum + (u.credits || 0), 0),
          new_users_7d: 0,
          new_users_30d: 0,
          credits_spent_30d: 0,
          credits_earned_30d: 0,
          active_users_7d: 0,
        };
        setStats(computedStats);
        return;
      }

      if (data) setStats(data as unknown as AdminStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [isAdmin, users]);

  // Block user
  const blockUser = async (userId: string, reason: string) => {
    try {
      // @ts-expect-error - RPC not typed in current Supabase types
      const { data, error } = await supabase.rpc('admin_block_user', {
        p_user_id: userId,
        p_reason: reason,
      });

      if (error) throw error;

      toast({ title: '🔒 Usuário bloqueado', description: reason });
      await fetchUsers();
      return true;
    } catch (error: any) {
      console.error('Error blocking user:', error);
      toast({ variant: 'destructive', title: 'Erro', description: error.message });
      return false;
    }
  };

  // Unblock user
  const unblockUser = async (userId: string) => {
    try {
      // @ts-expect-error - RPC not typed in current Supabase types
      const { data, error } = await supabase.rpc('admin_unblock_user', {
        p_user_id: userId,
      });

      if (error) throw error;

      toast({ title: '🔓 Usuário desbloqueado' });
      await fetchUsers();
      return true;
    } catch (error: any) {
      console.error('Error unblocking user:', error);
      toast({ variant: 'destructive', title: 'Erro', description: error.message });
      return false;
    }
  };

  // Adjust credits
  const adjustCredits = async (userId: string, amount: number, reason: string) => {
    try {
      // @ts-expect-error - RPC not typed in current Supabase types
      const { data, error } = await supabase.rpc('admin_adjust_credits', {
        p_user_id: userId,
        p_amount: amount,
        p_reason: reason,
      });

      if (error) throw error;

      toast({
        title: amount > 0 ? '💰 Créditos adicionados' : '💸 Créditos removidos',
        description: `${Math.abs(amount)} créditos ${amount > 0 ? 'adicionados' : 'removidos'}. ${reason}`,
      });
      await fetchUsers();
      return true;
    } catch (error: any) {
      console.error('Error adjusting credits:', error);
      toast({ variant: 'destructive', title: 'Erro', description: error.message });
      return false;
    }
  };

  // Change plan
  const updateUserPlan = async (userId: string, newPlan: 'free' | 'pro') => {
    try {
      // @ts-expect-error - RPC not typed in current Supabase types
      const { data, error } = await supabase.rpc('admin_change_plan', {
        p_user_id: userId,
        p_new_plan: newPlan,
      });

      if (error) {
        // Fallback
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ plan: newPlan, updated_at: new Date().toISOString() } as any)
          .eq('id', userId);
        if (updateError) throw updateError;
      }

      toast({
        title: 'Plano atualizado',
        description: `Plano alterado para ${newPlan.toUpperCase()}`,
      });
      await fetchUsers();
      return true;
    } catch (error: any) {
      console.error('Error updating plan:', error);
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
        toast({ title: 'Admin removido' });
      } else {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' } as any);
        if (error) throw error;
        toast({ title: 'Admin concedido' });
      }

      await fetchUsers();
      return true;
    } catch (error: any) {
      console.error('Error toggling admin:', error);
      toast({ variant: 'destructive', title: 'Erro', description: error.message });
      return false;
    }
  };

  // Get user details
  const getUserDetails = async (userId: string): Promise<UserDetails | null> => {
    try {
      // @ts-expect-error - RPC not typed in current Supabase types
      const { data, error } = await supabase.rpc('admin_get_user_details', {
        p_user_id: userId,
      });

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
      (filterStatus === 'active' && !u.is_blocked) ||
      (filterStatus === 'blocked' && u.is_blocked) ||
      (filterStatus === 'admin' && u.is_admin);

    return matchesSearch && matchesPlan && matchesStatus;
  });

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, fetchUsers]);

  useEffect(() => {
    if (isAdmin && users.length > 0) {
      fetchStats();
    }
  }, [isAdmin, users.length, fetchStats]);

  return {
    isAdmin,
    loading,
    users: filteredUsers,
    allUsers: users,
    stats,
    searchQuery,
    setSearchQuery,
    filterPlan,
    setFilterPlan,
    filterStatus,
    setFilterStatus,
    fetchUsers,
    fetchStats,
    updateUserPlan,
    toggleAdminRole,
    blockUser,
    unblockUser,
    adjustCredits,
    getUserDetails,
  };
};
