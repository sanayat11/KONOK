import React from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import {
  CalendarDays,
  ChartColumn,
  Heart,
  LayoutList,
  MessageSquareText,
  NotebookTabs,
  Settings,
  Star,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { useAuthStore } from '@/shared/lib/store/useAuthStore';
import { useUnreadCount } from '@/entities/chat';
import { ProfileTab } from './tabs/ProfileTab';
import { TripsTab } from './tabs/TripsTab';
import { FavoritesTab } from './tabs/FavoritesTab';
import { SettingsTab } from './tabs/SettingsTab';
import { ListingsTab, HostBookingsTab, CalendarTab, ReviewsTab, StatsTab } from './tabs/HostTabs';
import styles from './CabinetPage.module.scss';

interface MenuItem {
  tab: string;
  label: string;
  icon: LucideIcon;
  /** Items that live on their own page (the messenger). */
  href?: string;
}

const GUEST_MENU: MenuItem[] = [
  { tab: 'profile', label: 'Профиль', icon: UserRound },
  { tab: 'trips', label: 'Мои бронирования', icon: NotebookTabs },
  { tab: 'favorites', label: 'Избранное', icon: Heart },
  { tab: 'settings', label: 'Настройки', icon: Settings },
];

// Figma "Профиль хозяина" sidebar.
const HOST_MENU: MenuItem[] = [
  { tab: 'profile', label: 'Профиль', icon: UserRound },
  { tab: 'listings', label: 'Мои объявления', icon: LayoutList },
  { tab: 'trips', label: 'Бронирование', icon: NotebookTabs },
  { tab: 'calendar', label: 'Календарь', icon: CalendarDays },
  { tab: 'messages', label: 'Сообщения', icon: MessageSquareText, href: '/messages' },
  { tab: 'reviews', label: 'Отзывы', icon: Star },
  { tab: 'stats', label: 'Статистика', icon: ChartColumn },
  { tab: 'settings', label: 'Настройки', icon: Settings },
];

/** Figma "Профиль гостя" / "Профиль хозяина": sidebar menu + tab content. */
export const CabinetPage: React.FC = () => {
  const [params] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const unread = useUnreadCount(user?.id);

  if (!user) return <Navigate to="/auth?mode=login" replace />;

  const isOwner = user.role === 'host' || user.role === 'guide';
  const menu = isOwner ? HOST_MENU : GUEST_MENU;
  const requested = params.get('tab') ?? 'profile';
  const tab = menu.some((item) => item.tab === requested && !item.href) ? requested : 'profile';

  let content: React.ReactNode;
  switch (tab) {
    case 'trips':
      content = isOwner ? <HostBookingsTab /> : <TripsTab />;
      break;
    case 'favorites':
      content = <FavoritesTab />;
      break;
    case 'settings':
      content = <SettingsTab user={user} />;
      break;
    case 'listings':
      content = <ListingsTab user={user} />;
      break;
    case 'calendar':
      content = <CalendarTab />;
      break;
    case 'reviews':
      content = <ReviewsTab user={user} />;
      break;
    case 'stats':
      content = <StatsTab user={user} />;
      break;
    default:
      content = <ProfileTab key={user.id} user={user} />;
  }

  return (
    <div className={styles.page}>
      <nav className={styles.sidebar} aria-label="Личный кабинет">
        {menu.map(({ tab: id, label, icon: Icon, href }) => {
          const active = !href && id === tab;
          return (
            <Link
              key={id}
              to={href ?? `/cabinet?tab=${id}`}
              className={clsx(styles.menuItem, active && styles.menuActive)}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={30} strokeWidth={1.4} />
              <span>{label}</span>
              {id === 'messages' && unread > 0 && <span className={styles.menuBadge}>{unread}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={styles.content}>{content}</div>
    </div>
  );
};
