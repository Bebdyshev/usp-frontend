'use client';

import { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Settings,
  TrendingUp,
  AlertTriangle,
  School,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { useSystemSettings } from '@/hooks/use-system-settings';
import SystemSettingsDialog from '@/components/SystemSettingsDialog';
import api from '@/lib/api';

export default function DashboardPage() {
  const { settings, loading: settingsLoading } = useSystemSettings();
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalSubjects: 0,
    dangerousStudents: 0
  });
  const [loading, setLoading] = useState(true);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load basic stats
        const [gradesResponse, subjectsResponse] = await Promise.all([
          api.getAllGrades(),
          api.getSubjects().catch(() => [])
        ]);

        const totalStudents = gradesResponse.reduce((sum: number, grade: any) => 
          sum + (grade.actualStudentCount || 0), 0
        );

        setStats({
          totalClasses: gradesResponse.length,
          totalStudents,
          totalSubjects: subjectsResponse.length,
          dangerousStudents: 0 // You can implement this later
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'Управление классами',
      description: 'Создание и редактирование классов',
      icon: GraduationCap,
      href: '/dashboard/classes',
      color: 'bg-blue-500'
    },
    {
      title: 'Управление студентами',
      description: 'Просмотр и редактирование студентов',
      icon: Users,
      href: '/dashboard/students',
      color: 'bg-green-500'
    },
    {
      title: 'Пользователи системы',
      description: 'Управление пользователями',
      icon: Users,
      href: '/dashboard/users',
      color: 'bg-purple-500'
    },
    {
      title: 'Настройки системы',
      description: 'Конфигурация школьной системы',
      icon: Settings,
      href: '/settings',
      color: 'bg-orange-500'
    }
  ];

  const statsCards = [
    {
      title: 'Всего классов',
      value: stats.totalClasses,
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Всего студентов',
      value: stats.totalStudents,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Предметов в системе',
      value: stats.totalSubjects,
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Требуют внимания',
      value: stats.dangerousStudents,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <PageContainer scrollable>
      <div className="py-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <School className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Панель управления
              </h1>
              <p className="text-muted-foreground">
                Добро пожаловать в систему управления школой
              </p>
            </div>
          </div>
        </div>

        {/* System Info */}
        {settings && !settingsLoading && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <School className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{settings.school_name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {settings.academic_year}
                    </div>
                    <div>
                      Классы: {settings.min_grade}-{settings.max_grade}
                    </div>
                    <div>
                      Буквы: {settings.class_letters.join(', ')}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSettingsDialogOpen(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Настроить
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
        <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">
                      {loading ? '...' : stat.value}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Быстрые действия</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg text-white ${action.color}`}>
                        <action.icon className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity or System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Состояние системы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Система настроена</span>
                <Badge variant={settings ? "default" : "secondary"}>
                  {settings ? "Да" : "Требует настройки"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Классы созданы</span>
                <Badge variant={stats.totalClasses > 0 ? "default" : "secondary"}>
                  {stats.totalClasses > 0 ? `${stats.totalClasses} классов` : "Нет классов"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Студенты добавлены</span>
                <Badge variant={stats.totalStudents > 0 ? "default" : "secondary"}>
                  {stats.totalStudents > 0 ? `${stats.totalStudents} студентов` : "Нет студентов"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Settings Dialog */}
      <SystemSettingsDialog 
        open={settingsDialogOpen} 
        onOpenChange={setSettingsDialogOpen} 
      />
    </PageContainer>
    );
}
