'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Plus, Users, Upload, Download } from 'lucide-react';
import axiosInstance from '@/app/axios/instance';
import { handleApiError } from '@/utils/errorHandler';
import api from '@/lib/api';

interface Student {
  id: number;
  name: string;
  email?: string;
  grade_id: number;
}

interface Grade {
  id: number;
  grade: string;
  parallel: string;
  curatorName: string;
  shanyrak: string;
  studentCount?: number;
  actualStudentCount?: number;
}

interface StudentManagementProps {
  grades: Grade[];
  onRefreshGrades: () => void;
}

export default function StudentManagement({ grades, onRefreshGrades }: StudentManagementProps) {
  const [selectedGradeId, setSelectedGradeId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: ''
  });

  const selectedGrade = grades.find(g => g.id === selectedGradeId);

  useEffect(() => {
    if (selectedGradeId) {
      fetchStudents(selectedGradeId);
    }
  }, [selectedGradeId]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setSubjectsLoading(true);
    try {
      const subjectsList = await api.getSubjects();
      setSubjects(subjectsList);
    } catch (err) {
      const apiError = handleApiError(err);
      toast.error(`Ошибка загрузки предметов: ${apiError.message}`);
    } finally {
      setSubjectsLoading(false);
    }
  };

  const fetchStudents = async (gradeId: number) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/grades/students/${gradeId}`);
      setStudents(response.data);
    } catch (err) {
      const apiError = handleApiError(err);
      toast.error(`Ошибка загрузки студентов: ${apiError.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', subject: '' });
    setCurrentStudent(null);
  };

  const handleCreateStudent = async () => {
    if (!selectedGradeId) return;

    // Проверяем обязательные поля
    if (!formData.name.trim()) {
      toast.error('Введите имя студента');
      return;
    }

    try {
      await axiosInstance.post('/grades/students/', {
        ...formData,  // name и email
        grade_id: selectedGradeId
      });
      toast.success('Студент успешно добавлен');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchStudents(selectedGradeId);
      onRefreshGrades(); // Refresh grades to update student count
    } catch (err) {
      const apiError = handleApiError(err);
      toast.error(`Ошибка создания студента: ${apiError.message}`);
    }
  };

  const handleDeleteClick = (student: Student) => {
    setCurrentStudent(student);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteStudent = async () => {
    if (!currentStudent) return;

    try {
      await axiosInstance.delete(`/grades/students/${currentStudent.id}`);
      toast.success('Студент успешно удален');
      setIsDeleteDialogOpen(false);
      resetForm();
      fetchStudents(selectedGradeId!);
      onRefreshGrades(); // Refresh grades to update student count
    } catch (err) {
      const apiError = handleApiError(err);
      toast.error(`Ошибка удаления студента: ${apiError.message}`);
    }
  };

  const handleUpdateStudentCount = async () => {
    if (!selectedGradeId || !selectedGrade) return;

    try {
      await axiosInstance.put(`/grades/${selectedGradeId}/student-count`, {
        student_count: students.length
      });
      toast.success('Количество студентов обновлено');
      onRefreshGrades();
    } catch (err) {
      const apiError = handleApiError(err);
      toast.error(`Ошибка обновления: ${apiError.message}`);
    }
  };

  const openCreateDialog = () => {
    if (!selectedGradeId) {
      toast.error('Сначала выберите класс');
      return;
    }
    resetForm();
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Grade Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Управление студентами
          </CardTitle>
          <CardDescription>
            Выберите класс для управления студентами
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="grade-select">Выберите класс</Label>
              <Select value={selectedGradeId?.toString() || ""} onValueChange={(value) => setSelectedGradeId(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите класс..." />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade.id} value={grade.id.toString()}>
                      {grade.grade} - {grade.curatorName} ({grade.actualStudentCount || 0} студентов)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={openCreateDialog} 
              disabled={!selectedGradeId}
              className="flex items-center gap-2"
            >
              <Plus size={16} /> Добавить студента
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected Grade Info */}
      {selectedGrade && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Класс {selectedGrade.grade}</span>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  Куратор: {selectedGrade.curatorName}
                </Badge>
                <Badge variant="outline">
                  {selectedGrade.shanyrak}
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              Фактическое количество студентов: {students.length} | 
              Записанное количество: {selectedGrade.studentCount || 0}
              {students.length !== (selectedGrade.studentCount || 0) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-2"
                  onClick={handleUpdateStudentCount}
                >
                  Синхронизировать
                </Button>
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Students List */}
      {selectedGradeId && (
        <Card>
          <CardHeader>
            <CardTitle>Студенты</CardTitle>
            <CardDescription>
              {loading ? 'Загрузка...' : `Всего студентов: ${students.length}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Загрузка студентов...</div>
            ) : students.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                В этом классе пока нет студентов.
                <br />
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={openCreateDialog}
                >
                  Добавить первого студента
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-3 border-b border-gray-200 font-semibold">ID</th>
                      <th className="p-3 border-b border-gray-200 font-semibold">Имя</th>
                      <th className="p-3 border-b border-gray-200 font-semibold">Email</th>
                      <th className="p-3 border-b border-gray-200 font-semibold text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="p-3 border-b border-gray-200 font-mono text-sm">{student.id}</td>
                        <td className="p-3 border-b border-gray-200 font-medium">{student.name}</td>
                        <td className="p-3 border-b border-gray-200 text-gray-600">
                          {student.email || 'Не указан'}
                        </td>
                        <td className="p-3 border-b border-gray-200 text-right">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleDeleteClick(student)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Удалить студента"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Student Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить студента</DialogTitle>
            <DialogDescription>
              Добавление нового студента в класс {selectedGrade?.grade}. 
              Предметы и оценки добавляются отдельно через загрузку Excel файлов.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="student-name">Имя студента *</Label>
              <Input
                id="student-name"
                name="name"
                placeholder="Введите полное имя"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="student-email">Email (необязательно)</Label>
              <Input
                id="student-email"
                name="email"
                type="email"
                placeholder="student@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="student-subject">Предмет (необязательно)</Label>
              <Select 
                value={formData.subject} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                disabled={subjectsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={subjectsLoading ? "Загрузка..." : "Выберите предмет"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Без предмета</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button 
              onClick={handleCreateStudent}
              disabled={!formData.name.trim()}
            >
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Student Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить студента</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить студента "{currentStudent?.name}"? 
              Это также удалит все связанные с ним оценки. Это действие нельзя отменить.
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
              onClick={handleDeleteStudent}
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 