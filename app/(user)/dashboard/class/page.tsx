'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import api from '@/lib/api';

interface Student {
  id: number;
  name: string;
  danger_level: number;
  attendance: number;
  grades: Record<string, number>;
}

interface ClassData {
  class_name: string;
  avg_danger_level: number;
  students: Student[];
}

export default function ClassPage() {
  const searchParams = useSearchParams();
  const classParam = searchParams.get('class');
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassData = async () => {
      if (!classParam) {
        setError('Класс не указан');
        setLoading(false);
        return;
      }
      console.log(`/classes/class/${classParam}`);
      try {
        setLoading(true);
        // Parse classParam to get parallel and class name
        const [parallel, className] = classParam.split(' ');
        const response = await api.getClassData(parallel, className);
        setClassData(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching class data:', err);
        setError('Ошибка при загрузке данных класса');
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classParam]);

  const getDangerLevelColor = (level: number) => {
    if (level >= 2.5) return 'text-red-500';
    if (level >= 1.5) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getDangerLevelBgColor = (level: number) => {
    if (level >= 2.5) return 'bg-red-100';
    if (level >= 1.5) return 'bg-yellow-100';
    return 'bg-orange-100';
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-full">
          <p className="text-lg">Загрузка данных класса...</p>
        </div>
      </PageContainer>
    );
  }

  if (error || !classData) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-lg text-red-500">{error || 'Данные класса не найдены'}</p>
          <p className="mt-2">Проверьте правильность URL или выберите класс из списка</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable>
      <div className="py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            Класс {classData.class_name}
          </h1>
          <div className={`px-4 py-2 rounded-lg ${getDangerLevelBgColor(classData.avg_danger_level)}`}>
            <span className="font-semibold">Средний уровень опасности: </span>
            <span className={`font-bold ${getDangerLevelColor(classData.avg_danger_level)}`}>
              {classData.avg_danger_level.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Секция со списком учеников */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Список учеников</CardTitle>
            <CardDescription>Информация об учениках класса {classData.class_name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 border text-left">№</th>
                    <th className="px-4 py-2 border text-left">Имя</th>
                    <th className="px-4 py-2 border text-center">Уровень опасности</th>
                    <th className="px-4 py-2 border text-center">Посещаемость</th>
                    <th className="px-4 py-2 border text-center">Средний балл</th>
                  </tr>
                </thead>
                <tbody>
                  {classData.students.map((student, index) => {
                    const avgGrade = Object.values(student.grades).reduce((sum, grade) => sum + grade, 0) / 
                                    (Object.values(student.grades).length || 1);
                    
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{index + 1}</td>
                        <td className="px-4 py-2 border">{student.name}</td>
                        <td className="px-4 py-2 border text-center">
                          <span className={getDangerLevelColor(student.danger_level)}>
                            {student.danger_level.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-2 border text-center">
                          {student.attendance}%
                        </td>
                        <td className="px-4 py-2 border text-center">
                          {avgGrade.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Секция со статистикой */}
        <h2 className="text-xl font-semibold mb-4">Статистика класса</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Распределение по уровню опасности</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Здесь будет график распределения</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Посещаемость</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Здесь будет график посещаемости</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Успеваемость по предметам</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Здесь будет график успеваемости</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Динамика изменений</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Здесь будет график динамики</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
} 