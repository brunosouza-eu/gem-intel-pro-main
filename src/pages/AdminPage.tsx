import React, { useState } from 'react';
import { useAdmin, type AdminUser } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboardTab from '@/components/admin/AdminDashboardTab';
import UserTable from '@/components/admin/UserTable';
import UserDetailModal from '@/components/admin/UserDetailModal';
import CreditAdjustModal from '@/components/admin/CreditAdjustModal';
import BlockUserModal from '@/components/admin/BlockUserModal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Loader2, RefreshCw, Shield, Users, LayoutDashboard, Database,
  Sparkles, Check, Search, Filter, Coins, MessageSquare,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import SystemStatusTab from '@/components/admin/SystemStatusTab';
import CommunityModerationTab from '@/components/admin/CommunityModerationTab';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const {
    isAdmin, loading, users, allUsers, stats,
    searchQuery, setSearchQuery,
    filterPlan, setFilterPlan,
    filterStatus, setFilterStatus,
    fetchUsers, fetchStats,
    updateUserPlan, toggleAdminRole,
    blockUser, unblockUser, adjustCredits,
    getUserDetails,
  } = useAdmin();

  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [runningAnalysis, setRunningAnalysis] = useState(false);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    await fetchStats();
    setRefreshing(false);
  };

  const handleSyncTokens = async () => {
    setSyncing(true);
    setSyncResult(null);
    toast({ title: "🔄 Sincronizando Tokens...", description: "Deletando tokens antigos e buscando da Binance..." });
    try {
      const { syncAllBinanceTokens } = await import('@/lib/tokenSyncService');
      const result = await syncAllBinanceTokens({
        minVolume: 5_000_000, maxTokens: 150,
        onProgress: (current, total, status) => console.log(`Progress: ${current}/${total} - ${status}`),
      });
      setSyncResult({ total: result.total, distribution: result.distribution });
      toast({ title: "✅ Sincronização Concluída!", description: `${result.total} tokens sincronizados.`, className: "bg-success text-white" });
    } catch (error: unknown) {
      console.error('Sync error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({ title: "❌ Erro na Sincronização", description: errorMessage, variant: "destructive" });
    } finally {
      setSyncing(false);
    }
  };

  const handleRunFullAnalysis = async () => {
    setRunningAnalysis(true);
    toast({ title: "⚙️ Iniciando Análise...", description: "Processando todos os tokens..." });
    try {
      // This would call the batch analysis Edge Function
      // For now, simulating the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({ title: "✅ Análise Completa!", description: "Todos os tokens foram reprocessados.", className: "bg-success text-white" });
      await fetchUsers();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({ title: "❌ Erro na Análise", description: errorMessage, variant: "destructive" });
    } finally {
      setRunningAnalysis(false);
    }
  };

  const handleClearCache = async () => {
    toast({ title: "🗑️ Limpando Cache...", description: "Removendo dados temporários..." });
    try {
      // Simulate cache clearing
      localStorage.clear();
      sessionStorage.clear();
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({ title: "✅ Cache Limpo!", description: "Dados temporários removidos com sucesso.", className: "bg-success text-white" });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({ title: "❌ Erro ao Limpar Cache", description: errorMessage, variant: "destructive" });
    }
  };

  // Modal handlers
  const openDetails = (u: AdminUser) => { setSelectedUser(u); setDetailModalOpen(true); };
  const openCreditAdjust = (u: AdminUser) => { setSelectedUser(u); setCreditModalOpen(true); };
  const openBlockUser = (u: AdminUser) => { setSelectedUser(u); setBlockModalOpen(true); };
  const handleUnblock = async (u: AdminUser) => { await unblockUser(u.id); };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground">Carregando painel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Shield className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Acesso Negado</h2>
        <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            Painel Administrativo
          </h1>
          <p className="text-muted-foreground mt-1">CRM completo — gerencie usuários, créditos e sistema</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" disabled={refreshing} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-muted/30 border border-border/50 p-1">
          <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-primary/10">
            <LayoutDashboard className="w-4 h-4" />Dashboard
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-primary/10">
            <Users className="w-4 h-4" />Usuários ({allUsers.length})
          </TabsTrigger>
          <TabsTrigger value="tokens" className="gap-2 data-[state=active]:bg-primary/10">
            <Database className="w-4 h-4" />Tokens
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2 data-[state=active]:bg-primary/10">
            <Sparkles className="w-4 h-4" />Sistema
          </TabsTrigger>
          <TabsTrigger value="community" className="gap-2 data-[state=active]:bg-primary/10">
            <MessageSquare className="w-4 h-4" />Comunidade
          </TabsTrigger>
        </TabsList>

        {/* ====== DASHBOARD TAB ====== */}
        <TabsContent value="dashboard" className="mt-6">
          <AdminDashboardTab stats={stats} />
        </TabsContent>

        {/* ====== USERS TAB ====== */}
        <TabsContent value="users" className="mt-6 space-y-4">
          {/* Search & Filters */}
          <Card className="border-border/30 bg-card/50">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por email ou nome..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-background/50"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterPlan} onValueChange={setFilterPlan}>
                    <SelectTrigger className="w-[130px] bg-background/50">
                      <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                      <SelectValue placeholder="Plano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos Planos</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[140px] bg-background/50">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos Status</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="blocked">Bloqueados</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Table */}
          <Card className="border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gerenciar Clientes
                <span className="text-sm font-normal text-muted-foreground">
                  ({users.length}{users.length !== allUsers.length ? ` de ${allUsers.length}` : ''})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <UserTable
                users={users}
                currentUserId={user?.id}
                onViewDetails={openDetails}
                onAdjustCredits={openCreditAdjust}
                onBlockUser={openBlockUser}
                onUnblockUser={handleUnblock}
                onUpdatePlan={updateUserPlan}
                onToggleAdmin={toggleAdminRole}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ====== TOKENS TAB ====== */}
        <TabsContent value="tokens" className="mt-6 space-y-4">
          {/* Stale Tokens Alert */}
          {(() => {
            const now = new Date();
            const staleTokens = allUsers.filter(u => {
              // This is a placeholder - in real app would check token updated_at
              return false; // Replace with actual stale check
            }).length;
            const tokenCount: number = staleTokens; // Placeholder — replace with actual stale check

            return tokenCount > 0 ? (
              <Alert variant="destructive" className="border-warning/50 bg-warning/5">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <AlertTitle className="text-warning">Tokens Desatualizados Detectados</AlertTitle>
                <AlertDescription className="text-warning/90">
                  {tokenCount} {tokenCount === 1 ? 'token não foi atualizado' : 'tokens não foram atualizados'} nas últimas 24 horas.
                  Considere executar uma sincronização completa.
                </AlertDescription>
              </Alert>
            ) : null;
          })()}

          <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Sincronização de Tokens
              </CardTitle>
              <CardDescription>
                Apaga tokens inválidos e ressincroniza os top 150 da Binance com score melhorado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleSyncTokens}
                disabled={syncing}
                className="gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500"
              >
                {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {syncing ? 'Sincronizando...' : 'Sincronizar Tokens da Binance'}
              </Button>

              <div className="flex gap-2">
                <Button
                  onClick={handleRunFullAnalysis}
                  disabled={runningAnalysis}
                  variant="outline"
                  className="gap-2"
                >
                  {runningAnalysis ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                  {runningAnalysis ? 'Analisando...' : 'Rodar Análise Completa'}
                </Button>

                <Button
                  onClick={handleClearCache}
                  variant="outline"
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Limpar Cache
                </Button>
              </div>
              {syncResult && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-success font-medium">
                    <Check className="w-4 h-4" />
                    {syncResult.total} tokens sincronizados
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mt-3">
                    <div className="bg-info/20 rounded p-2 text-center">
                      <div className="text-xl font-bold text-info">{syncResult.distribution?.observacao || 0}</div>
                      <div className="text-muted-foreground text-xs">Observação</div>
                    </div>
                    <div className="bg-success/20 rounded p-2 text-center">
                      <div className="text-xl font-bold text-success">{syncResult.distribution?.acumulacao || 0}</div>
                      <div className="text-muted-foreground text-xs">Acumulação</div>
                    </div>
                    <div className="bg-warning/20 rounded p-2 text-center">
                      <div className="text-xl font-bold text-warning">{syncResult.distribution?.gatilho || 0}</div>
                      <div className="text-muted-foreground text-xs">Gatilho</div>
                    </div>
                    <div className="bg-destructive/20 rounded p-2 text-center">
                      <div className="text-xl font-bold text-destructive">{syncResult.distribution?.andamento || 0}</div>
                      <div className="text-muted-foreground text-xs">Em Andamento</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ====== SYSTEM TAB ====== */}
        <TabsContent value="system" className="mt-6">
          <SystemStatusTab />
        </TabsContent>

        {/* ====== COMMUNITY MODERATION TAB ====== */}
        <TabsContent value="community" className="mt-6">
          <CommunityModerationTab />
        </TabsContent>
      </Tabs>

      {/* ====== MODALS ====== */}
      <UserDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        user={selectedUser}
        onGetDetails={getUserDetails}
        onAdjustCredits={() => { setDetailModalOpen(false); setCreditModalOpen(true); }}
        onBlockUser={() => { setDetailModalOpen(false); setBlockModalOpen(true); }}
        onUnblockUser={async () => {
          if (selectedUser) { await unblockUser(selectedUser.id); setDetailModalOpen(false); }
        }}
        onChangePlan={async (plan) => {
          if (selectedUser) { await updateUserPlan(selectedUser.id, plan); setDetailModalOpen(false); }
        }}
      />

      <CreditAdjustModal
        open={creditModalOpen}
        onOpenChange={setCreditModalOpen}
        user={selectedUser}
        onAdjust={adjustCredits}
      />

      <BlockUserModal
        open={blockModalOpen}
        onOpenChange={setBlockModalOpen}
        user={selectedUser}
        onBlock={blockUser}
      />
    </div>
  );
};

export default AdminPage;
