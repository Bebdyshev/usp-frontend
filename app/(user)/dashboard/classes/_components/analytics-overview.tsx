'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';
import api from '@/lib/api';
import { ApiError } from '@/utils/errorHandler';
import { toast } from 'react-toastify';

interface Grade {
  id: number;
  grade: string;
  parallel: string;
  curatorName: string;
  shanyrak: string;
  studentCount?: number;
  actualStudentCount?: number;
}

interface AnalyticsOverviewProps {
  grades: Grade[];
}

interface DangerLevelStats {
  level: number;
  count: number;
  students: any[];
}

export default function AnalyticsOverview({ grades }: AnalyticsOverviewProps) {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [parallels, setParallels] = useState<string[]>([]);
  const [dangerStats, setDangerStats] = useState<DangerLevelStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch subjects and parallels
      const [subjects, parallels] = await Promise.all([
        api.getSubjects(),
        api.getParallels()
      ]);

      setSubjects(subjects);
      setParallels(parallels);

      // Fetch danger level statistics using the analytics method
      const dangerResults = await api.getAnalytics();
      setDangerStats(dangerResults);

    } catch (err) {
      const apiError = err as ApiError;
      toast.error(`Ошибка загрузки аналитики: ${apiError.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalStudents = grades.reduce((sum, grade) => sum + (grade.actualStudentCount || 0), 0);
  const totalClasses = grades.length;
  const averageStudentsPerClass = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;
  
  // Danger level statistics
  const totalDangerStudents = dangerStats.reduce((sum, stat) => sum + stat.count, 0);
  const dangerPercentage = totalStudents > 0 ? Math.round((totalDangerStudents / totalStudents) * 100) : 0;

  // Extract parallel numbers from grades (e.g., "9А" -> "9", "10Б" -> "10")
  const extractParallel = (grade: string) => {
    const match = grade.match(/^\d+/);
    return match ? match[0] : null;
  };

  // Get all unique parallels from both API data and local grades data
  const apiParallels = parallels.map(extractParallel).filter(Boolean);
  const localParallels = grades.map(grade => extractParallel(grade.grade)).filter(Boolean);
  const allParallels = new Set([...apiParallels, ...localParallels]);
  
  // Group grades by parallel
  const parallelStats = Array.from(allParallels)
    .sort((a, b) => parseInt(a!) - parseInt(b!)) // Sort numerically
    .map(parallel => {
      // Find all grades that belong to this parallel
      const parallelGrades = grades.filter(grade => {
        const gradeParallel = extractParallel(grade.grade);
        return gradeParallel === parallel;
      });
      
      const students = parallelGrades.reduce((sum, grade) => sum + (grade.actualStudentCount || 0), 0);
      return {
        parallel: parallel!,
        classes: parallelGrades.length,
        students
      };
    })
    .filter(stat => stat.classes > 0); // Only show parallels that have classes

  const getDangerLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 2: return 'bg-orange-100 text-orange-800 border-orange-300';
      case 3: return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDangerLevelText = (level: number) => {
    switch (level) {
      case 1: return 'Низкий риск';
      case 2: return 'Средний риск';
      case 3: return 'Высокий риск';
      default: return 'Неизвестно';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            Загрузка аналитики...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего студентов</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              в {totalClasses} классах
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Средний размер класса</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageStudentsPerClass}</div>
            <p className="text-xs text-muted-foreground">
              студентов на класс
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Студенты в зоне риска</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDangerStudents}</div>
            <p className="text-xs text-muted-foreground">
              {dangerPercentage}% от общего числа
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активных предметов</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">
              предметов ведется
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Danger Level Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp size={20} />
            Анализ уровней риска
          </CardTitle>
          <CardDescription>
            Распределение студентов по уровням академического риска
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dangerStats.map((stat) => (
              <div key={stat.level} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={getDangerLevelColor(stat.level)}>
                    Уровень {stat.level}
                  </Badge>
                  <div>
                    <p className="font-medium">{getDangerLevelText(stat.level)}</p>
                    <p className="text-sm text-gray-600">
                      {stat.count} студентов
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{stat.count}</div>
                  <div className="text-sm text-gray-500">
                    {totalStudents > 0 ? Math.round((stat.count / totalStudents) * 100) : 0}%
                  </div>
                </div>
              </div>
            ))}
            
            {totalDangerStudents === 0 && (
              <div className="flex items-center justify-center p-8 text-green-600">
                <CheckCircle className="h-6 w-6 mr-2" />
                <span className="font-medium">Все студенты показывают хорошие результаты!</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Parallels Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={20} />
            Статистика по параллелям
          </CardTitle>
          <CardDescription>
            Распределение классов и студентов по параллелям
          </CardDescription>
        </CardHeader>
        <CardContent>
          {parallelStats.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Нет данных о параллелях
            </div>
          ) : (
            <div className="space-y-4">
              {parallelStats.map((stat) => {
                const averagePerClass = stat.classes > 0 ? Math.round(stat.students / stat.classes) : 0;
                const percentage = totalStudents > 0 ? Math.round((stat.students / totalStudents) * 100) : 0;
                
                return (
                  <div key={stat.parallel} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-lg">{stat.parallel} класс</p>
                        <Badge variant="outline">{percentage}% от общего числа</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {stat.classes} {stat.classes === 1 ? 'класс' : stat.classes < 5 ? 'класса' : 'классов'} • 
                        Среднее: {averagePerClass} студентов в классе
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{stat.students}</div>
                      <div className="text-sm text-gray-500">студентов</div>
                    </div>
                  </div>
                );
              })}
              
              {/* Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Итого</p>
                    <p className="text-sm text-gray-600">
                      {parallelStats.length} {parallelStats.length === 1 ? 'параллель' : parallelStats.length < 5 ? 'параллели' : 'параллелей'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{totalClasses}</div>
                    <div className="text-sm text-gray-500">классов всего</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subjects List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} />
            Активные предметы
          </CardTitle>
          <CardDescription>
            Список предметов, по которым ведется учет оценок
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Пока нет данных о предметах
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {subject}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 