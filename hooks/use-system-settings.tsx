'use client';

import { useState, useEffect, useCallback } from 'react';
import api, { SystemSettings, AvailableClassesResponse, UpdateSystemSettingsRequest } from '@/lib/api';
import { toast } from 'react-toastify';

interface UseSystemSettingsReturn {
  settings: SystemSettings | null;
  loading: boolean;
  error: string | null;
  updateSettings: (data: UpdateSystemSettingsRequest) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

export function useSystemSettings(): UseSystemSettingsReturn {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getSystemSettings();
      setSettings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load system settings');
      console.error('Error fetching system settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (data: UpdateSystemSettingsRequest) => {
    try {
      setError(null);
      const updatedSettings = await api.updateSystemSettings(data);
      setSettings(updatedSettings);
      toast.success('Настройки системы обновлены');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update system settings';
      setError(errorMessage);
      toast.error(`Ошибка обновления настроек: ${errorMessage}`);
      throw err;
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refreshSettings
  };
}

interface UseAvailableClassesReturn {
  classes: string[];
  grades: number[];
  loading: boolean;
  error: string | null;
  refreshClasses: () => Promise<void>;
}

export function useAvailableClasses(): UseAvailableClassesReturn {
  const [data, setData] = useState<AvailableClassesResponse>({ classes: [], grades: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAvailableClasses();
      setData(response);
    } catch (err: any) {
      setError(err.message || 'Failed to load available classes');
      console.error('Error fetching available classes:', err);
      
      // Fallback to default classes if API fails
      const defaultGrades = [7, 8, 9, 10, 11, 12];
      const defaultLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
      const defaultClasses: string[] = [];
      
      defaultGrades.forEach(grade => {
        defaultLetters.forEach(letter => {
          defaultClasses.push(`${grade}${letter}`);
        });
      });
      
      setData({
        classes: defaultClasses,
        grades: defaultGrades
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshClasses = useCallback(async () => {
    await fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    classes: data.classes,
    grades: data.grades,
    loading,
    error,
    refreshClasses
  };
}

// Helper hook to get class options grouped by grade
interface UseClassOptionsReturn {
  classOptions: Array<{ grade: number; classes: string[] }>;
  allClasses: string[];
  grades: number[];
  loading: boolean;
  error: string | null;
}

export function useClassOptions(): UseClassOptionsReturn {
  const { classes, grades, loading, error } = useAvailableClasses();

  const classOptions = grades.map(grade => ({
    grade,
    classes: classes.filter(className => className.startsWith(grade.toString()))
  }));

  return {
    classOptions,
    allClasses: classes,
    grades,
    loading,
    error
  };
}



