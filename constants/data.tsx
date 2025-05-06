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
  { id: 1, class_liter: '1А', students_count: 25, curator: 'Иванов И.И.' },
  { id: 2, class_liter: '1Б', students_count: 23, curator: 'Петрова А.В.' },
  { id: 3, class_liter: '1В', students_count: 24, curator: 'Сидорова Е.П.' },
  { id: 4, class_liter: '2А', students_count: 27, curator: 'Кузнецова М.А.' },
  { id: 5, class_liter: '2Б', students_count: 26, curator: 'Новиков Д.С.' },
  { id: 6, class_liter: '3А', students_count: 28, curator: 'Морозова К.Д.' },
  { id: 7, class_liter: '3Б', students_count: 25, curator: 'Соколов Г.В.' },
  { id: 8, class_liter: '4А', students_count: 24, curator: 'Волкова Н.И.' },
  { id: 9, class_liter: '5А', students_count: 26, curator: 'Зайцев П.А.' },
  { id: 10, class_liter: '5Б', students_count: 27, curator: 'Миронова Т.С.' },
  { id: 11, class_liter: '6А', students_count: 25, curator: 'Давыдов А.Н.' },
  { id: 12, class_liter: '7А', students_count: 23, curator: 'Антонова Ю.В.' },
  { id: 13, class_liter: '8А', students_count: 22, curator: 'Киселев С.М.' },
  { id: 14, class_liter: '9А', students_count: 24, curator: 'Смирнова О.Д.' },
  { id: 15, class_liter: '10А', students_count: 20, curator: 'Гусев В.К.' },
  { id: 16, class_liter: '11А', students_count: 19, curator: 'Макарова И.Л.' }
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