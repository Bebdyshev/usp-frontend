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
import { Pencil, Trash2, Plus } from 'lucide-react';
import axiosInstance from '@/app/axios/instance';
import { handleApiError } from '@/utils/errorHandler';

interface Grade {
  id: number;
  grade: string;
  parallel: string;
  curatorName: string;
  shanyrak: string;
  studentCount?: number;
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentGrade, setCurrentGrade] = useState<Grade | null>(null);
  const [formData, setFormData] = useState<CreateGradePayload>({
    grade: '',
    parallel: '',
    curatorName: 'Неизвестный куратор',
    shanyrak: '',
    studentCount: 0,
  });

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/grades/all/');
      setGrades(response.data);
      setError(null);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      toast.error(`Ошибка загрузки классов: ${apiError.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'studentCount') {
      const numValue = value === '' ? 0 : Math.max(0, parseInt(value));
      setFormData(prev => ({ ...prev, [name]: numValue }));
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
      studentCount: 0,
    });
    setCurrentGrade(null);
  };

  const handleCreateGrade = async () => {
    try {
      await axiosInstance.post('/grades/', formData);
      toast.success('Класс успешно создан');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchGrades();
    } catch (err) {
      const apiError = handleApiError(err);
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
      studentCount: grade.studentCount || 0,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateGrade = async () => {
    if (!currentGrade) return;
    
    try {
      await axiosInstance.put(`/grades/${currentGrade.id}`, formData);
      toast.success('Класс успешно обновлен');
      setIsEditDialogOpen(false);
      resetForm();
      fetchGrades();
    } catch (err) {
      const apiError = handleApiError(err);
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
      await axiosInstance.delete(`/grades/${currentGrade.id}`);
      toast.success('Класс успешно удален');
      setIsDeleteDialogOpen(false);
      resetForm();
      fetchGrades();
    } catch (err) {
      const apiError = handleApiError(err);
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
          <h1 className="text-2xl font-bold">Управление классами</h1>
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
                      <th className="p-3 border-b border-gray-200 font-semibold">Студенты</th>
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
                        <td className="p-3 border-b border-gray-200">{grade.studentCount || 0}</td>
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
                  <Input
                    id="grade"
                    name="grade"
                    placeholder="например, 9А"
                    value={formData.grade}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="parallel">Параллель</Label>
                  <Input
                    id="parallel"
                    name="parallel"
                    placeholder="например, 9"
                    value={formData.parallel}
                    onChange={handleInputChange}
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
                <Label htmlFor="studentCount">Количество студентов</Label>
                <Input
                  id="studentCount"
                  name="studentCount"   
                  type="number"
                  min="0"
                  placeholder="например, 25"
                  value={formData.studentCount}
                  onChange={handleInputChange}
                  className="w-full"
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
                <Label htmlFor="edit-studentCount">Количество студентов</Label>
                <Input
                  id="edit-studentCount"
                  name="studentCount"
                  type="number"
                  min="0"
                  value={formData.studentCount}
                  onChange={handleInputChange}
                  className="w-full"
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