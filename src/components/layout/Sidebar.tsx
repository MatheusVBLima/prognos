'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    HomeIcon,
    TrendingUpIcon,
    HistoryIcon,
    SettingsIcon
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    title: 'Tendências',
    href: '/trends',
    icon: TrendingUpIcon
  },
  {
    title: 'Histórico',
    href: '/history',
    icon: HistoryIcon
  },
  {
    title: 'Configurações',
    href: '/settings',
    icon: SettingsIcon
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="pb-12 w-64 border-r">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  pathname === item.href ? "bg-accent" : "transparent"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 