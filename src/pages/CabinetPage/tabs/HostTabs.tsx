import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { CalendarDays, LayoutList, MessagesSquare, NotebookTabs, Star } from 'lucide-react';
import type { Review, UserProfile } from '@/entities/types';
import { mockCars, mockGuides } from '@/shared/api/mocks';
import { ReviewList } from '@/entities/review/ui/ReviewList';
import { useConversations } from '@/entities/chat';
import { useToday } from '@/shared/lib/date';
import { useT } from '@/shared/i18n';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Reveal, revealItem } from '@/shared/ui/Reveal';
import styles from './HostTabs.module.scss';
import t$ from './tabs.module.scss';

/** Listings owned by a host: their cars and/or their own resident profile. */
const useOwnListings = (userId: string) =>
  useMemo(
    () => ({
      cars: mockCars.filter((c) => c.owner.id === userId),
      guides: mockGuides.filter((g) => g.id === userId),
    }),
    [userId],
  );

const Header: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div>
    <h1 className={t$.pageTitle}>{title}</h1>
    <p className={t$.pageSubtitle}>{subtitle}</p>
  </div>
);

export const HostBookingsTab: React.FC = () => {
  const { t } = useT();
  return (
    <div className={t$.tab}>
      <Header title={t('cabinet.hostBookings.title')} subtitle={t('cabinet.hostBookings.subtitle')} />
      <EmptyState
        icon={<NotebookTabs size={22} />}
        title={t('cabinet.hostBookings.emptyTitle')}
        text={t('cabinet.hostBookings.emptyText')}
        action={<Link to="/messages">{t('cabinet.hostBookings.emptyCta')}</Link>}
      />
    </div>
  );
};

export const CalendarTab: React.FC = () => {
  const { t, fmt } = useT();
  const now = useToday();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Monday-first
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  // Localized weekday names, Monday first (2024-01-01 was a Monday).
  const weekdays = Array.from({ length: 7 }, (_, i) => fmt.date(new Date(2024, 0, 1 + i), { weekday: 'short' }));

  return (
    <div className={t$.tab}>
      <Header title={t('cabinet.calendar.title')} subtitle={t('cabinet.calendar.subtitle')} />
      <section className={t$.panel}>
        <h2 className={styles.calendarTitle}>
          <CalendarDays size={22} />
          {fmt.date(first, { month: 'long', year: 'numeric' })}
        </h2>
        <div className={styles.calendar}>
          {weekdays.map((d) => (
            <span key={d} className={styles.weekday}>
              {d}
            </span>
          ))}
          {cells.map((day, i) => (
            <span
              key={i}
              className={clsx(
                styles.day,
                day === now.getDate() && styles.today,
                day !== null && day < now.getDate() && styles.past,
              )}
              aria-current={day === now.getDate() ? 'date' : undefined}
            >
              {day}
            </span>
          ))}
        </div>
        <p className={styles.legend}>{t('cabinet.calendar.legend')}</p>
      </section>
    </div>
  );
};

export const ReviewsTab: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { t } = useT();
  const { cars, guides } = useOwnListings(user.id);
  const reviews: Review[] = [...guides.flatMap((g) => g.reviews), ...cars.flatMap((c) => c.reviews)];

  return (
    <div className={t$.tab}>
      <Header title={t('cabinet.reviews.title')} subtitle={t('cabinet.reviews.subtitle')} />
      {reviews.length ? (
        <section className={t$.panel}>
          <ReviewList reviews={reviews} />
        </section>
      ) : (
        <EmptyState icon={<Star size={22} />} title={t('cabinet.reviews.empty')} />
      )}
    </div>
  );
};

export const StatsTab: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { t } = useT();
  const { cars, guides } = useOwnListings(user.id);
  const conversations = useConversations(user.id);
  const listings = [...cars, ...guides];
  const reviewsCount = listings.reduce((sum, l) => sum + l.reviewsCount, 0);
  const rating = listings.length ? listings.reduce((sum, l) => sum + l.rating, 0) / listings.length : 0;

  const tiles = [
    { label: t('cabinet.stats.listings'), value: listings.length, icon: LayoutList },
    { label: t('cabinet.stats.rating'), value: rating ? rating.toFixed(1) : '—', icon: Star },
    { label: t('cabinet.stats.reviews'), value: reviewsCount, icon: NotebookTabs },
    { label: t('cabinet.stats.conversations'), value: conversations.length, icon: MessagesSquare },
  ];

  return (
    <div className={t$.tab}>
      <Header title={t('cabinet.stats.title')} subtitle={t('cabinet.stats.subtitle')} />
      <Reveal stagger className={styles.tiles}>
        {tiles.map(({ label, value, icon: Icon }, i) => (
          <div key={label} className={clsx(t$.panel, styles.tile)} {...revealItem(i)}>
            <Icon size={24} className={styles.tileIcon} />
            <p className={styles.tileValue}>{value}</p>
            <p className={styles.tileLabel}>{label}</p>
          </div>
        ))}
      </Reveal>
    </div>
  );
};
