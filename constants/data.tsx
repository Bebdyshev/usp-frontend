import { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  url: string;
  icon?: keyof typeof Icons;
  isActive?: boolean;
  items?: NavSubItem[];
}

export interface NavSubItem {
  title: string;
  url: string;
}

export interface ClassInfo {
  id: number;
  class_liter: string;
  students_count?: number;
  curator?: string;
}

// Import using relative path instead of alias
import { Icons } from '../components/icons';

export const navItems: NavItem[] = [
  {
    title: 'Главная',
    url: 'http://localhost:3000/d/dashboard',
    icon: 'dashboard',
    isActive: true
  },
  {
    title: 'Пользователи',
    url: 'http://localhost:3000/d/profile',
    icon: 'users',
    items: [
      {
        title: 'Все пользователи',
        url: 'http://localhost:3000/d/profile/'
      },
      {
        title: 'Преподаватели',
        url: 'http://localhost:3000/d/profile/'
      },
      {
        title: 'Ученики',
        url: 'http://localhost:3000/d/profile/'
      }
    ]
  },
  {
    title: 'Студенты',
    url: 'http://localhost:3000/d/students',
    icon: 'forms'
  },
  {
    title: 'Настройки',
    url: 'http://localhost:3000/d/settings',
    icon: 'settings'
  }
]; 

// Sample class data
export const classData: ClassInfo[] = [
  { id: 1, class_liter: '11A', students_count: 16, curator: 'Макарова И.Л.' },
  { id: 2, class_liter: '11B', students_count: 16, curator: 'Орлов С.В.' },
  { id: 3, class_liter: '11C', students_count: 16, curator: 'Козлова Т.М.' },
  { id: 4, class_liter: '11D', students_count: 16, curator: 'Никитин А.А.' },
  { id: 5, class_liter: '11E', students_count: 16, curator: 'Соловьева Е.С.' },
  { id: 6, class_liter: '11F', students_count: 16, curator: 'Лебедев П.К.' },
  { id: 7, class_liter: '11G', students_count: 16, curator: 'Комарова М.Р.' },
  { id: 8, class_liter: '11H', students_count: 16, curator: 'Титов Д.И.' }
];

// Sample subject data
export const subjectData = [
  {
    subjects: [
      'Математика',
      'Русский язык',
      'Литература',
      'Физика',
      'Химия',
      'Биология',
      'История',
      'География',
      'Английский язык',
      'Информатика'
    ]
  }
]; 