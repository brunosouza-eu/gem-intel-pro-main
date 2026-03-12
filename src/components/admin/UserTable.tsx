import React from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import {
  Crown, Shield, Ban, MoreVertical, Eye, Coins, UserX, UserCheck,
  Mail, Globe, ShieldOff, Bot, Trash2, HeadphonesIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { AdminUser, PlanType } from '@/hooks/useAdmin';

interface UserTableProps {
  users: AdminUser[];
  currentUserId?: string;
  onViewDetails: (user: AdminUser) => void;
  onAdjustCredits: (user: AdminUser) => void;
  onBlockUser: (user: AdminUser) => void;
  onUnblockUser: (user: AdminUser) => void;
  onUpdatePlan: (userId: string, plan: PlanType) => void;
  onToggleAdmin: (userId: string, isAdmin: boolean) => void;
  onToggleModerator: (userId: string, isModerator: boolean) => void;
  onToggleBot: (userId: string, isBot: boolean) => void;
  onDeleteUser: (user: AdminUser) => void;
}

const PLAN_CONFIG: Record<PlanType, { label: string; color: string; icon?: React.ElementType }> = {
  free: { label: 'FREE', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
  pro: { label: 'PRO', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: Shield },
  elite: { label: 'ELITE', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Crown },
};

const UserTable: React.FC<UserTableProps> = ({
  users, currentUserId, onViewDetails, onAdjustCredits,
  onBlockUser, onUnblockUser, onUpdatePlan, onToggleAdmin,
  onToggleModerator, onToggleBot, onDeleteUser,
}) => {
  const formatDate = (date: string | null) => {
    if (!date) return '—';
    try { return format(new Date(date), "dd/MM/yy", { locale: ptBR }); }
    catch { return '—'; }
  };

  const getInitials = (user: AdminUser) => {
    const name = user.full_name || user.email || '?';
    return name.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-[250px]">Usuário</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead>Créditos</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Último Login</TableHead>
            <TableHead>Cadastro</TableHead>
            <TableHead className="text-right w-[60px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            const planCfg = PLAN_CONFIG[user.plan] || PLAN_CONFIG.free;
            const PlanIcon = planCfg.icon;

            return (
              <TableRow
                key={user.id}
                className={`
                  hover:bg-muted/20 transition-colors cursor-pointer
                  ${user.is_blocked ? 'opacity-60' : ''}
                  ${isSelf ? 'bg-primary/5' : ''}
                  ${user.account_type === 'bot' ? 'opacity-50' : ''}
                `}
                onClick={() => onViewDetails(user)}
              >
                {/* User Info */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-9 h-9 border border-border/50">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                          {getInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      {user.account_type === 'bot' && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-slate-600 border-2 border-background flex items-center justify-center">
                          <Bot className="w-2.5 h-2.5 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate max-w-[180px]">
                        {user.full_name || 'Sem nome'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Plan */}
                <TableCell>
                  <Badge variant="secondary" className={`text-xs ${planCfg.color}`}>
                    {PlanIcon && <PlanIcon className="w-3 h-3 mr-1" />}
                    {planCfg.label}
                  </Badge>
                </TableCell>

                {/* Credits */}
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-mono text-sm font-medium">
                      {(user.credits || 0).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.is_admin && (
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px] px-1.5">
                        <Shield className="w-2.5 h-2.5 mr-0.5" />Admin
                      </Badge>
                    )}
                    {user.is_moderator && (
                      <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30 text-[10px] px-1.5">
                        <HeadphonesIcon className="w-2.5 h-2.5 mr-0.5" />Mod
                      </Badge>
                    )}
                    {user.account_type === 'bot' && (
                      <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30 text-[10px] px-1.5">
                        <Bot className="w-2.5 h-2.5 mr-0.5" />Bot
                      </Badge>
                    )}
                    {!user.is_admin && !user.is_moderator && user.account_type !== 'bot' && (
                      <span className="text-xs text-muted-foreground">User</span>
                    )}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  {user.is_blocked ? (
                    <Badge variant="destructive" className="text-xs">
                      <Ban className="w-3 h-3 mr-1" />Bloqueado
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30">
                      Ativo
                    </Badge>
                  )}
                </TableCell>

                {/* Provider */}
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {user.provider === 'google' ? (
                      <>
                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-xs">Google</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs">Email</span>
                      </>
                    )}
                  </div>
                </TableCell>

                {/* Last Login */}
                <TableCell>
                  <span className="text-xs text-muted-foreground">{formatDate(user.last_login_at)}</span>
                </TableCell>

                {/* Created */}
                <TableCell>
                  <span className="text-xs text-muted-foreground">{formatDate(user.created_at)}</span>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem onClick={() => onViewDetails(user)}>
                        <Eye className="w-4 h-4 mr-2" />Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAdjustCredits(user)}>
                        <Coins className="w-4 h-4 mr-2" />Ajustar Créditos
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/* Plan submenu */}
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Crown className="w-4 h-4 mr-2" />Alterar Plano
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {(['free', 'pro', 'elite'] as PlanType[]).map(plan => (
                            <DropdownMenuItem
                              key={plan}
                              disabled={user.plan === plan}
                              onClick={() => onUpdatePlan(user.id, plan)}
                              className={user.plan === plan ? 'opacity-50' : ''}
                            >
                              {plan === 'elite' && <Crown className="w-3.5 h-3.5 mr-2 text-amber-400" />}
                              {plan === 'pro' && <Shield className="w-3.5 h-3.5 mr-2 text-emerald-400" />}
                              {plan === 'free' && <span className="w-3.5 h-3.5 mr-2" />}
                              {plan.toUpperCase()}{user.plan === plan ? ' ✓' : ''}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>

                      {!isSelf && (
                        <>
                          <DropdownMenuSeparator />

                          <DropdownMenuItem onClick={() => onToggleAdmin(user.id, user.is_admin)}>
                            {user.is_admin
                              ? <><ShieldOff className="w-4 h-4 mr-2" />Remover Admin</>
                              : <><Shield className="w-4 h-4 mr-2" />Tornar Admin</>
                            }
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => onToggleModerator(user.id, user.is_moderator)}>
                            {user.is_moderator
                              ? <><HeadphonesIcon className="w-4 h-4 mr-2" />Remover Moderador</>
                              : <><HeadphonesIcon className="w-4 h-4 mr-2" />Tornar Moderador</>
                            }
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => onToggleBot(user.id, user.account_type === 'bot')}>
                            {user.account_type === 'bot'
                              ? <><Bot className="w-4 h-4 mr-2" />Desmarcar Bot</>
                              : <><Bot className="w-4 h-4 mr-2" />Marcar como Bot</>
                            }
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {user.is_blocked ? (
                            <DropdownMenuItem className="text-emerald-400" onClick={() => onUnblockUser(user)}>
                              <UserCheck className="w-4 h-4 mr-2" />Desbloquear
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-destructive" onClick={() => onBlockUser(user)}>
                              <UserX className="w-4 h-4 mr-2" />Bloquear
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => onDeleteUser(user)}>
                            <Trash2 className="w-4 h-4 mr-2" />Excluir Conta
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                Nenhum usuário encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
