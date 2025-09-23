'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Pencil, Trash2, Plus, Users, BarChart3, GraduationCap } from 'lucide-react';
import api, { Grade as ApiGrade } from '@/lib/api';
import { ApiError } from '@/utils/errorHandler';
import StudentManagement from './_components/student-management';
import AnalyticsOverview from './_components/analytics-overview';
import { useAvailableClasses } from '@/hooks/use-system-settings';

interface Grade {
  id: number;
  grade: string;
  parallel: string;
  curatorName: string;
  shanyrak: string;
  studentCount?: number;
  actualStudentCount?: number;
}

interface CreateGradePayload {
  grade: string;
  parallel: string;
  curatorName: string;
  shanyrak: string;
  studentCount?: number;
}

export default function ClassManagementPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { classes: availableClasses, grades: availableGrades, loading: classesLoading } = useAvailableClasses();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentGrade, setCurrentGrade] = useState<Grade | null>(null);
  const [formData, setFormData] = useState<CreateGradePayload>({
    grade: '',
    parallel: '',
    curatorName: 'Неизвестный куратор',
    shanyrak: '',
    studentCount: 0
  });

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const grades = await api.getAllGrades();
      setGrades(grades);
      setError(null);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      toast.error(`Ошибка загрузки классов: ${apiError.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value === '' ? 0 : parseInt(value, 10) 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      grade: '',
      parallel: '',
      curatorName: 'Неизвестный куратор',
      shanyrak: '',
      studentCount: 0
    });
    setCurrentGrade(null);
  };

  const handleCreateGrade = async () => {
    try {
      await api.createGrade(formData as any);
      toast.success('Класс успешно создан');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchGrades();
    } catch (err) {
      const apiError = err as ApiError;
      toast.error(`Ошибка создания класса: ${apiError.message}`);
    }
  };

  const handleEditClick = (grade: Grade) => {
    setCurrentGrade(grade);
    setFormData({
      grade: grade.grade || '',
      parallel: grade.parallel || '',
      curatorName: grade.curatorName || 'Неизвестный куратор',
      shanyrak: grade.shanyrak || '',
      studentCount: grade.studentCount || 0
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateGrade = async () => {
    if (!currentGrade) return;
    
    try {
      await api.updateGrade(currentGrade.id, formData as any);
      toast.success('Класс успешно обновлен');
      setIsEditDialogOpen(false);
      resetForm();
      fetchGrades();
    } catch (err) {
      const apiError = err as ApiError;
      toast.error(`Ошибка обновления класса: ${apiError.message}`);
    }
  };

  const handleDeleteClick = (grade: Grade) => {
    setCurrentGrade(grade);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteGrade = async () => {
    if (!currentGrade) return;
    
    try {
      await api.deleteGrade(currentGrade.id);
      toast.success('Класс успешно удален');
      setIsDeleteDialogOpen(false);
      resetForm();
      fetchGrades();
    } catch (err) {
      const apiError = err as ApiError;
      toast.error(`Ошибка удаления класса: ${apiError.message}`);
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  return (
    <PageContainer scrollable>
      <div className="py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Управление школой</h1>
        </div>

        <Tabs defaultValue="classes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="classes" className="flex items-center gap-2">
              <GraduationCap size={16} />
              Классы
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users size={16} />
              Студенты
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 size={16} />
              Аналитика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Управление классами</h2>
              <Button onClick={openCreateDialog} className="flex items-center gap-2">
                <Plus size={16} /> Добавить класс
              </Button>
            </div>

            {error && (
              <Card className="mb-6 border-red-300 bg-red-50">
                <CardContent className="p-4 text-red-600">
                  {error}
                </CardContent>
              </Card>
            )}

            {loading ? (
              <Card>
                <CardContent className="p-6 text-center">
                  Загрузка классов...
                </CardContent>
              </Card>
            ) : grades.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  Классы не найдены. Нажмите "Добавить класс", чтобы создать новый.
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Классы</CardTitle>
                  <CardDescription>Управление школьными классами</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100 text-left">
                          <th className="p-3 border-b border-gray-200 font-semibold">Класс</th>
                          <th className="p-3 border-b border-gray-200 font-semibold">Параллель</th>
                          <th className="p-3 border-b border-gray-200 font-semibold">Куратор</th>
                          <th className="p-3 border-b border-gray-200 font-semibold">Шанырак</th>
                          <th className="p-3 border-b border-gray-200 font-semibold">Кол-во учеников</th>
                          <th className="p-3 border-b border-gray-200 font-semibold text-right">Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grades.map(grade => (
                          <tr key={grade.id} className="hover:bg-gray-50">
                            <td className="p-3 border-b border-gray-200 font-medium">{grade.grade}</td>
                            <td className="p-3 border-b border-gray-200">{grade.parallel}</td>
                            <td className="p-3 border-b border-gray-200">{grade.curatorName}</td>
                            <td className="p-3 border-b border-gray-200">{grade.shanyrak}</td>
                            <td className="p-3 border-b border-gray-200">
                              {grade.actualStudentCount || 0}
                              {grade.studentCount !== (grade.actualStudentCount || 0) && (
                                <span className="text-xs text-gray-500 ml-1">
                                  (записано: {grade.studentCount || 0})
                                </span>
                              )}
                            </td>
                            <td className="p-3 border-b border-gray-200 text-right space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => handleEditClick(grade)}
                                className="h-8 w-8 inline-flex items-center justify-center"
                                title="Редактировать"
                              >
                                <Pencil size={16} />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => handleDeleteClick(grade)}
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 inline-flex items-center justify-center"
                                title="Удалить"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="students">
            <StudentManagement grades={grades} onRefreshGrades={fetchGrades} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsOverview grades={grades} />
          </TabsContent>
        </Tabs>

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить новый класс</DialogTitle>
              <DialogDescription>
                Введите информацию о новом классе
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="grade">Класс</Label>
                  <select
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={(e) => {
                      const selectedClass = e.target.value;
                      const parallel = selectedClass.match(/^\d+/)?.[0] || '';
                      setFormData(prev => ({ 
                        ...prev, 
                        grade: selectedClass,
                        parallel: parallel
                      }));
                    }}
                    className="w-full p-2 border rounded"
                    disabled={classesLoading}
                  >
                    <option value="">Выберите класс</option>
                    {availableClasses.map((className) => (
                      <option key={className} value={className}>
                        {className}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="parallel">Параллель</Label>
                  <Input
                    id="parallel"
                    name="parallel"
                    value={formData.parallel}
                    readOnly
                    className="bg-gray-100"
                    placeholder="Автоматически"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="curatorName">Имя куратора</Label>
                <Input
                  id="curatorName"
                  name="curatorName"
                  placeholder="например, Иванов И.И."
                  value={formData.curatorName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="shanyrak">Шанырак</Label>
                <Input
                  id="shanyrak"
                  name="shanyrak"
                  placeholder="например, Синий"
                  value={formData.shanyrak}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="studentCount">Количество учеников</Label>
                <Input
                  id="studentCount"
                  name="studentCount"
                  type="number"
                  placeholder="0"
                  value={formData.studentCount?.toString() || "0"}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button onClick={handleCreateGrade}>Создать</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать класс</DialogTitle>
              <DialogDescription>
                Обновите информацию о классе
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-grade">Класс</Label>
                  <Input
                    id="edit-grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-parallel">Параллель</Label>
                  <Input
                    id="edit-parallel"
                    name="parallel"
                    value={formData.parallel}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-curatorName">Имя куратора</Label>
                <Input
                  id="edit-curatorName"
                  name="curatorName"
                  value={formData.curatorName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-shanyrak">Шанырак</Label>
                <Input
                  id="edit-shanyrak"
                  name="shanyrak"
                  value={formData.shanyrak}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-studentCount">Количество учеников</Label>
                <Input
                  id="edit-studentCount"
                  name="studentCount"
                  type="number"
                  value={formData.studentCount?.toString() || "0"}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button onClick={handleUpdateGrade}>Обновить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Удалить класс</DialogTitle>
              <DialogDescription>
                Вы уверены, что хотите удалить этот класс? Это действие нельзя отменить.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteGrade}
              >
                Удалить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
} 