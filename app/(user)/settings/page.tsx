'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import { Settings, Save, RefreshCw, Plus, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useSystemSettings } from '@/hooks/use-system-settings';
import api from '@/lib/api';

export default function SystemSettingsPage() {
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
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

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
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-gray-400" />
            <p className="mt-2 text-gray-500">Загрузка настроек...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!user || user.type !== 'admin') {
    return null;
  }

  return (
    <PageContainer scrollable>
      <div className="py-4 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Системные настройки
            </h1>
            <p className="text-gray-600 mt-1">
              Управление конфигурацией школьной системы
            </p>
          </div>
          <Button onClick={() => refreshSettings()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Обновить
          </Button>
        </div>

        {error && (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="p-4 text-red-600">
              {error}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Основные настройки</CardTitle>
              <CardDescription>
                Общие параметры школьной системы
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
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="school_name">Название школы</Label>
                <Input
                  id="school_name"
                  name="school_name"
                  value={formData.school_name}
                  onChange={handleInputChange}
                  placeholder="Введите название школы"
                />
              </div>
              
              <div>
                <Label htmlFor="academic_year">Учебный год</Label>
                <Input
                  id="academic_year"
                  name="academic_year"
                  value={formData.academic_year}
                  onChange={handleInputChange}
                  placeholder="2024-2025"
                />
              </div>
            </CardContent>
          </Card>

          {/* Class Letters */}
          <Card>
            <CardHeader>
              <CardTitle>Буквы классов</CardTitle>
              <CardDescription>
                Управление буквенными обозначениями классов
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.class_letters.map((letter) => (
                  <Badge 
                    key={letter} 
                    variant="secondary" 
                    className="flex items-center gap-1"
                  >
                    {letter}
                    <button
                      onClick={() => removeClassLetter(letter)}
                      className="ml-1 hover:bg-red-200 rounded-full p-0.5"
                      disabled={formData.class_letters.length <= 1}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={newLetter}
                  onChange={(e) => setNewLetter(e.target.value.toUpperCase())}
                  placeholder="Новая буква (A-Z)"
                  maxLength={1}
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addClassLetter();
                    }
                  }}
                />
                <Button onClick={addClassLetter} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Предварительный просмотр</CardTitle>
            <CardDescription>
              Классы, которые будут доступны в системе
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Всего классов: <strong>{calculateTotalClasses()}</strong>
              </div>
              
              <div className="grid gap-2">
                {Array.from({ length: formData.max_grade - formData.min_grade + 1 }, (_, i) => {
                  const grade = formData.min_grade + i;
                  return (
                    <div key={grade} className="flex items-center gap-2">
                      <span className="font-medium w-8">{grade}:</span>
                      <div className="flex flex-wrap gap-1">
                        {formData.class_letters.map((letter) => (
                          <Badge key={`${grade}${letter}`} variant="outline" className="text-xs">
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

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? 'Сохранение...' : 'Сохранить настройки'}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}