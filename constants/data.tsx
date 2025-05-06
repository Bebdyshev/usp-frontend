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
    url: '/dashboard',
    icon: 'dashboard',
    isActive: true
  },
  {
    title: 'Пользователи',
    url: '/dashboard/users',
    icon: 'users',
    items: [
      {
        title: 'Все пользователи',
        url: '/dashboard/users/all'
      },
      {
        title: 'Преподаватели',
        url: '/dashboard/users/teachers'
      },
      {
        title: 'Ученики',
        url: '/dashboard/users/students'
      }
    ]
  },
  {
    title: 'Формы',
    url: '/dashboard/forms',
    icon: 'forms'
  },
  {
    title: 'Настройки',
    url: '/dashboard/settings',
    icon: 'settings'
  }
]; 