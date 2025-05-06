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