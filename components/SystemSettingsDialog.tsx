'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Plus, 
  X, 
  School, 
  Calendar,
  Users,
  BookOpen,
  GraduationCap,
  AlertCircle,
  Check,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useSystemSettings } from '@/hooks/use-system-settings';
import api from '@/lib/api';

interface SystemSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SystemSettingsDialog({ open, onOpenChange }: SystemSettingsDialogProps) {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [user, setUser] = useState<any>(null);
  const { settings, loading, error, updateSettings, refreshSettings } = useSystemSettings();
  
  const [formData, setFormData] = useState({
    min_grade: 7,
    max_grade: 12,
    class_letters: ['A', 'B', 'C', 'D', 'E', 'F'],
    school_name: 'НИШ ЕМН г.Актобе',
    academic_year: '2024-2025'
  });
  
  const [newLetter, setNewLetter] = useState('');
  const [saving, setSaving] = useState(false);

  // Load current user
  useEffect(() => {
    const loadUser = async () => {
      if (isAuthenticated && !authLoading) {
        try {
          const userData = await api.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user:', error);
          router.push('/signin');
        }
      }
    };
    
    loadUser();
  }, [isAuthenticated, authLoading, router]);

  // Check if user is admin
  useEffect(() => {
    if (!authLoading && user && user.type !== 'admin') {
      toast.error('Доступ запрещен. Только администраторы могут управлять настройками системы.');
      onOpenChange(false);
    }
  }, [user, authLoading, onOpenChange]);

  // Load settings into form
  useEffect(() => {
    if (settings) {
      setFormData({
        min_grade: settings.min_grade,
        max_grade: settings.max_grade,
        class_letters: [...settings.class_letters],
        school_name: settings.school_name || 'Школа',
        academic_year: settings.academic_year
      });
    }
  }, [settings]);

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

