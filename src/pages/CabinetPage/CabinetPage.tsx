import React from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import {
  CalendarDays,
  CarFront,
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
import { useT, type TranslationKey } from '@/shared/i18n';
import { ProfileTab } from './tabs/ProfileTab';
import { TripsTab } from './tabs/TripsTab';
import { FavoritesTab } from './tabs/FavoritesTab';
import { SettingsTab } from './tabs/SettingsTab';
import { HostBookingsTab, CalendarTab, ReviewsTab, StatsTab } from './tabs/HostTabs';
import { ListingsTab } from './tabs/ListingsTab';
import { VehiclesTab } from './tabs/VehiclesTab';
import styles from './CabinetPage.module.scss';

interface MenuItem {
  tab: string;
  label: TranslationKey;
  icon: LucideIcon;
  /** Items that live on their own page (the messenger). */
  href?: string;
}

const GUEST_MENU: MenuItem[] = [
  { tab: 'profile', label: 'cabinet.menu.profile', icon: UserRound },
  { tab: 'trips', label: 'cabinet.menu.trips', icon: NotebookTabs },
  { tab: 'favorites', label: 'cabinet.menu.favorites', icon: Heart },
  { tab: 'messages', label: 'cabinet.menu.messages', icon: MessageSquareText, href: '/messages' },
  { tab: 'settings', label: 'cabinet.menu.settings', icon: Settings },
];

const HOST_MENU: MenuItem[] = [
  { tab: 'profile', label: 'cabinet.menu.profile', icon: UserRound },
  { tab: 'listings', label: 'cabinet.menu.listings', icon: LayoutList },
  { tab: 'vehicles', label: 'cabinet.menu.vehicles', icon: CarFront },
  { tab: 'trips', label: 'cabinet.menu.hostTrips', icon: NotebookTabs },
  { tab: 'calendar', label: 'cabinet.menu.calendar', icon: CalendarDays },
  { tab: 'messages', label: 'cabinet.menu.messages', icon: MessageSquareText, href: '/messages' },
  { tab: 'reviews', label: 'cabinet.menu.reviews', icon: Star },
  { tab: 'stats', label: 'cabinet.menu.stats', icon: ChartColumn },
  { tab: 'settings', label: 'cabinet.menu.settings', icon: Settings },
];

/** Personal cabinet for guests and hosts: sidebar menu + tab content. */
export const CabinetPage: React.FC = () => {
  const [params] = useSearchParams();
  const { t } = useT();
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
    case 'vehicles':
      content = <VehiclesTab user={user} />;
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
      <aside className={styles.sidebar}>
        <nav className={styles.menu} aria-label={t('cabinet.menuLabel')}>
          {menu.map(({ tab: id, label, icon: Icon, href }) => {
            const active = !href && id === tab;
            return (
              <Link
                key={id}
                to={href ?? `/cabinet?tab=${id}`}
                className={clsx(styles.menuItem, active && styles.menuActive)}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={26} strokeWidth={1.4} />
                <span>{t(label)}</span>
                {id === 'messages' && unread > 0 && <span className={styles.menuBadge}>{unread}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div key={tab} className={styles.content}>
        {content}
      </div>
    </div>
  );
};
