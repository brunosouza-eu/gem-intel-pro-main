import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Crown, User, Shield } from 'lucide-react';

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    proUsers: number;
    freeUsers: number;
    adminUsers: number;
  };
}

const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Usuários',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Usuários PRO',
      value: stats.proUsers,
      icon: Crown,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Usuários FREE',
      value: stats.freeUsers,
      icon: User,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
    },
    {
      title: 'Administradores',
      value: stats.adminUsers,
      icon: Shield,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.title} className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