  const addClassLetter = () => {
    if (!newLetter.trim()) {
      toast.error('Введите букву класса');
      return;
    }
    
    const letter = newLetter.trim().toUpperCase();
    
    if (formData.class_letters.includes(letter)) {
      toast.error('Эта буква уже существует');
      return;
    }
    
    if (letter.length !== 1 || !/^[A-Z]$/.test(letter)) {
      toast.error('Буква должна быть одним символом A-Z');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      class_letters: [...prev.class_letters, letter].sort()
    }));
    setNewLetter('');
  };

  const removeClassLetter = (letter: string) => {
    if (formData.class_letters.length <= 1) {
      toast.error('Должна остаться хотя бы одна буква класса');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      class_letters: prev.class_letters.filter(l => l !== letter)
    }));
  };

  const handleSave = async () => {
    // Validation
    if (formData.min_grade >= formData.max_grade) {
      toast.error('Минимальный класс должен быть меньше максимального');
      return;
    }
    
    if (formData.min_grade < 1 || formData.max_grade > 12) {
      toast.error('Классы должны быть в диапазоне 1-12');
      return;
    }
    
    if (formData.class_letters.length === 0) {
      toast.error('Должна быть хотя бы одна буква класса');
      return;
    }
    
    if (!formData.academic_year.trim()) {
      toast.error('Введите учебный год');
      return;
    }

    setSaving(true);
    try {
      await updateSettings(formData);
      toast.success('Настройки системы сохранены');
      onOpenChange(false);
    } catch (error) {
      // Error already handled in hook
    } finally {
      setSaving(false);
    }
  };

  const calculateTotalClasses = () => {
    const gradeCount = formData.max_grade - formData.min_grade + 1;
    return gradeCount * formData.class_letters.length;
  };

  if (authLoading || loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Системные настройки
            </DialogTitle>
            <DialogDescription>
              Управление конфигурацией школьной системы
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-gray-400" />
              <p className="mt-2 text-gray-500">Загрузка настроек...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!user || user.type !== 'admin') {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Системные настройки
          </DialogTitle>
          <DialogDescription>
            Управление конфигурацией школьной системы
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <School className="h-4 w-4" />
                Основные
              </TabsTrigger>
              <TabsTrigger value="classes" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Классы
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Предварительный просмотр
              </TabsTrigger>
            </TabsList>

            {/* General Settings Tab */}
            <TabsContent value="general" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <School className="h-5 w-5" />
                      Информация о школе
                    </CardTitle>
                    <CardDescription>
                      Основные параметры учебного заведения
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="school_name">Название школы</Label>
                      <Input
                        id="school_name"
                        name="school_name"
                        value={formData.school_name}
                        onChange={handleInputChange}
                        placeholder="Введите название школы"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="academic_year" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Учебный год
                      </Label>
                      <Input
                        id="academic_year"
                        name="academic_year"
                        value={formData.academic_year}
                        onChange={handleInputChange}
                        placeholder="2024-2025"
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Диапазон классов
                    </CardTitle>
                    <CardDescription>
                      Настройка параллелей в школе
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="min_grade">Минимальный класс</Label>
                        <Input
                          id="min_grade"
                          name="min_grade"
                          type="number"
                          min="1"
                          max="12"
                          value={formData.min_grade}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="max_grade">Максимальный класс</Label>
                        <Input
                          id="max_grade"
                          name="max_grade"
                          type="number"
                          min="1"
                          max="12"
                          value={formData.max_grade}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Будут созданы классы с {formData.min_grade} по {formData.max_grade} параллель
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Classes Management Tab */}
            <TabsContent value="classes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Управление буквами классов
                  </CardTitle>
                  <CardDescription>
                    Добавляйте и удаляйте буквенные обозначения классов
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Letters */}
                  <div className="space-y-3">
                    <Label>Текущие буквы классов</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.class_letters.map((letter) => (
                        <Badge 
                          key={letter} 
                          variant="secondary" 
                          className="flex items-center gap-2 px-3 py-1"
                        >
                          <span className="font-medium">{letter}</span>
                          <button
                            onClick={() => removeClassLetter(letter)}
                            className="hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                            disabled={formData.class_letters.length <= 1}
                            title={formData.class_letters.length <= 1 ? "Должна остаться хотя бы одна буква" : "Удалить букву"}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Add New Letter */}
                  <div className="space-y-3">
                    <Label>Добавить новую букву</Label>
                    <div className="flex gap-3">
                      <Input
                        value={newLetter}
                        onChange={(e) => setNewLetter(e.target.value.toUpperCase())}
                        placeholder="A-Z"
                        maxLength={1}
                        className="w-20 text-center font-medium"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addClassLetter();
                          }
                        }}
                      />
                      <Button onClick={addClassLetter} disabled={!newLetter.trim()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить букву
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Введите букву от A до Z для создания новых классов
                    </p>
                  </div>

                  {/* Quick Add Common Letters */}
                  <div className="space-y-3">
                    <Label>Быстрое добавление</Label>
                    <div className="flex flex-wrap gap-2">
                      {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((letter) => (
                        <Button
                          key={letter}
                          variant={formData.class_letters.includes(letter) ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (!formData.class_letters.includes(letter)) {
                              setFormData(prev => ({
                                ...prev,
                                class_letters: [...prev.class_letters, letter].sort()
                              }));
                            }
                          }}
                          disabled={formData.class_letters.includes(letter)}
                          className="w-10 h-10"
                        >
                          {formData.class_letters.includes(letter) ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            letter
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Предварительный просмотр классов
                  </CardTitle>
                  <CardDescription>
                    Все классы, которые будут доступны в системе
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{calculateTotalClasses()}</div>
                        <div className="text-sm text-muted-foreground">Всего классов</div>
                      </div>
                      <Separator orientation="vertical" className="h-12" />
                      <div className="text-center">
                        <div className="text-2xl font-bold">{formData.max_grade - formData.min_grade + 1}</div>
                        <div className="text-sm text-muted-foreground">Параллелей</div>
                      </div>
                      <Separator orientation="vertical" className="h-12" />
                      <div className="text-center">
                        <div className="text-2xl font-bold">{formData.class_letters.length}</div>
                        <div className="text-sm text-muted-foreground">Букв классов</div>
                      </div>
                    </div>
                    
                    {/* Classes Grid */}
                    <div className="space-y-4">
                      {Array.from({ length: formData.max_grade - formData.min_grade + 1 }, (_, i) => {
                        const grade = formData.min_grade + i;
                        return (
                          <div key={grade} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-medium">
                                {grade} параллель
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {formData.class_letters.length} {formData.class_letters.length === 1 ? 'класс' : 'классов'}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 pl-4">
                              {formData.class_letters.map((letter) => (
                                <Badge key={`${grade}${letter}`} variant="secondary" className="text-sm">
                                  {grade}{letter}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              size="lg"
              className="flex items-center gap-2"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? 'Сохранение...' : 'Сохранить все настройки'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
