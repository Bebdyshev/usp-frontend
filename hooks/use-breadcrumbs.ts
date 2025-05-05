'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

interface BreadcrumbItem {
  title: string;
  link: string;
}

export function useBreadcrumbs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  return useMemo(() => {
    const items: BreadcrumbItem[] = [
      {
        title: 'Главная',
        link: '/',
      },
    ];

    if (pathname.startsWith('/d')) {
      items.push({
        title: 'Дашборд',
        link: '/d',
      });

      if (pathname.includes('/dashboard')) {
        items.push({
          title: 'Аналитика',
          link: '/d/dashboard',
        });
      } else if (pathname.includes('/students')) {
        items.push({
          title: 'Ученики',
          link: '/d/students',
        });
      }
    } else if (pathname.startsWith('/c')) {
      items.push({
        title: 'Классы',
        link: '/c',
      });

      if (pathname.includes('/class')) {
        const classParam = searchParams.get('class');
        if (classParam) {
          items.push({
            title: `Класс ${classParam.toUpperCase()}`,
            link: `/c/class?class=${classParam}`,
          });
        }
      }
    }

    return items;
  }, [pathname, searchParams]);
} 